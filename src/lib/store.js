import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      cart: [],
      products: [],
      wishlist: [],
      heroSlides: [],
      customer: null,
      token: null,
      loading: false,
      appliedCoupon: null,

      // ===== AUTH METHODS =====
      setAuth: (customer, token) => {
        set({ customer, token });
        if (token) {
          localStorage.setItem('customerToken', token);
        }
      },

      logout: () => {
        set({ customer: null, token: null, wishlist: [], cart: [] });
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customer');
        toast.success('Logged out successfully');
      },

      loadCustomer: async () => {
        const token = localStorage.getItem('customerToken');
        if (!token) return;

        try {
          const { data } = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            set({ customer: data.customer, token });
          }
        } catch (error) {
          localStorage.removeItem('customerToken');
          localStorage.removeItem('customer');
        }
      },

      // ===== PRODUCT METHODS =====
      fetchProducts: async (category = null) => {
        try {
          set({ loading: true });
          const url = category ? `/api/products?category=${category}` : '/api/products';
          const { data } = await axios.get(url);
          
          // Handle both array directly or { success: true, products: [] } format
          if (data.success) {
            set({ products: data.products || [] });
          } else if (Array.isArray(data)) {
            set({ products: data });
          } else if (data.products) {
            set({ products: data.products });
          }
        } catch (error) {
          console.error('Failed to fetch products:', error);
          set({ products: [] });
        } finally {
          set({ loading: false });
        }
      },

      addProduct: async (productData) => {
        try {
          const { data } = await axios.post('/api/products', productData);
          if (data.success) {
            set((state) => ({
              products: [...state.products, data.product],
            }));
            toast.success('Product added successfully!');
            return data.product;
          }
        } catch (error) {
          toast.error(error.response?.data?.error || 'Failed to add product');
          throw error;
        }
      },

      updateProduct: async (id, productData) => {
        try {
          const { data } = await axios.put(`/api/products?id=${id}`, productData);
          if (data.success) {
            set((state) => ({
              products: state.products.map((p) => (p._id === id ? data.product : p)),
            }));
            toast.success('Product updated successfully!');
            return data.product;
          }
        } catch (error) {
          toast.error('Failed to update product');
          throw error;
        }
      },

      deleteProduct: async (id) => {
        try {
          const { data } = await axios.delete(`/api/products?id=${id}`);
          if (data.success) {
            set((state) => ({
              products: state.products.filter((p) => p._id !== id),
            }));
            toast.success('Product deleted successfully!');
          }
        } catch (error) {
          toast.error('Failed to delete product');
          throw error;
        }
      },

      // ===== HERO SLIDES METHODS =====
      fetchHeroSlides: async () => {
        try {
          const { data } = await axios.get('/api/hero-slides');
          // Assuming API returns an array of slides or { success: true, slides: [] }
          if (data.success) {
            set({ heroSlides: data.slides || [] });
          } else if (Array.isArray(data)) {
            set({ heroSlides: data });
          }
        } catch (error) {
          console.error('Failed to fetch hero slides');
          set({ heroSlides: [] });
        }
      },

      addHeroSlide: async (imageUrl) => {
        try {
          const { data } = await axios.post('/api/hero-slides', { image: imageUrl });
          set((state) => ({
            heroSlides: [data, ...state.heroSlides],
          }));
          toast.success('Banner added successfully!');
          return data;
        } catch (error) {
          console.error(error);
          toast.error('Failed to add banner');
          throw error;
        }
      },

      deleteHeroSlide: async (id) => {
        try {
          await axios.delete(`/api/hero-slides?id=${id}`);
          set((state) => ({
            heroSlides: state.heroSlides.filter((slide) => slide._id !== id),
          }));
          toast.success('Banner deleted');
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete banner');
          throw error;
        }
      },

      // ===== CART METHODS =====
      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find((item) => item._id === product._id);
          if (existing) {
            toast.success('Quantity updated!');
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          toast.success('Added to cart! 🛒');
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== productId),
        }));
        toast.success('Removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item._id !== productId) };
          }
          return {
            cart: state.cart.map((item) =>
              item._id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ cart: [], appliedCoupon: null }),

      // ===== WISHLIST METHODS =====
      fetchWishlist: async () => {
        const token = get().token || localStorage.getItem('customerToken');
        if (!token) return;

        try {
          const { data } = await axios.get('/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            set({ wishlist: data.wishlist || [] });
          }
        } catch (error) {
          console.error('Failed to fetch wishlist');
        }
      },

      addToWishlist: async (productId) => {
        const token = get().token || localStorage.getItem('customerToken');
        if (!token) {
          toast.error('Please login to add to wishlist');
          return;
        }

        try {
          const { data } = await axios.post(
            '/api/wishlist',
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (data.success) {
            set({ wishlist: data.wishlist || [] });
            toast.success('Added to wishlist! ❤️');
          }
        } catch (error) {
          toast.error(error.response?.data?.error || 'Failed to add to wishlist');
        }
      },

      removeFromWishlist: async (productId) => {
        const token = get().token || localStorage.getItem('customerToken');
        if (!token) return;

        try {
          const { data } = await axios.delete(`/api/wishlist?productId=${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            set({ wishlist: data.wishlist || [] });
            toast.success('Removed from wishlist');
          }
        } catch (error) {
          toast.error('Failed to remove from wishlist');
        }
      },

      isInWishlist: (productId) => {
        const state = get();
        if (!state.wishlist || !Array.isArray(state.wishlist)) return false;
        return state.wishlist.some((item) => {
          if (!item) return false;
          const itemId = item._id || item;
          return String(itemId) === String(productId);
        });
      },

      // ===== ORDER METHODS =====
      createOrder: async (orderData) => {
        const token = get().token || localStorage.getItem('customerToken');
        try {
          const { data } = await axios.post('/api/orders', orderData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (data.success) {
            set({ cart: [], appliedCoupon: null });
            toast.success('Order placed successfully!');
            return data.order;
          }
        } catch (error) {
          toast.error(error.response?.data?.error || 'Failed to create order');
          throw error;
        }
      },

      // ===== COUPON METHODS =====
      validateCoupon: async (code, orderAmount) => {
        try {
          const { data } = await axios.post('/api/coupons/validate', {
            code,
            orderAmount,
          });
          if (data.success) {
            set({ appliedCoupon: data.coupon });
            toast.success('Coupon applied successfully!');
            return data.coupon;
          }
        } catch (error) {
          toast.error(error.response?.data?.error || 'Invalid coupon');
          throw error;
        }
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
        toast.success('Coupon removed');
      },

      // ===== IMAGE UPLOAD METHODS =====
      uploadImage: async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const { data } = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          // Handle different response formats
          if (data.success) {
            return data.url;
          } else if (data.url) {
            return data.url;
          } else if (data.secure_url) {
            return data.secure_url;
          }
          throw new Error('No URL in response');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to upload image');
          throw error;
        }
      },

      // ===== PAYMENT METHODS =====
      createPaymentOrder: async (amount, orderDetails) => {
        try {
          const { data } = await axios.post('/api/payments/create-order', {
            amount,
            ...orderDetails,
          });
          if (data.success) {
            return data.order;
          }
        } catch (error) {
          toast.error('Failed to create payment order');
          throw error;
        }
      },

      verifyPayment: async (paymentDetails) => {
        try {
          const { data } = await axios.post('/api/payments/verify', paymentDetails);
          if (data.success) {
            toast.success('Payment verified successfully!');
            return data;
          }
        } catch (error) {
          toast.error('Payment verification failed');
          throw error;
        }
      },
    }),
    {
      name: 'urban-bakes-storage',
      partialize: (state) => ({
        cart: state.cart,
        customer: state.customer,
        token: state.token,
        wishlist: state.wishlist,
        appliedCoupon: state.appliedCoupon,
        // Don't persist heroSlides to ensure fresh data on reload
      }),
    }
  )
);