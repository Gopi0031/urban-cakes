'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { setAuth, loadCustomer } = useStore();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin) {
        // Validation for register
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
          toast.error('Please fill all fields');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (formData.phone.length < 10) {
          toast.error('Enter a valid phone number');
          setLoading(false);
          return;
        }
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        // Save auth data
        setAuth(data.customer, data.token);
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('customer', JSON.stringify(data.customer));

        toast.success(isLogin ? 'Welcome back! 🎉' : 'Account created successfully! 🎉');

        // Redirect
        setTimeout(() => {
          router.push(returnUrl);
        }, 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Toaster position="top-center" />

      <div
        className="card"
        style={{
          maxWidth: '450px',
          width: '100%',
          padding: '40px',
          animation: 'scaleIn 0.5s ease-out',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'float 3s ease-in-out infinite',
              fontSize: '40px',
            }}
          >
            🍰
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            Urban Bakes
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {isLogin ? 'Welcome back! Login to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '24px',
            background: '#f3f4f6',
            padding: '4px',
            borderRadius: '8px',
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              background: isLogin ? 'white' : 'transparent',
              color: isLogin ? 'var(--primary)' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: isLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <LogIn size={18} />
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              background: !isLogin ? 'white' : 'transparent',
              color: !isLogin ? 'var(--primary)' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: !isLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <UserPlus size={18} />
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          {/* Name - Register Only */}
          {!isLogin && (
            <div style={{ animation: 'slideInDown 0.3s ease-out' }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="form-input"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="form-input"
              required
            />
          </div>

          {/* Phone - Register Only */}
          {!isLogin && (
            <div style={{ animation: 'slideInDown 0.3s ease-out' }}>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
                className="form-input"
                required
                maxLength={10}
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="form-input"
                required
                minLength={6}
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Minimum 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '8px',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '14px',
              fontSize: '16px',
            }}
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}