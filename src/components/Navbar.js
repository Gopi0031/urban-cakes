'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, LogIn, Search, ChevronDown, Box, LogOut, Grid } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const { customer, cart, logout } = useStore();
  
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProdMenu, setShowProdMenu] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = ['All Products', 'Cakes', 'Cupcakes', 'Pastries', 'Breads', 'Cookies', 'Brownies', 'Combos'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  const handleCategoryClick = (cat) => {
    const categoryParam = cat === 'All Products' ? '' : cat.toLowerCase();
    router.push(`/?category=${categoryParam}`);
    setShowProdMenu(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid #fbcfe8',
      boxShadow: '0 4px 20px rgba(219, 39, 119, 0.08)',
      padding: '12px 0'
    }}>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .logo-animate { animation: float 3s ease-in-out infinite; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown { animation: slideUp 0.2s ease-out; }
      `}</style>

      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 20px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        
        {/* 1. LOGO & BRAND NAME */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* LOGO IMAGE - Replace src with your logo path */}
          <div className="logo-animate" style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* 
              INSTRUCTIONS: Replace the image src below with your logo
              
              Option 1: Use public folder
              src="/logo.png"
              src="/logo.jpg"
              src="/logo.svg"
              
              Option 2: Use external URL
              src="https://your-domain.com/logo.png"
              
              Option 3: Use data URL (base64)
              src="data:image/png;base64,iVBORw0KGgo..."
              
              Steps to add your logo:
              1. Add your logo image to public/ folder (create if doesn't exist)
              2. Name it: logo.png (or logo.jpg, logo.svg)
              3. Change src="/logo.png" below
              4. Adjust alt text to match your brand
              5. Optional: Adjust width/height if needed
            */}
            <Image
              src="/image.png"
              alt="Urban Bakes Logo"
              width={48}
              height={48}
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%'
              }}
              priority
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Fallback emoji if image doesn't load */}
            
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Urban
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Bakes
            </span>
          </div>
        </Link>

        {/* 2. SEARCH BAR */}
        <form onSubmit={handleSearch} style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Search cakes, pastries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 40px 10px 16px',
              borderRadius: '25px',
              border: '2px solid #fbcfe8',
              background: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#db2777';
              e.target.style.boxShadow = '0 0 0 3px rgba(219, 39, 119, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#fbcfe8';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button 
            type="submit" 
            style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#db2777',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* 3. PRODUCTS DROPDOWN & GALLERY */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          {/* Products Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowProdMenu(true)}
            onMouseLeave={() => setShowProdMenu(false)}
          >
            <button style={{
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '15px', 
              fontWeight: '600', 
              color: '#4a4a4a',
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff0f5';
              e.currentTarget.style.color = '#db2777';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#4a4a4a';
            }}>
              <Grid size={16} /> Products 
              <ChevronDown size={14} />
            </button>

            {showProdMenu && (
              <div className="dropdown" style={{ 
                position: 'absolute',
                left: 0, 
                right: 'auto',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '8px',
                minWidth: '280px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                border: '1px solid #fce7f3',
                zIndex: 1000
              }}>
                {categories.map((cat, idx) => (
                  <div 
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      color: idx === 0 ? 'white' : '#666',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      background: idx === 0 ? 'linear-gradient(135deg, #db2777, #ec4899)' : 'transparent',
                      fontWeight: idx === 0 ? '600' : '500',
                      animation: `slideUp 0.2s ease-out ${idx * 0.05}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      if (idx !== 0) {
                        e.currentTarget.style.background = '#fff0f5';
                        e.currentTarget.style.color = '#db2777';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== 0) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#666';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <span style={{
                      width: idx === 0 ? '8px' : '6px', 
                      height: idx === 0 ? '8px' : '6px', 
                      background: idx === 0 ? 'white' : '#f9a8d4', 
                      borderRadius: '50%'
                    }}></span>
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery Link */}
          <Link href="/gallery" style={{ textDecoration: 'none' }}>
            <div style={{
              color: '#4a4a4a', 
              fontWeight: '600', 
              fontSize: '15px',
              display: 'flex', 
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff0f5';
              e.currentTarget.style.color = '#db2777';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#4a4a4a';
            }}>
              🖼️ Gallery
            </div>
          </Link>
        </div>

        {/* 4. RIGHT ICONS (CART, USER) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          
          {/* Cart Button */}
          <Link href="/checkout">
            <button 
              style={{ 
                position: 'relative', 
                background: 'white', 
                border: '2px solid #fbcfe8',
                padding: '8px 12px', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
              title="Shopping Cart"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#db2777';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(219, 39, 119, 0.2)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#fbcfe8';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ShoppingCart size={20} color="#db2777" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-8px',
                  background: 'linear-gradient(135deg, #db2777, #ec4899)', 
                  color: 'white',
                  fontSize: '10px', 
                  fontWeight: 'bold',
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  animation: 'pulse 2s infinite'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* User Profile / Login */}
          {customer ? (
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {/* User Avatar */}
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '16px',
                cursor: 'pointer', 
                border: '2px solid white', 
                boxShadow: '0 2px 8px rgba(219, 39, 119, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(219, 39, 119, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(219, 39, 119, 0.2)';
              }}>
                {customer.name?.charAt(0).toUpperCase()}
              </div>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="dropdown" style={{ 
                  position: 'absolute',
                  minWidth: '200px', 
                  right: 0, 
                  left: 'auto',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '8px',
                  border: '1px solid #fce7f3',
                  top: '100%',
                  zIndex: 1000
                }}>
                  {/* User Info */}
                  <div style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #f3f4f6', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    👋 Hello, {customer.name?.split(' ')[0]}
                  </div>

                  {/* My Orders */}
                  <Link href="/my-orders" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#666',
                      fontSize: '14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fff0f5';
                      e.currentTarget.style.color = '#db2777';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#666';
                    }}>
                      <Box size={16} /> My Orders
                    </div>
                  </Link>

                  {/* Wishlist */}
                  <Link href="/wishlist" style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#666',
                      fontSize: '14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fff0f5';
                      e.currentTarget.style.color = '#db2777';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#666';
                    }}>
                      <Heart size={16} /> Wishlist
                    </div>
                  </Link>

                  {/* Logout */}
                  <button 
                    onClick={handleLogout}
                    style={{ 
                      padding: '10px 16px',
                      background: 'none', 
                      border: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      color: '#ef4444', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      width: '100%', 
                      textAlign: 'left',
                      borderTop: '1px solid #f3f4f6',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #db2777, #ec4899)',
                color: 'white',
                border: 'none',
                padding: '8px 16px', 
                borderRadius: '8px',
                fontWeight: '600', 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(219, 39, 119, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(219, 39, 119, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(219, 39, 119, 0.2)';
              }}>
                <LogIn size={16} /> Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}