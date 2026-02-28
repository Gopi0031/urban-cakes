'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, ShoppingCart, Users, DollarSign, Package, Star, Download } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#ff6b35', '#f7931e', '#c41e3a', '#8b5cf6', '#10b981', '#3b82f6'];

export default function AdminAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    const authorized = localStorage.getItem('adminLoggedIn');
    if (!authorized) {
      router.push('/admin/login');
    } else {
      fetchAnalytics();
    }
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/analytics?days=${dateRange}`);
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-pulse" style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            border: '4px solid var(--primary)',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ fontSize: '18px', color: '#666' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

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
                📊 Analytics Dashboard
              </h1>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Business insights and performance metrics
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            
            <button className="btn btn-primary" style={{ gap: '8px' }}>
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div className="card" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.2 }}>
              <DollarSign size={100} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <DollarSign size={24} />
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Revenue</p>
              </div>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
                ₹{analytics?.totalRevenue?.toLocaleString() || 0}
              </p>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                <span style={{ color: analytics?.revenueGrowth >= 0 ? '#4ade80' : '#f87171' }}>
                  {analytics?.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(analytics?.revenueGrowth || 0)}%
                </span> from last period
              </p>
            </div>
          </div>

          <div className="card" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.2 }}>
              <ShoppingCart size={100} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <ShoppingCart size={24} />
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Orders</p>
              </div>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
                {analytics?.totalOrders || 0}
              </p>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                Avg: ₹{analytics?.averageOrderValue?.toFixed(0) || 0} per order
              </p>
            </div>
          </div>

          <div className="card" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.2 }}>
              <Users size={100} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Users size={24} />
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Customers</p>
              </div>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
                {analytics?.totalCustomers || 0}
              </p>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                {analytics?.newCustomers || 0} new this period
              </p>
            </div>
          </div>

          <div className="card" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.2 }}>
              <Package size={100} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Package size={24} />
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Products</p>
              </div>
              <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
                {analytics?.totalProducts || 0}
              </p>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                {analytics?.lowStockProducts || 0} low stock items
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '24px',
        }}>
          {/* Revenue Trend */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
              Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.dailyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ff6b35" 
                  strokeWidth={3}
                  dot={{ fill: '#ff6b35', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              📈 Category Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.categoryPerformance || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {analytics?.categoryPerformance?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance Bar Chart */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            📊 Category Performance Comparison
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analytics?.categoryPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="revenue" fill="#ff6b35" radius={[8, 8, 0, 0]} />
              <Bar dataKey="orders" fill="#f7931e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={24} style={{ color: '#fbbf24' }} />
            Top Selling Products
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {analytics?.topProducts?.map((product, index) => (
              <div key={product._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: index === 0 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f9fafb',
                borderRadius: '12px',
                border: index === 0 ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                transition: 'all 0.3s',
              }}
              className="card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: index === 0 ? '#fbbf24' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}>
                  {index + 1}
                </div>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    Sold: <strong>{product.soldCount}</strong> units
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>
                    ₹{product.revenue.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#f59e0b', justifyContent: 'flex-end' }}>
                    <Star size={14} fill="#f59e0b" />
                    {product.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            📦 Order Status Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}>
            {analytics?.orderStatusDistribution?.map((status, index) => (
              <div key={status.status} style={{
                padding: '20px',
                background: `${COLORS[index % COLORS.length]}15`,
                border: `2px solid ${COLORS[index % COLORS.length]}`,
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              className="card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <p style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: COLORS[index % COLORS.length],
                  marginBottom: '8px',
                }}>
                  {status.count}
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#666', 
                  textTransform: 'capitalize',
                  fontWeight: '600',
                }}>
                  {status.status.replace('-', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}