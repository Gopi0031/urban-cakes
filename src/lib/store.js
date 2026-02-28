import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      products: [],
      wishlist: [],
      heroSlides: [], // <--- Added State
      customer: null,
      token: null,
      loading: false,
      appliedCoupon: null,

      // Auth Methods
      setAuth: (customer, token) => {
        set({ customer, token });
        if (token) {
          localStorage.setItem('customerToken', token);
        }
      },

      logout: () => {
        set({ customer: null, token: null, wishlist: [] });
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

      // Fetch products from API
      fetchProducts: async (category = null) => {
        try {
          set({ loading: true });
          const url = category ? `/api/products?category=${category}` : '/api/products';
          const { data } = await axios.get(url);
          // Handle both array directly or { success: true, products: [] } format
          if (data.success) {
            set({ products: data.products });
          } else if (Array.isArray(data)) {
            set({ products: data });
          }
        } catch (error) {
          console.error('Failed to fetch products');
        } finally {
          set({ loading: false });
        }
      },

      // --- HERO SLIDES METHODS (NEW) ---
      fetchHeroSlides: async () => {
        try {
          const { data } = await axios.get('/api/hero-slides');
          // Assuming API returns an array of slides
          set({ heroSlides: data });
        } catch (error) {
          console.error('Failed to fetch hero slides');
        }
      },

      addHeroSlide: async (imageUrl) => {
        try {
          const { data } = await axios.post('/api/hero-slides', { image: imageUrl });
          set((state) => ({ 
            heroSlides: [data, ...state.heroSlides] 
          }));
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
      // ---------------------------------

      // Cart Methods
      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find((item) => item._id === product._id);
          if (existing) {
            toast.success('Quantity updated!');
            return {
              cart: state.cart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          toast.success('Added to cart!');
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

      // Wishlist Methods
      fetchWishlist: async () => {
        const token = get().token || localStorage.getItem('customerToken');
        if (!token) return;

        try {
          const { data } = await axios.get('/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            set({ wishlist: data.wishlist });
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
            set({ wishlist: data.wishlist });
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
            set({ wishlist: data.wishlist });
            toast.success('Removed from wishlist');
          }
        } catch (error) {
          toast.error('Failed to remove from wishlist');
        }
      },

      // Check if product is in wishlist
      isInWishlist: (productId) => {
        const state = get();
        if (!state.wishlist || !Array.isArray(state.wishlist)) return false;
        return state.wishlist.some((item) => {
          if (!item) return false;
          const itemId = item._id || item;
          return itemId === productId || String(itemId) === String(productId);
        });
      },

      // Admin Product Methods
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
          toast.error('Failed to add product');
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

      // Order Methods
      createOrder: async (orderData) => {
        try {
          const { data } = await axios.post('/api/orders', orderData);
          if (data.success) {
            set({ cart: [], appliedCoupon: null });
            toast.success('Order placed successfully!');
            return data.order;
          }
        } catch (error) {
          toast.error('Failed to create order');
          throw error;
        }
      },

      // Coupon Methods
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

      // Upload image to Cloudinary
      uploadImage: async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const { data } = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          // Handle if the upload route returns { success: true, url: ... } or just { url: ... }
          if (data.success) {
            return data.url;
          } else if (data.url) {
            return data.url;
          }
        } catch (error) {
          toast.error('Failed to upload image');
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
        // We generally don't persist heroSlides to ensure we get fresh banners on reload
      }),
    }
  )
);