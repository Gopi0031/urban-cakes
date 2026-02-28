import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['cakes', 'cupcakes', 'pastries', 'breads', 'cookies', 'brownies', 'combos'],
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{
    url: String,
    publicId: String,
    isPrimary: Boolean,
  }],
  image: String, // Keep for backward compatibility
  desc: String,
  longDescription: String,
  badge: {
    type: String,
    enum: ['hot', 'new', 'sale', null],
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
  },
  
  // Advanced Features
  sizes: [{
    name: String, // e.g., "500g", "1kg", "Small", "Medium", "Large"
    price: Number,
    discount: Number,
    stock: Number,
  }],
  
  flavors: [{
    name: String,
    additionalPrice: Number,
  }],
  
  quantity: {
    type: Number,
    default: 100,
  },
  
  discount: {
    type: Number,
    default: 0,
  },
  
  ingredients: [String],
  allergens: [String],
  
  // SEO
  slug: {
    type: String,
    unique: true,
  },
  metaTitle: String,
  metaDescription: String,
  
  // Advanced inventory
  lowStockAlert: {
    type: Number,
    default: 10,
  },
  
  isVeg: {
    type: Boolean,
    default: true,
  },
  
  preparationTime: {
    type: Number, // in minutes
    default: 60,
  },
  
  // Reviews
  reviews: [{
    customerName: String,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  totalReviews: {
    type: Number,
    default: 0,
  },
  
  active: {
    type: Boolean,
    default: true,
  },
  
  featured: {
    type: Boolean,
    default: false,
  },
  
  soldCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create slug from name
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);