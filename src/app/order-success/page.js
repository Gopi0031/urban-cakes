'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, MapPin, CreditCard, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  const shareOnWhatsApp = () => {
    const message = `🎉 Order Placed Successfully!\n\n📦 Order ID: ${orderId}\n\nThank you for ordering from Urban Bakes! We'll deliver fresh to your doorstep. 🍰`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="card" style={{
        maxWidth: '600px',
        width: '100%',
        padding: '40px',
        textAlign: 'center',
        animation: 'scaleIn 0.5s ease-out',
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'bounce 1s ease-in-out',
        }}>
          <CheckCircle style={{ width: '48px', height: '48px', color: 'white' }} />
        </div>

        {/* Success Message */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '12px',
        }}>
          Order Placed Successfully! 🎉
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '32px',
        }}>
          Thank you for your order! We've received it and will start preparing your delicious treats.
        </p>

        {/* Order ID */}
        {orderId && (
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
            }}>
              Order ID
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#10b981',
              fontFamily: 'monospace',
            }}>
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </div>
        )}

        {/* Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div style={{
            background: '#fff7ed',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #fed7aa',
          }}>
            <Package style={{ width: '24px', height: '24px', color: '#f97316', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '12px', color: '#9a3412', fontWeight: '600' }}>
              Order Confirmed
            </p>
          </div>

          <div style={{
            background: '#eff6ff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
          }}>
            <MapPin style={{ width: '24px', height: '24px', color: '#3b82f6', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>
              Ready to Deliver
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'grid',
          gap: '12px',
        }}>
          <button
            onClick={shareOnWhatsApp}
            className="btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white',
              gap: '8px',
            }}
          >
            <MessageCircle size={20} />
            Track on WhatsApp
          </button>

          <Link href="/">
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Continue Shopping
            </button>
          </Link>

          <Link href="/my-orders">
            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              View My Orders
            </button>
          </Link>
        </div>

        {/* Note */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fde047',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#92400e',
            lineHeight: '1.6',
          }}>
            💡 <strong>Pro Tip:</strong> Save your order ID for tracking. We'll send you updates on WhatsApp!
          </p>
        </div>
      </div>
    </div>
  );
}