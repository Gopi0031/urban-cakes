// src/app/admin/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Edit2, Trash2, Upload, Package, Tag, TrendingUp, Image as ImageIcon, X, Menu } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage, 
    fetchProducts,
    heroSlides = [],
    addHeroSlide,
    deleteHeroSlide
  } = useStore();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'cakes',
    price: '',
    image: '',
    desc: '',
    badge: '',
    rating: 4.8,
    quantity: 100,
    discount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  useEffect(() => {
    const authorized = localStorage.getItem('adminLoggedIn');
    if (!authorized) {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
      fetchProducts();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setBannerUploading(true);
      const imageUrl = await uploadImage(file);
      if (addHeroSlide) {
        await addHeroSlide(imageUrl);
        toast.success('Banner added successfully');
      } else {
        toast.error('Store function addHeroSlide missing');
      }
    } catch (error) {
      console.error('Banner upload failed:', error);
      toast.error('Banner upload failed');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleDeleteBanner = async (indexOrId) => {
    if(confirm('Delete this banner?')) {
        if(deleteHeroSlide) {
            await deleteHeroSlide(indexOrId);
            toast.success('Banner removed');
        }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await addProduct(formData);
      }

      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'cakes',
      price: '',
      image: '',
      desc: '',
      badge: '',
      rating: 4.8,
      quantity: 100,
      discount: 0,
    });
    setImagePreview('');
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      desc: product.desc,
      badge: product.badge || '',
      rating: product.rating,
      quantity: product.quantity || 100,
      discount: product.discount || 0,
    });
    setImagePreview(product.image);
    setEditingId(product._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  const navButtons = [
    { href: null, onClick: () => setShowBannerModal(true), icon: ImageIcon, label: 'Banners', color: '#10b981' },
    { href: '/admin/orders', icon: Package, label: 'Orders', color: '#3b82f6' },
    { href: '/admin/coupons', icon: Tag, label: 'Coupons', color: '#f59e0b' },
    { href: '/admin/analytics', icon: TrendingUp, label: 'Analytics', color: '#8b5cf6' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)' }}>
      <style jsx>{`
        @keyframes slideInDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .desktop-buttons {
          display: flex;
          gap: 12px;
        }
        .mobile-menu-btn {
          display: none;
        }
        .header-title {
          font-size: 28px;
        }
        .products-header {
          flex-direction: row;
          align-items: center;
        }
        .products-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .modal-content {
          width: 500px;
          max-width: 95vw;
        }
        .form-grid {
          grid-template-columns: 1fr 1fr;
        }
        .banner-grid {
          grid-template-columns: 1fr 1fr;
        }
        
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .desktop-buttons {
            display: none;
          }
          .mobile-menu-btn {
            display: flex;
            background: none;
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            align-items: center;
            gap: 6px;
            font-weight: 600;
            color: #333;
          }
          .header-title {
            font-size: 20px;
          }
          .header-subtitle {
            display: none;
          }
          .products-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .products-grid {
            grid-template-columns: 1fr;
          }
          .products-title {
            font-size: 20px;
          }
          .add-btn {
            width: 100%;
            justify-content: center;
          }
          .modal-content {
            width: 100%;
            max-width: 100%;
            margin: 0;
            border-radius: 0;
            min-height: 100vh;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .banner-grid {
            grid-template-columns: 1fr;
          }
          .modal-buttons {
            flex-direction: column;
          }
          .mobile-nav-menu {
            position: fixed;
            top: 0;
            right: 0;
            width: 280px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 20px rgba(0,0,0,0.1);
            z-index: 200;
            animation: slideIn 0.3s ease-out;
            display: flex;
            flex-direction: column;
            padding: 20px;
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
        }
        
        @media (max-width: 480px) {
          .header-title {
            font-size: 18px;
          }
          .product-image {
            height: 150px;
          }
          .product-price {
            font-size: 18px;
          }
        }
      `}</style>

      <Toaster position="top-center" />
      
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        animation: 'slideInDown 0.6s ease-out',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
        }}>
          <div>
            <h1 className="header-title" style={{
              fontWeight: 'bold',
              color: '#333',
            }}>
              🍰 Admin Dashboard
            </h1>
            <p className="header-subtitle" style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
              Manage your bakery products
            </p>
          </div>

          {/* Desktop Buttons */}
          <div className="desktop-buttons">
            {navButtons.map((btn, idx) => (
              btn.href ? (
                <Link key={idx} href={btn.href}>
                  <button className="btn" style={{ background: btn.color, color: 'white', gap: '8px' }}>
                    <btn.icon size={18} />
                    {btn.label}
                  </button>
                </Link>
              ) : (
                <button key={idx} onClick={btn.onClick} className="btn" style={{ background: btn.color, color: 'white', gap: '8px' }}>
                  <btn.icon size={18} />
                  {btn.label}
                </button>
              )
            ))}
            <button onClick={handleLogout} className="btn btn-secondary" style={{ gap: '8px' }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} />
            Menu
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-nav-menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navButtons.map((btn, idx) => (
                btn.href ? (
                  <Link key={idx} href={btn.href} onClick={() => setMobileMenuOpen(false)}>
                    <button style={{ 
                      width: '100%', padding: '14px 16px', background: btn.color, color: 'white', 
                      border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px'
                    }}>
                      <btn.icon size={20} />
                      {btn.label}
                    </button>
                  </Link>
                ) : (
                  <button key={idx} onClick={() => { btn.onClick(); setMobileMenuOpen(false); }} style={{ 
                    width: '100%', padding: '14px 16px', background: btn.color, color: 'white', 
                    border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px'
                  }}>
                    <btn.icon size={20} />
                    {btn.label}
                  </button>
                )
              ))}
              
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ 
                  width: '100%', padding: '14px 16px', background: '#f3f4f6', color: '#ef4444', 
                  border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px'
                }}>
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="container" style={{ padding: '24px 16px' }}>
        <div className="products-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '24px',
          animation: 'slideInUp 0.6s ease-out',
        }}>
          <h2 className="products-title" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Products ({products.length})
          </h2>
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="btn btn-primary add-btn"
            style={{ gap: '8px' }}
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid" style={{ display: 'grid', gap: '20px' }}>
          {products.map((product, index) => (
            <div
              key={product._id}
              className="card"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`,
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              )}

              <div style={{ padding: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px',
                  gap: '8px'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#333',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666', 
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.desc}
                    </p>
                  </div>
                  {product.badge && (
                    <span style={{
                      background: product.badge === 'hot' ? '#ff6b35' : '#4ade80',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {product.badge}
                    </span>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  marginBottom: '12px',
                }}>
                  <div>
                    <p className="product-price" style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                    }}>
                      ₹{product.price}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      Stock: {product.quantity || 0}
                    </p>
                  </div>
                  <div style={{ fontSize: '12px', color: '#f59e0b' }}>
                    ⭐ {product.rating}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: '10px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s',
                    }}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      padding: '10px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s',
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Banner Management Modal */}
      {showBannerModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', zIndex: 300,
          padding: '16px'
        }} onClick={() => setShowBannerModal(false)}>
           <div className="modal modal-content" style={{
             background: 'white', borderRadius: '16px', padding: '24px',
             maxHeight: '90vh', overflowY: 'auto'
           }} onClick={(e) => e.stopPropagation()}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h2 style={{fontSize:'20px', fontWeight:'bold'}}>Manage Hero Banners</h2>
                <button onClick={() => setShowBannerModal(false)} style={{background:'none', border:'none', cursor:'pointer', padding:'4px'}}><X size={24}/></button>
              </div>
              
              <div style={{marginBottom:'24px'}}>
                <label style={{display:'block', marginBottom:'8px', fontWeight:'600', fontSize:'14px'}}>Upload New Banner</label>
                <div style={{
                  border: '2px dashed var(--primary, #db2777)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: bannerUploading ? '#f3f4f6' : '#fdf2f8'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    style={{ display: 'none' }}
                    id="banner-input"
                    disabled={bannerUploading}
                  />
                  <label
                    htmlFor="banner-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: bannerUploading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Upload size={32} style={{ color: 'var(--primary, #db2777)' }} />
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {bannerUploading ? 'Uploading...' : 'Tap to upload banner'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 style={{fontSize:'16px', fontWeight:'bold', marginBottom:'12px'}}>Current Slides ({heroSlides.length})</h3>
                <div className="banner-grid" style={{display:'grid', gap:'12px'}}>
                  {heroSlides.map((slide, idx) => (
                    <div key={idx} style={{position:'relative', borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
                      <img 
                        src={slide.image || slide}
                        alt={`Banner ${idx}`} 
                        style={{width:'100%', height:'120px', objectFit:'cover'}} 
                      />
                      <button 
                        onClick={() => handleDeleteBanner(slide._id || idx)}
                        style={{
                          position:'absolute', top:'8px', right:'8px', 
                          background:'rgba(255,255,255,0.95)', color:'#ef4444', 
                          border:'none', borderRadius:'50%', width:'32px', height:'32px', 
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                          boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                  {heroSlides.length === 0 && <p style={{color:'#999', fontSize:'14px', textAlign:'center', padding:'20px'}}>No banners uploaded yet.</p>}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', zIndex: 300,
          padding: '0'
        }} onClick={() => setShowAddForm(false)}>
          <div className="modal modal-content" style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            maxHeight: '100vh', overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333',
              }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {/* Product Name */}
              <div>
                <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chocolate Cake"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                    border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                    border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none',
                    background: 'white'
                  }}
                  required
                >
                  <option value="cakes">Cakes</option>
                  <option value="cupcakes">Cupcakes</option>
                  <option value="pastries">Pastries</option>
                  <option value="breads">Breads</option>
                  <option value="cookies">Cookies</option>
                  <option value="brownies">Brownies</option>
                  <option value="combos">Combos</option>
                </select>
              </div>

              {/* Price & Quantity */}
              <div className="form-grid" style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="599"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    placeholder="100"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Description</label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="500g - Rich & Moist"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                    border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none'
                  }}
                />
              </div>

              {/* Badge & Rating */}
              <div className="form-grid" style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none',
                      background: 'white'
                    }}
                  >
                    <option value="">None</option>
                    <option value="hot">🔥 Hot</option>
                    <option value="new">⭐ New</option>
                  </select>
                </div>
                <div>
                  <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Discount */}
              <div>
                <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                  placeholder="0"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                    border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none'
                  }}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label style={{display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'14px'}}>Product Image *</label>
                <div style={{
                  border: '2px dashed var(--primary, #db2777)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: '#fdf2f8'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-input"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Upload size={32} style={{ color: 'var(--primary, #db2777)' }} />
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {uploading ? 'Uploading to Cloudinary...' : 'Tap to upload image'}
                    </span>
                  </label>
                </div>

                {imagePreview && (
                  <div style={{
                    marginTop: '12px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    maxHeight: '180px',
                  }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="modal-buttons" style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: 1, padding: '14px', background: '#f3f4f6', color: '#333',
                    border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                    fontSize: '15px'
                  }}
                  disabled={loading || uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || !formData.image}
                  style={{
                    flex: 1, padding: '14px', 
                    background: (loading || uploading || !formData.image) ? '#ccc' : 'var(--primary, #db2777)', 
                    color: 'white',
                    border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                    fontSize: '15px',
                    opacity: (loading || uploading || !formData.image) ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}