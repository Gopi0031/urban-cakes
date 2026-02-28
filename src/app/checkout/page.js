'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, customer, clearCart, createOrder, validateCoupon, appliedCoupon, removeCoupon } =
    useStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Auto-fill customer data
  useEffect(() => {
    if (!customer) {
      toast.error('Please login to checkout');
      router.push('/login?returnUrl=/checkout');
      return;
    }

    // Pre-fill form with customer data
    setFormData((prev) => ({
      ...prev,
      customerName: customer.name || '',
      customerEmail: customer.email || '',
      customerPhone: customer.phone || '',
    }));

    // Pre-fill address if customer has saved address
    if (customer.addresses && customer.addresses.length > 0) {
      const defaultAddress =
        customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
      setFormData((prev) => ({
        ...prev,
        street: defaultAddress.street || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        pincode: defaultAddress.pincode || '',
      }));
    }
  }, [customer, router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    try {
      await validateCoupon(couponCode, subtotal);
    } catch (error) {
      // Error handled in store
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.street) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'razorpay') {
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error('Payment gateway failed to load');
          setLoading(false);
          return;
        }

        // Create Razorpay order
        const { data: orderData } = await axios.post('/api/payment/create-order', {
          amount: total,
        });

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Urban Bakes',
          description: 'Bakery Order',
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              // Verify payment
              await axios.post('/api/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // Create order
              const order = await createOrder({
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                address: {
                  street: formData.street,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                },
                items: cart.map((item) => ({
                  productId: item._id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
                subtotal,
                discount,
                total,
                paymentMethod: 'razorpay',
                paymentStatus: 'paid',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                couponCode: appliedCoupon?.code,
              });

              toast.success('Order placed successfully!');
              router.push(`/order-success?orderId=${order._id}`);
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone,
          },
          theme: {
            color: '#ff6b35',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        // COD
        const order = await createOrder({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          items: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          discount,
          total,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          couponCode: appliedCoupon?.code,
        });

        toast.success('Order placed successfully!');
        router.push(`/order-success?orderId=${order._id}`);
      }
    } catch (error) {
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no cart or no customer
  if (!customer) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <p style={{ fontSize: '18px', color: '#666' }}>Your cart is empty</p>
        <Link href="/">
          <button className="btn btn-primary">Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)', padding: '40px 20px' }}>
      <Toaster position="top-center" />

      <div className="container" style={{ maxWidth: '800px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          Checkout
        </h1>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Customer Details - Auto-filled */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              👤 Customer Details
            </h2>

            <div
              style={{
                background: '#f0fdf4',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #86efac',
              }}
            >
              <p style={{ fontSize: '14px', color: '#166534' }}>
                ✅ Auto-filled from your account. You can edit if needed.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              📍 Delivery Address
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="House No, Street Name, Area"
                  className="form-input"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="form-input"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              🛒 Order Summary
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                  }}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Have a coupon?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="form-input"
                  disabled={!!appliedCoupon}
                  style={{ textTransform: 'uppercase' }}
                />
                {appliedCoupon ? (
                  <button
                    onClick={removeCoupon}
                    className="btn btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Apply
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p
                  style={{
                    fontSize: '14px',
                    color: '#10b981',
                    marginTop: '8px',
                    fontWeight: '600',
                  }}
                >
                  ✅ Coupon applied: -₹{discount}
                </p>
              )}
            </div>

            {/* Totals */}
            <div
              style={{
                borderTop: '2px solid #e5e7eb',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#10b981',
                  }}
                >
                  <span>Discount:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                  paddingTop: '8px',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              💳 Payment Method
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--primary)' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: paymentMethod === 'razorpay' ? '#fff5e1' : 'white',
                }}
              >
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ fontWeight: '600' }}>💳 Pay Online (Razorpay)</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: paymentMethod === 'cod' ? '#fff5e1' : 'white',
                }}
              >
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ fontWeight: '600' }}>💵 Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Place Order */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : `Place Order - ₹${total}`}
          </button>
        </div>
      </div>

      <WhatsAppButton cart={cart} />
    </div>
  );
}