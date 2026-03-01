'use client';

import { useState, useEffect, Suspense } from 'react'; // Import Suspense
import { useSearchParams, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from 'next/link';

// 1. Logic Component
function HomeContent() {
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

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
    loadCustomer();
    if (fetchHeroSlides) fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (heroSlides && heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [heroSlides]);

  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory === 'all' || !selectedCategory || p.category === selectedCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

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
    <div style={{ background: '#fff' }}>
      <Toaster position="top-center" />

      {/* Hero Section */}
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
          animation: 'fadeIn 0.6s ease-out',
        }}
      >
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
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Urban Bakes
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
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '600px', margin: '0 auto', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Premium bakery items delivered fresh to your doorstep.
          </p>
        </div>
      </section>

      {/* Category Title */}
      <div className="container" style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#db2777', textTransform: 'capitalize' }}>
          {selectedCategory === 'all' || !selectedCategory ? 'All Products' : `${selectedCategory} Collection`}
        </h2>
        {searchQuery && <p style={{color:'#666'}}>Showing results for "{searchQuery}"</p>}
      </div>

      {/* Products Grid */}
      <div className="container" style={{ marginBottom: '60px', marginTop: '20px' }}>
        <div className="grid grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className="card animate-scale"
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s',
                  border: '1px solid #fff0f5'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <button
                  onClick={() => handleWishlist(product._id)}
                  style={{
                    position: 'absolute', top: '15px', right: '15px',
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'white', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 2
                  }}
                >
                  <Heart size={18} fill={store.isInWishlist && store.isInWishlist(product._id) ? '#ff6b35' : 'none'} stroke={store.isInWishlist && store.isInWishlist(product._id) ? '#ff6b35' : '#666'} />
                </button>

                {product.image && (
                  <Link href={`/product/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    />
                  </Link>
                )}

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{product.name}</h3>
                    {product.badge && (
                      <span style={{ background: product.badge === 'hot' ? '#ff6b35' : '#4ade80', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.4' }}>{product.desc}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#db2777' }}>₹{product.price}</p>
                      <p style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {product.rating}</p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary"
                      style={{ 
                         padding: '10px 20px', fontSize: '14px', borderRadius: '25px', 
                         background: 'linear-gradient(135deg, #db2777, #be185d)', border: 'none'
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
             <h3>No yummy treats found here 😔</h3>
             <p>Try searching for something else!</p>
          </div>
        )}
      </div>

      <WhatsAppButton cart={cart} />
    </div>
  );
}

// 2. Main Export Wrapped in Suspense
export default function Home() {
  return (
    <Suspense fallback={
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Loading Deliciousness...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}