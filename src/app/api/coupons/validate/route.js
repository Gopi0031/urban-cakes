import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/lib/models/Coupon';

export async function POST(request) {
  try {
    await connectDB();
    
    const { code, orderAmount } = await request.json();
    
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }
    
    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }
    
    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { success: false, error: `Minimum order amount is ₹${coupon.minOrderAmount}` },
        { status: 400 }
      );
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit exceeded' },
        { status: 400 }
      );
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discount) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discount;
    }
    
    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount: discountAmount,
        discountType: coupon.discountType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}