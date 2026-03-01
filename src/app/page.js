'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, LogIn } from 'lucide-react';
import { useStore } from '@/lib/store';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useStore();
  const {
    products,
    cart,
    customer,
    heroSlides = [],
    fetchHeroSlides,
    addToCart,
    fetchProducts,
    addToWishlist,
    loadCustomer,
  } = store;

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'cakes');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = ['cakes', 'cupcakes', 'pastries', 'breads', 'cookies', 'brownies', 'combos'];

  // Initial Fetch
  useEffect(() => {
    fetchProducts(selectedCategory || null);
    loadCustomer();
    if (fetchHeroSlides) {
      fetchHeroSlides();
    }
  }, []);

  // Slider Timer Logic
  useEffect(() => {
    if (heroSlides && heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides]);

  const filteredProducts = products.filter((p) => {
    const categoryMatch = !selectedCategory || selectedCategory === '' || p.category === selectedCategory;
    const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const checkWishlist = (productId) => {
    try {
      if (typeof store.isInWishlist === 'function') {
        return store.isInWishlist(productId);
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleAddToCart = (product) => {
    if (!customer) {
      toast.error('Please login to add items to cart');
      router.push('/login?returnUrl=/');
      return;
    }
    addToCart(product);
  };

  const handleWishlist = (productId) => {
    if (!customer) {
      toast.error('Please login to add to wishlist');
      router.push('/login?returnUrl=/');
      return;
    }
    addToWishlist(productId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)' }}>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .logo-animate {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <Toaster position="top-center" />

      {/* Hero Section with Slideshow */}
      <section
        style={{
          position: 'relative',
          height: '450px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          overflow: 'hidden',
          animation: 'slideInUp 0.6s ease-out',
        }}
      >
        {/* Background Slideshow */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {heroSlides && heroSlides.length > 0 ? (
            heroSlides.map((slide, index) => (
              <div
                key={slide._id || index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${slide.image || slide})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 2s ease-in-out',
                }}
              />
            ))
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #be185d 100%)',
              }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            color: 'white'
          }}>
            Urban Bakes -
            <br />
            <span style={{
              display: 'inline-block',
              marginTop: '10px',
              background: 'linear-gradient(90deg, #fce7f3 0%, #e0f2fe 100%)',
              color: '#333',
              padding: '8px 24px',
              borderRadius: '50px',
              fontSize: '32px',
              boxShadow: '0 4px 15px rgba(255, 182, 193, 0.4)',
              transform: 'rotate(-2deg)'
            }}>
              Made with Love 💖
            </span>
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            Premium bakery items delivered fresh to your doorstep. Order now! 🍰
          </p>
          {!customer && (
            <Link href="/login">
              <button
                style={{
                  marginTop: '28px',
                  background: 'white',
                  color: '#db2777',
                  fontWeight: '700',
                  padding: '14px 32px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
              >
                <LogIn size={20} />
                Login to Start Ordering
              </button>
            </Link>
          )}

          {/* Slider Dots */}
          {heroSlides && heroSlides.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '30px',
              position: 'relative',
              zIndex: 2
            }}>
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    background: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <div
        className="container"
        style={{
          marginTop: '40px',
          marginBottom: '40px',
          animation: 'slideInUp 0.6s ease-out 0.2s backwards',
        }}
      >
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
          animation: 'slideInUp 0.6s ease-out 0.2s backwards'
        }}>
          Categories
        </h2>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          animation: 'slideInUp 0.6s ease-out 0.25s backwards'
        }}>
          {categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                fetchProducts(cat);
              }}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s',
                background:
                  selectedCategory === cat
                    ? 'linear-gradient(135deg, #db2777, #ec4899)'
                    : 'white',
                color: selectedCategory === cat ? 'white' : '#333',
                boxShadow:
                  selectedCategory === cat ? '0 4px 15px rgba(219, 39, 119, 0.3)' : 'none',
                transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)',
                animation: `slideInUp 0.6s ease-out ${0.25 + index * 0.05}s backwards`,
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container" style={{ marginBottom: '40px' }}>
        {filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredProducts.map((product, index) => {
              const inWishlist = checkWishlist(product._id);

              return (
                <div
                  key={product._id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(219, 39, 119, 0.1)',
                    transition: 'all 0.3s',
                    position: 'relative',
                    animation: `slideInUp 0.6s ease-out ${0.3 + index * 0.1}s backwards`,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(219, 39, 119, 0.15)';
                    e.currentTarget.style.borderColor = '#db2777';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(219, 39, 119, 0.1)';
                  }}
                >
                  {/* Wishlist Heart */}
                  <button
                    onClick={() => handleWishlist(product._id)}
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
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <Heart
                      size={18}
                      fill={inWishlist ? '#db2777' : 'none'}
                      stroke={inWishlist ? '#db2777' : '#666'}
                    />
                  </button>

                  {/* Product Image */}
                  {product.image && (
                    <Link href={`/product/${product._id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      />
                    </Link>
                  )}

                  <div style={{ padding: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px',
                      }}
                    >
                      <Link
                        href={`/product/${product._id}`}
                        style={{ textDecoration: 'none', flex: 1 }}
                      >
                        <h3
                          style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#333',
                            cursor: 'pointer',
                            margin: 0,
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#db2777';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#333';
                          }}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      {product.badge && (
                        <span
                          style={{
                            background: product.badge === 'hot' ? '#ff6b35' : '#4ade80',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '8px',
                      margin: 0,
                      marginBottom: '8px'
                    }}>
                      {product.desc}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <p style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#db2777',
                          margin: 0,
                          marginBottom: '4px'
                        }}>
                          ₹{product.price}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#f59e0b',
                          margin: 0
                        }}>
                          ⭐ {product.rating}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #db2777, #ec4899)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(219, 39, 119, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            animation: 'slideInUp 0.6s ease-out'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>
              🔍 No products found
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              Try searching for different products or browse other categories
            </p>
          </div>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton cart={cart} />
    </div>
  );
}