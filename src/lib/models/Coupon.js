import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscount: Number,
  expiryDate: Date,
  active: {
    type: Boolean,
    default: true,
  },
  usageLimit: Number,
  usedCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);