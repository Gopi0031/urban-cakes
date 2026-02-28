'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';

export default function AdminCoupons() {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    discountType: 'percentage',
    minOrderAmount: '',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: '',
    active: true,
  });

  useEffect(() => {
    const authorized = localStorage.getItem('adminLoggedIn');
    if (!authorized) {
      router.push('/admin/login');
    } else {
      fetchCoupons();
    }
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/api/coupons/all');
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { data } = await axios.put(`/api/coupons?id=${editingId}`, formData);
        if (data.success) {
          toast.success('Coupon updated!');
          fetchCoupons();
        }
      } else {
        const { data } = await axios.post('/api/coupons', formData);
        if (data.success) {
          toast.success('Coupon created!');
          fetchCoupons();
        }
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this coupon?')) {
      try {
        await axios.delete(`/api/coupons?id=${id}`);
        toast.success('Coupon deleted!');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType,
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      active: coupon.active,
    });
    setEditingId(coupon._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      discountType: 'percentage',
      minOrderAmount: '',
      maxDiscount: '',
      expiryDate: '',
      usageLimit: '',
      active: true,
    });
    setEditingId(null);
    setShowForm(false);
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
              <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#333',
              }}>
                🏷️ Coupon Management
              </h1>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Create and manage discount coupons
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
            style={{ gap: '8px' }}
          >
            <Plus size={20} />
            New Coupon
          </button>
        </div>
      </header>

      {/* Coupons List */}
      <main className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="grid grid-2">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '16px',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  display: 'inline-block',
                }}>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'monospace',
                  }}>
                    {coupon.code}
                  </p>
                </div>
                
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: coupon.active ? '#d1fae5' : '#fee2e2',
                  color: coupon.active ? '#065f46' : '#991b1b',
                }}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                  marginBottom: '8px',
                }}>
                  {coupon.discountType === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                </p>
                
                <div style={{
                  display: 'grid',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#666',
                }}>
                  {coupon.minOrderAmount > 0 && (
                    <p>Min Order: ₹{coupon.minOrderAmount}</p>
                  )}
                  {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                    <p>Max Discount: ₹{coupon.maxDiscount}</p>
                  )}
                  {coupon.expiryDate && (
                    <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  )}
                  {coupon.usageLimit && (
                    <p>Uses: {coupon.usedCount}/{coupon.usageLimit}</p>
                  )}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}>
                <button
                  onClick={() => handleEdit(coupon)}
                  className="btn"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '8px',
                    fontSize: '14px',
                    gap: '4px',
                  }}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="btn"
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '8px',
                    fontSize: '14px',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {coupons.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
          }}>
            <Tag size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px' }}>No coupons created yet</p>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
            }}>
              {editingId ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>

            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gap: '20px',
            }}>
              <div>
                <label className="form-label">Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                  className="form-input"
                  required
                  maxLength={20}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="20"
                    className="form-input"
                    required
                    min="1"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="500"
                    className="form-input"
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="form-label">Max Discount (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="200"
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="form-label">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
              }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="active" style={{ fontSize: '14px', fontWeight: '600' }}>
                  Active (visible to customers)
                </label>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '16px',
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}