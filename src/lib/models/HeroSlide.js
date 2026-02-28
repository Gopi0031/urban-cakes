import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);