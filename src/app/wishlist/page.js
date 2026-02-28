'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, customer, addToCart, removeFromWishlist, fetchWishlist } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      toast.error('Please login to view wishlist');
      router.push('/login?returnUrl=/wishlist');
    } else {
      loadWishlist();
    }
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading wishlist...</p>
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
          alignItems: 'center',
          gap: '16px',
        }}>
          <Link href="/">
            <button className="btn btn-secondary" style={{ padding: '8px' }}>
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              ❤️ My Wishlist
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {wishlist.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffe4e1, #ffc0cb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <Heart size={60} style={{ color: '#ff6b35' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
              Save your favorite items here to buy them later!
            </p>
            <Link href="/">
              <button className="btn btn-primary" style={{ padding: '12px 32px' }}>
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {wishlist.map((product, index) => (
              <div
                key={product._id}
                className="card"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`,
                  position: 'relative',
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product._id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s',
                    zIndex: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <Trash2 size={18} style={{ color: '#ef4444' }} />
                </button>

                {/* Product Image */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                <div style={{ padding: '16px' }}>
                  {/* Product Info */}
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '4px',
                    }}>
                      {product.name}
                    </h3>
                    {product.desc && (
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        {product.desc}
                      </p>
                    )}
                  </div>

                  {/* Price & Rating */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'var(--primary)',
                      }}>
                        ₹{product.price}
                      </p>
                      {product.discount > 0 && (
                        <p style={{
                          fontSize: '12px',
                          color: '#10b981',
                          fontWeight: '600',
                        }}>
                          {product.discount}% OFF
                        </p>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px',
                      color: '#f59e0b',
                    }}>
                      ⭐ {product.rating}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      gap: '8px',
                    }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}