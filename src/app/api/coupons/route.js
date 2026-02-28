import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/lib/models/Coupon';

// GET active coupons only
export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({ active: true });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create coupon
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if code already exists
    const existing = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }
    
    const coupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase(),
    });
    
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update coupon
export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}