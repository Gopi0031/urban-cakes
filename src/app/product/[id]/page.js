'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, ArrowLeft, Star, Package, Truck, Shield } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';
import ReviewSection from '@/components/ReviewSection';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, addToWishlist, isInWishlist, customer } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${params.id}`);
      if (data.success) {
        setProduct(data.product);
        if (data.product.sizes && data.product.sizes.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart({ ...product, selectedSize });
    } else {
      addToCart(product);
    }
  };

  const handleWishlist = () => {
    if (!customer) {
      router.push('/login?returnUrl=/product/' + params.id);
      return;
    }
    addToWishlist(product._id);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Product not found</p>
        <Link href="/">
          <button className="btn btn-primary">Back to Home</button>
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const currentPrice = selectedSize?.price || product.price;
  const finalPrice = currentPrice - (currentPrice * (product.discount || 0)) / 100;

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
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            Product Details
          </h1>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
        }}>
          {/* Product Image */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span style={{
                display: 'inline-block',
                background: product.badge === 'hot' ? '#ff6b35' : '#4ade80',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}>
                {product.badge === 'hot' ? '🔥 HOT' : '⭐ NEW'}
              </span>
            )}

            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px',
            }}>
              {product.name}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={20} fill="#f59e0b" stroke="#f59e0b" />
                <span style={{ fontSize: '16px', fontWeight: '600' }}>
                  {product.rating}
                </span>
              </div>
              <span style={{ color: '#666', fontSize: '14px' }}>
                ({product.totalReviews || 0} reviews)
              </span>
            </div>

            <p style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              {product.desc}
            </p>

            {/* Price */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <p style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                }}>
                  ₹{finalPrice.toFixed(0)}
                </p>
                {product.discount > 0 && (
                  <>
                    <p style={{
                      fontSize: '24px',
                      color: '#9ca3af',
                      textDecoration: 'line-through',
                    }}>
                      ₹{currentPrice}
                    </p>
                    <span style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Select Size</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: selectedSize?.name === size.name ? '2px solid var(--primary)' : '2px solid #e5e7eb',
                        background: selectedSize?.name === size.name ? '#fff5e1' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontWeight: '600',
                      }}
                    >
                      <div>{size.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--primary)' }}>
                        ₹{size.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '12px',
              marginBottom: '32px',
            }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ gap: '8px', padding: '16px' }}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                className="btn"
                style={{
                  background: inWishlist ? '#fee2e2' : 'white',
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '16px',
                }}
              >
                <Heart size={20} fill={inWishlist ? 'var(--primary)' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div style={{
              display: 'grid',
              gap: '16px',
              padding: '24px',
              background: '#f9fafb',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    Fresh Preparation
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Made fresh on order
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    Fast Delivery
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Delivery within 2-3 hours
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    Quality Guaranteed
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    100% satisfaction guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product._id} />
      </main>
    </div>
  );
}