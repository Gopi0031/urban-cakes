// src/components/Navbar.js
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Heart, LogIn, Search, ChevronDown, Box, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, cart, logout, openCart } = useStore();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProdMenu, setShowProdMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = ['cakes', 'cupcakes', 'pastries', 'breads', 'cookies', 'brownies', 'combos'];

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?search=${search}`);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat) => {
    router.push(`/?category=${cat}`);
    setShowProdMenu(false);
    setMobileMenuOpen(false);
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
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .mobile-menu {
          display: none;
        }
        .desktop-nav {
          display: flex;
        }
        .desktop-search {
          display: block;
        }
        .desktop-icons {
          display: flex;
        }
        .mobile-icons {
          display: none;
        }
        .hamburger {
          display: none;
        }
        
        @media (max-width: 768px) {
          .mobile-menu {
            display: flex;
            position: fixed;
            top: 0;
            right: 0;
            width: 80%;
            max-width: 320px;
            height: 100vh;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: -5px 0 20px rgba(0,0,0,0.1);
            z-index: 200;
            animation: slideIn 0.3s ease-out;
            overflow-y: auto;
          }
          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 199;
          }
          .desktop-nav {
            display: none;
          }
          .desktop-search {
            display: none;
          }
          .desktop-icons {
            display: none;
          }
          .mobile-icons {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .hamburger {
            display: flex;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
          }
          .logo-text {
            font-size: 18px !important;
          }
          .logo-img {
            width: 40px !important;
            height: 40px !important;
          }
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
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-animate">
              <img 
                src="/image.png" 
                alt="Urban Bakes Logo"
                className="logo-img"
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
            <span className="logo-text" style={{
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

          {/* Desktop Middle Navigation */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '24px' }}>
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

           <Link 
  href="/gallery" 
  className="nav-link" 
  style={{ color: "black", textDecoration: "none" }}
>
  Gallery
</Link>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="desktop-search" style={{ position: 'relative', width: '250px' }}>
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

          {/* Desktop Right Icons */}
          <div className="desktop-icons" style={{ alignItems: 'center', gap: '16px' }}>
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

          {/* Mobile Icons */}
          <div className="mobile-icons">
            <button 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
            >
              <Search size={20} color="#db2777" />
            </button>
            
            <button 
              onClick={() => {
                if(!customer) { toast.error('Please login'); router.push('/login'); return; }
                openCart();
              }}
              style={{ position: 'relative', background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
            >
              <ShoppingCart size={20} color="#333" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '0', right: '0',
                  background: '#db2777', color: 'white',
                  fontSize: '9px', fontWeight: 'bold',
                  width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="hamburger"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} color="#333" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div style={{ padding: '0 16px 12px', background: 'rgba(255, 240, 245, 0.95)' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search for cakes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  borderRadius: '25px',
                  border: '1px solid #fbcfe8',
                  background: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#db2777' }}>
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#db2777' }}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="#333" />
              </button>
            </div>

            {/* User Info */}
            {customer ? (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '16px', background: '#fdf2f8', borderRadius: '12px', marginBottom: '20px' 
              }}>
                <div style={{ 
                  width: '45px', height: '45px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #f9a8d4, #f472b6)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 'bold', fontSize: '18px'
                }}>
                  {customer.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#333' }}>Hello, {customer.name?.split(' ')[0]}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{customer.email}</p>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  padding: '16px', background: '#fdf2f8', borderRadius: '12px', marginBottom: '20px',
                  cursor: 'pointer'
                }}>
                  <LogIn size={20} color="#db2777" />
                  <span style={{ fontWeight: '600', color: '#db2777' }}>Login / Sign Up</span>
                </div>
              </Link>
            )}

            {/* Categories */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</p>
              <div onClick={() => handleCategoryClick('')} style={{ 
                padding: '12px', cursor: 'pointer', fontWeight: '600', color: '#333',
                borderBottom: '1px solid #f3f4f6'
              }}>
                All Products
              </div>
              {categories.map(cat => (
                <div 
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '15px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                >
                  <span style={{width: '6px', height: '6px', background: '#f9a8d4', borderRadius: '50%'}}></span>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
              ))}
            </div>

            {/* Links */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</p>
              <Link href="/gallery" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px', color: '#666', borderBottom: '1px solid #f3f4f6' }}>Gallery</div>
              </Link>
              {customer && (
                <>
                  <Link href="/my-orders" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f3f4f6' }}>
                      <Box size={16} /> My Orders
                    </div>
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f3f4f6' }}>
                      <Heart size={16} /> Wishlist
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Logout */}
            {customer && (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                style={{ 
                  width: '100%', padding: '14px', background: '#fef2f2', 
                  border: 'none', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  color: '#ef4444', fontWeight: '600', cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div style={{height: '70px', background: '#fff0f5'}}></div>}>
      <NavbarContent />
    </Suspense>
  );
}