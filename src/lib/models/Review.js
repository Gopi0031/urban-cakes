import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: String,
  comment: {
    type: String,
    required: true,
  },
  images: [String],
  helpful: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  response: {
    text: String,
    respondedAt: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);