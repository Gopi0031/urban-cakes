'use client';

import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!phone) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/orders?phone=${phone}`);
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      'out-for-delivery': '#10b981',
      delivered: '#059669',
      cancelled: '#ef4444',
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      'out-for-delivery': Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon size={20} />;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)', padding: '40px 20px' }}>
      <Toaster position="top-center" />
      
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          📦 My Orders
        </h1>

        {/* Search Form */}
        <div className="card" style={{
          padding: '24px',
          marginBottom: '32px',
        }}>
          <label className="form-label">Enter your phone number to view orders</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button
              onClick={fetchOrders}
              className="btn btn-primary"
              disabled={loading || !phone}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '2px solid #f3f4f6',
                }}>
                  <div>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '4px',
                    }}>
                      Order #{order.orderNumber}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: `${getStatusColor(order.orderStatus)}20`,
                    color: getStatusColor(order.orderStatus),
                    fontWeight: '600',
                    fontSize: '14px',
                  }}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '12px',
                  }}>
                    Items:
                  </p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: '#f9fafb',
                          borderRadius: '8px',
                        }}
                      >
                        <span style={{ color: '#333' }}>
                          {item.name} x {item.quantity}
                        </span>
                        <span style={{ fontWeight: '600' }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '2px solid #f3f4f6',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Status: {order.paymentStatus}
                    </p>
                  </div>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                  }}>
                    ₹{order.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : phone && !loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
          }}>
            <Package size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px' }}>No orders found</p>
          </div>
        ) : null}

        {/* Back Button */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/">
            <button className="btn btn-secondary">
              ← Back to Shop
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}