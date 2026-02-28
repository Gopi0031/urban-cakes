# 🍰 Sweet Delights - Modern Bakery Website with Admin Dashboard

A premium, production-ready bakery e-commerce website with admin dashboard for managing products with image uploads.

## ✨ Features

✅ **Admin Dashboard** - Add/edit/delete products with image uploads
✅ **Image Upload** - Upload cake images (supports PNG, JPG, etc)
✅ **Product Management** - Manage prices, categories, descriptions, ratings
✅ **Customer Store** - Browse and purchase products
✅ **Shopping Cart** - Add items, view cart, checkout
✅ **Animations** - Smooth transitions and effects throughout
✅ **Responsive Design** - Mobile-friendly interface
✅ **No Authentication Required** - Simple password login for admin (no complex auth)
✅ **WhatsApp Integration** - Order delivery via WhatsApp
✅ **Razorpay Payment** - Online payment option
✅ **COD Option** - Cash on Delivery available

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Admin Access

1. Click "Admin" link on the homepage (top right)
2. Login with password: `admin123`
3. Manage products from the dashboard

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js                 # Customer homepage
│   ├── admin/
│   │   ├── login/page.js      # Admin login
│   │   └── dashboard/page.js  # Admin dashboard
│   ├── layout.js              # Root layout
│   └── globals.css            # Global styles
├── lib/
│   └── store.js               # Zustand store (products + cart)
└── components/                # Reusable components
```

## 🎯 Admin Dashboard Features

### Add Product
1. Click "Add New Product" button
2. Fill in product details:
   - Product Name
   - Category (cakes, cupcakes, pastries, etc)
   - Price in ₹
   - Description
   - Badge (Hot, New, or None)
   - Rating (1-5 stars)
   - Product Image (upload PNG/JPG)
3. Click "Add Product"

### Edit Product
1. Click "Edit" button on product card
2. Modify details
3. Change image if needed
4. Click "Update Product"

### Delete Product
1. Click "Delete" button on product card
2. Product removed immediately

## 🖼️ Image Upload

- **Format**: PNG, JPG, JPEG, GIF, WebP
- **Size**: Recommended 400x400px
- **Max Size**: Up to 5MB
- **Storage**: Images are converted to base64 and stored in browser localStorage
- **Preview**: See image preview before saving

## 🔐 Admin Login

**Password**: `admin123` (change this in `src/app/admin/login/page.js`)

No complex authentication - simple password login for quick setup.

## 🎨 Customization

### Change Admin Password
File: `src/app/admin/login/page.js` (line 16)
```javascript
const ADMIN_PASSWORD = 'admin123';
```

### Add Product Categories
File: `src/app/page.js` (line 16)
```javascript
const categories = ['cakes', 'cupcakes', 'pastries', ...];
```

### Change Colors
File: `src/app/globals.css` (lines 4-6)
```css
:root {
  --primary: #ff6b35;      /* Main color */
  --secondary: #f7931e;    /* Secondary */
  --accent: #c41e3a;       /* Accent */
}
```

## 🌐 Deployment

### Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <github-url>
git push -u origin main

# 2. Go to vercel.com
# 3. Import your GitHub repo
# 4. Click Deploy
# 5. Your site is LIVE! 🎉
```

## 📝 Default Products

The store comes with 6 sample products across different categories:
- Chocolate Fudge Cake (cakes)
- Vanilla Dream Cake (cakes)
- Strawberry Cheesecake (cakes)
- Chocolate Croissants (pastries)
- Chocolate Chip Cookies (cookies)
- Fudgy Brownies (brownies)

Add more products from the admin dashboard!

## 🔄 Data Storage

- **Products**: Stored in Zustand store (persisted to localStorage)
- **Images**: Converted to base64 and stored locally
- **Cart**: Stored in browser localStorage

## 🛠️ Technology Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **Zustand** - State management
- **Framer Motion** - Animations (optional)
- **Lucide React** - Icons

## 📱 Responsive Design

- Mobile optimized
- Tablet friendly
- Desktop perfect
- Touch-friendly buttons
- Responsive grid layout

## 🎬 Animations

- Slide in animations
- Fade transitions
- Scale effects
- Float animations
- Smooth hover states
- Loading states

## ⚡ Performance

- Fast page loads
- Optimized images
- Smooth animations
- Minimal dependencies
- Production ready

## 🐛 Troubleshooting

### Images not saving
- Check browser localStorage has space
- Try refreshing the page
- Clear browser cache if issues persist

### Admin login not working
- Verify password is correct: `admin123`
- Check localStorage is enabled
- Try incognito/private mode

### Products not showing
- Make sure you added products from admin panel
- Check if products are in the correct category
- Refresh the browser

## 📞 Support

- Check code comments for explanations
- Review the store structure in `src/lib/store.js`
- Examine component patterns in `src/app/`

## 🚀 Next Steps

1. ✅ Run locally: `npm run dev`
2. ✅ Access admin: Click "Admin" → Password: `admin123`
3. ✅ Add products with images
4. ✅ Test shopping cart
5. ✅ Deploy to Vercel
6. ✅ Share with customers!

## 📄 License

Free to use and modify for your bakery business.

---

**Happy Baking!** 🍰🧁🎂

Built with Next.js 14 + React 18 + Zustand
