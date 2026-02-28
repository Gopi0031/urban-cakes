import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import Product from '@/lib/models/Product';
import jwt from 'jsonwebtoken';

// GET reviews for a product
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    const reviews = await Review.find({ productId })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create review
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    await connectDB();
    
    const { productId, rating, title, comment, orderId } = await request.json();
    
    // Check if already reviewed
    const existingReview = await Review.findOne({
      productId,
      customerId: decoded.id,
    });
    
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You already reviewed this product' },
        { status: 400 }
      );
    }
    
    const review = await Review.create({
      productId,
      customerId: decoded.id,
      orderId,
      rating,
      title,
      comment,
      verified: !!orderId,
    });
    
    // Update product rating
    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length,
    });
    
    await review.populate('customerId', 'name avatar');
    
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}