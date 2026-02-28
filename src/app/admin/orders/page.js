'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Eye, Truck, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const authorized = localStorage.getItem('adminLoggedIn');
    if (!authorized) {
      router.push('/admin/login');
    } else {
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/admin/orders?id=${orderId}`, {
        orderStatus: newStatus,
      });

      if (data.success) {
        toast.success('Order status updated!');
        fetchOrders();
        setShowModal(false);
      }
    } catch (error) {
      toast.error('Failed to update order');
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

  const getStatusBadge = (status) => {
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: `${getStatusColor(status)}20`,
        color: getStatusColor(status),
      }}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
    preparing: orders.filter(o => o.orderStatus === 'preparing').length,
    outForDelivery: orders.filter(o => o.orderStatus === 'out-for-delivery').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)' }}>
      <Toaster position="top-center" />

      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin/dashboard">
              <button className="btn btn-secondary" style={{ padding: '8px' }}>
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                📦 Order Management
              </h1>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Manage all customer orders
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Orders</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
              {orderStats.total}
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Pending</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {orderStats.pending}
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Out for Delivery</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {orderStats.outForDelivery}
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Revenue</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
              ₹{orderStats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '16px',
            alignItems: 'end',
          }}>
            <div>
              <label className="form-label">Search Orders</label>
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                }} size={20} />
                <input
                  type="text"
                  placeholder="Search by order number, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
                style={{ minWidth: '200px' }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            <Package size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px' }}>No orders found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredOrders.map((order) => (
              <div key={order._id} className="card" style={{ padding: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto',
                  gap: '20px',
                  alignItems: 'center',
                }}>
                  {/* Order Info */}
                  <div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '4px',
                    }}>
                      {order.orderNumber}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {order.customerName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      📞 {order.customerPhone}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      📧 {order.customerEmail}
                    </p>
                  </div>

                  {/* Amount & Status */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      marginBottom: '8px',
                    }}>
                      ₹{order.total}
                    </p>
                    {getStatusBadge(order.orderStatus)}
                    <p style={{
                      fontSize: '11px',
                      color: '#666',
                      marginTop: '4px',
                    }}>
                      {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Paid'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '14px', gap: '4px' }}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
            }}>
              Order Details - {selectedOrder.orderNumber}
            </h2>

            {/* Customer Details */}
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Customer Information
              </h3>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Address:</strong> {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Order Items
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                  }}>
                    <span>{item.name} x {item.quantity}</span>
                    <span style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '2px solid #e5e7eb',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#10b981' }}>
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                }}>
                  <span>Total:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                Update Order Status
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '8px',
              }}>
                {['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder._id, status)}
                    className="btn"
                    style={{
                      background: selectedOrder.orderStatus === status ? getStatusColor(status) : '#f3f4f6',
                      color: selectedOrder.orderStatus === status ? 'white' : '#666',
                      padding: '10px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                    }}
                  >
                    {status.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}