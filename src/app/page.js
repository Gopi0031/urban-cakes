'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X, Plus, Minus, Heart, LogIn } from 'lucide-react';
import { useStore } from '@/lib/store';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const store = useStore();
  const {
    products,
    cart,
    customer,
    heroSlides = [], // Get slides from store
    fetchHeroSlides, // Get the fetch action
    addToCart,
    removeFromCart,
    updateQuantity,
    fetchProducts,
    addToWishlist,
    logout,
    loadCustomer,
  } = store;

  const [selectedCategory, setSelectedCategory] = useState('cakes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = ['cakes', 'cupcakes', 'pastries', 'breads', 'cookies', 'brownies', 'combos'];

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
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
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroSlides]);

  const filteredProducts = products.filter((p) => {
    const categoryMatch = p.category === selectedCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Safe wishlist check
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

  // Handle Add to Cart - Require Login
  const handleAddToCart = (product) => {
    if (!customer) {
      toast.error('Please login to add items to cart');
      router.push('/login?returnUrl=/');
      return;
    }
    addToCart(product);
  };

  // Handle Wishlist - Require Login
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
      <Toaster position="top-center" />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          animation: 'slideInDown 0.6s ease-out',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                background:
                  'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              🍰 Urban Bakes
            </div>
          </Link>

          {/* Search */}
          <div
            style={{
              display: 'flex',
              flex: '1',
              maxWidth: '300px',
              margin: '0 20px',
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          {/* User Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {customer ? (
              <>
                {/* Logged In User */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f9fafb',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    {customer.name?.split(' ')[0]}
                  </span>
                </div>

                <Link href="/wishlist" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <Heart size={22} style={{ color: '#ff6b35' }} />
                  </button>
                </Link>

                <Link href="/my-orders" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#666',
                    }}
                  >
                    📦 Orders
                  </button>
                </Link>

                <button
                  onClick={logout}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#ef4444',
                    fontWeight: '600',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button
                  className="btn btn-primary"
                  style={{
                    padding: '8px 20px',
                    fontSize: '14px',
                    gap: '8px',
                  }}
                >
                  <LogIn size={18} />
                  Login
                </button>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => {
                if (!customer) {
                  toast.error('Please login to view cart');
                  router.push('/login?returnUrl=/');
                  return;
                }
                setShowCart(!showCart);
              }}
              style={{
                position: 'relative',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ShoppingCart style={{ width: '24px', height: '24px', color: '#333' }} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Slideshow */}
      <section
        style={{
          position: 'relative',
          height: '400px',
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
            // Fallback Gradient if no images
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
              }}
            />
          )}
          {/* Dark Overlay for text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Urban Bakes - Made with Love
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '600px', margin: '0 auto', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            Premium bakery items delivered fresh to your doorstep. Order now! 🍰
          </p>
          {!customer && (
            <Link href="/login">
              <button
                className="btn"
                style={{
                  marginTop: '24px',
                  background: 'white',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  padding: '14px 32px',
                  fontSize: '16px',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
              >
                <LogIn size={20} />
                Login to Start Ordering
              </button>
            </Link>
          )}
          
          {/* Slider Dots */}
          {heroSlides && heroSlides.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '30px', position: 'relative', zIndex: 2 }}>
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          Categories
        </h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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
                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : 'white',
                color: selectedCategory === cat ? 'white' : '#333',
                boxShadow:
                  selectedCategory === cat ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none',
                transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)',
                animation: `slideInUp 0.6s ease-out ${0.2 + index * 0.05}s backwards`,
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container" style={{ marginBottom: '40px' }}>
        <div className="grid grid-2">
          {filteredProducts.map((product, index) => {
            const inWishlist = checkWishlist(product._id);

            return (
              <div
                key={product._id}
                className="card animate-scale"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`,
                  position: 'relative',
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
                    fill={inWishlist ? '#ff6b35' : 'none'}
                    stroke={inWishlist ? '#ff6b35' : '#666'}
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
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--primary)';
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

                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
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
                      <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        ₹{product.price}
                      </p>
                      <p style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {product.rating}</p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No products found in this category
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && customer && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
            }}
            onClick={() => setShowCart(false)}
          />

          <div
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              width: '100%',
              maxWidth: '400px',
              background: 'white',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                Cart ({cartCount})
              </h3>
              <button
                onClick={() => setShowCart(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <ShoppingCart
                    size={48}
                    style={{ color: '#d1d5db', margin: '0 auto 16px' }}
                  />
                  <p style={{ color: '#666' }}>Your cart is empty</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        background: '#f9fafb',
                        padding: '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '8px',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#666' }}>₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb',
                              background: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              minWidth: '30px',
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb',
                              background: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  borderTop: '1px solid #e5e7eb',
                  background: '#f9fafb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#333' }}>Total:</span>
                  <span
                    style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)' }}
                  >
                    ₹{cartTotal}
                  </span>
                </div>

                <Link href="/checkout">
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => setShowCart(false)}
                  >
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* WhatsApp Floating Button */}
      <WhatsAppButton cart={cart} />
    </div>
  );
}