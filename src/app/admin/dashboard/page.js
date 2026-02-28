'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Edit2, Trash2, Upload, Package, Tag, TrendingUp, Image as ImageIcon, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  // Ensure your store exports heroSlides, addHeroSlide, deleteHeroSlide
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage, 
    fetchProducts,
    heroSlides = [], // Default to empty array if store doesn't have it yet
    addHeroSlide,    // You need to add this action to your store
    deleteHeroSlide  // You need to add this action to your store
  } = useStore();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      // fetchHeroSlides() if separate
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  // Product Image Upload
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

  // Banner Image Upload
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)' }}>
      <Toaster position="top-center" />
      
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 0',
        animation: 'slideInDown 0.6s ease-out',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#333',
            }}>
              🍰 Admin Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
              Manage your bakery products
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
          }}>
             <button 
               onClick={() => setShowBannerModal(true)}
               className="btn" 
               style={{
                background: '#10b981',
                color: 'white',
                gap: '8px',
              }}>
                <ImageIcon size={18} />
                Banners
              </button>

            <Link href="/admin/orders">
              <button className="btn" style={{
                background: '#3b82f6',
                color: 'white',
                gap: '8px',
              }}>
                <Package size={18} />
                Orders
              </button>
            </Link>

            <Link href="/admin/coupons">
              <button className="btn" style={{
                background: '#f59e0b',
                color: 'white',
                gap: '8px',
              }}>
                <Tag size={18} />
                Coupons
              </button>
            </Link>

            <Link href="/admin/analytics">
              <button className="btn" style={{
                background: '#8b5cf6',
                color: 'white',
                gap: '8px',
              }}>
                <TrendingUp size={18} />
                Analytics
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ gap: '8px' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          animation: 'slideInUp 0.6s ease-out',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Products ({products.length})
          </h2>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="btn btn-primary"
            style={{ gap: '8px' }}
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-2">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="card"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`,
              }}
            >
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px',
                }}>
                  <div>
                    <h3 style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#333',
                      marginBottom: '4px',
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>
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
                    <p style={{
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
                      padding: '8px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.transform = 'none';
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
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
           <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h2 style={{fontSize:'24px', fontWeight:'bold'}}>Manage Hero Banners</h2>
                <button onClick={() => setShowBannerModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X/></button>
              </div>
              
              <div style={{marginBottom:'24px'}}>
                <label className="form-label">Upload New Banner</label>
                <div style={{
                  border: '2px dashed var(--primary)',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: bannerUploading ? '#f3f4f6' : 'transparent'
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
                    <Upload style={{ color: 'var(--primary)' }} />
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {bannerUploading ? 'Uploading...' : 'Click to upload banner image'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 style={{fontSize:'16px', fontWeight:'bold', marginBottom:'12px'}}>Current Slides ({heroSlides.length})</h3>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                  {heroSlides.map((slide, idx) => (
                    <div key={idx} style={{position:'relative', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                      <img 
                        src={slide.image || slide} // Support both object or string
                        alt={`Banner ${idx}`} 
                        style={{width:'100%', height:'100px', objectFit:'cover'}} 
                      />
                      <button 
                        onClick={() => handleDeleteBanner(slide._id || idx)}
                        style={{
                          position:'absolute', top:'5px', right:'5px', 
                          background:'rgba(255,255,255,0.9)', color:'#ef4444', 
                          border:'none', borderRadius:'50%', width:'24px', height:'24px', 
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'
                        }}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}
                  {heroSlides.length === 0 && <p style={{color:'#999', fontSize:'14px'}}>No banners uploaded.</p>}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '24px',
            }}>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {/* Product Name */}
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chocolate Cake"
                  className="form-input"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="form-label">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="599"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    placeholder="100"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="500g - Rich & Moist"
                  className="form-input"
                />
              </div>

              {/* Badge & Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="form-input"
                  >
                    <option value="">None</option>
                    <option value="hot">🔥 Hot</option>
                    <option value="new">⭐ New</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                  placeholder="0"
                  className="form-input"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="form-label">Product Image *</label>
                <div style={{
                  border: '2px dashed var(--primary)',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
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
                    <Upload style={{ color: 'var(--primary)' }} />
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {uploading ? 'Uploading to Cloudinary...' : 'Click to upload image'}
                    </span>
                  </label>
                </div>

                {imagePreview && (
                  <div style={{
                    marginTop: '16px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    maxHeight: '200px',
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '24px',
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  disabled={loading || uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || !formData.image}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
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