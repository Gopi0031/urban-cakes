'use client';

import { useState, Suspense } from 'react'; // Import Suspense
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Heart, LogIn, Search, ChevronDown, Box, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

// 1. Logic Component
function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, cart, logout, openCart } = useStore();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProdMenu, setShowProdMenu] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = ['cakes', 'cupcakes', 'pastries', 'breads', 'cookies', 'brownies', 'combos'];

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?search=${search}`);
  };

  const handleCategoryClick = (cat) => {
    router.push(`/?category=${cat}`);
    setShowProdMenu(false);
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        .logo-animate { animation: float 3s ease-in-out infinite; }
        .nav-link { 
          color: #4a4a4a; 
          font-weight: 600; 
          text-decoration: none; 
          display: flex; 
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #ec4899; }
        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 8px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: 1px solid #fce7f3;
          animation: slideUp 0.2s ease-out;
          z-index: 100;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 240, 245, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #fbcfe8',
        boxShadow: '0 4px 20px rgba(236, 72, 153, 0.05)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-animate">
              <img 
                src="/image.png" 
                alt="Urban Bakes Logo" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)'
                }}
              />
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Urban Bakes
            </span>
          </Link>

          {/* Middle Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowProdMenu(true)}
              onMouseLeave={() => setShowProdMenu(false)}
            >
              <button style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: '600', color: '#4a4a4a',
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px'
              }}>
                Products <ChevronDown size={14} />
              </button>

              {showProdMenu && (
                <div className="dropdown" style={{ left: 0, right: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', minWidth: '300px' }}>
                  <div onClick={() => handleCategoryClick('')} style={{ padding: '10px', cursor: 'pointer', fontWeight: 'bold', gridColumn: '1 / -1', borderBottom: '1px solid #fce7f3' }}>
                    View All Products
                  </div>
                  {categories.map(cat => (
                    <div 
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '14px',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#db2777'}
                      onMouseLeave={(e) => e.target.style.color = '#666'}
                    >
                      <span style={{width: '6px', height: '6px', background: '#f9a8d4', borderRadius: '50%'}}></span>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/gallery" className="nav-link">
              Gallery
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '250px' }}>
            <input
              type="text"
              placeholder="Search for cakes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                paddingRight: '40px',
                borderRadius: '25px',
                border: '1px solid #fbcfe8',
                background: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#db2777'}
              onBlur={(e) => e.target.style.borderColor = '#fbcfe8'}
            />
            <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#db2777' }}>
              <Search size={18} />
            </button>
          </form>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => {
                if(!customer) { toast.error('Please login'); router.push('/login'); return; }
                openCart();
              }}
              style={{ position: 'relative', background: 'white', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <ShoppingCart size={20} color="#333" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px',
                  background: '#db2777', color: 'white',
                  fontSize: '10px', fontWeight: 'bold',
                  width: '18px', height: '18px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {customer ? (
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div style={{ 
                  width: '38px', height: '38px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #f9a8d4, #f472b6)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 'bold', fontSize: '16px',
                  cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {customer.name?.charAt(0).toUpperCase()}
                </div>

                {showUserMenu && (
                  <div className="dropdown" style={{ minWidth: '180px' }}>
                     <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', fontWeight: 'bold', color: '#333' }}>
                        Hello, {customer.name?.split(' ')[0]}
                     </div>
                     <Link href="/my-orders" className="nav-link" style={{ padding: '8px 12px' }}>
                        <Box size={16} /> My Orders
                     </Link>
                     <Link href="/wishlist" className="nav-link" style={{ padding: '8px 12px' }}>
                        <Heart size={16} /> Wishlist
                     </Link>
                     <button 
                        onClick={logout}
                        style={{ 
                          padding: '8px 12px', background: 'none', border: 'none', 
                          display: 'flex', alignItems: 'center', gap: '6px', 
                          color: '#ef4444', fontWeight: '600', cursor: 'pointer',
                          width: '100%', textAlign: 'left', borderTop: '1px solid #f3f4f6'
                        }}
                      >
                        <LogOut size={16} /> Logout
                     </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button style={{
                  background: 'white', color: '#db2777',
                  border: '1px solid #fbcfe8',
                  padding: '8px 20px', borderRadius: '20px',
                  fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <LogIn size={16} /> Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

// 2. Main Export Wrapped in Suspense
export default function Navbar() {
  return (
    <Suspense fallback={<div style={{height: '80px', background: '#fff0f5'}}></div>}>
      <NavbarContent />
    </Suspense>
  );
}