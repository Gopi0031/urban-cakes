import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import jwt from 'jsonwebtoken';

// GET wishlist
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    await connectDB();
    const customer = await Customer.findById(decoded.id).populate('wishlist');
    
    return NextResponse.json({ success: true, wishlist: customer.wishlist });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Add to wishlist
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { productId } = await request.json();
    
    await connectDB();
    const customer = await Customer.findById(decoded.id);
    
    if (customer.wishlist.includes(productId)) {
      return NextResponse.json(
        { success: false, error: 'Product already in wishlist' },
        { status: 400 }
      );
    }
    
    customer.wishlist.push(productId);
    await customer.save();
    
    await customer.populate('wishlist');
    
    return NextResponse.json({ success: true, wishlist: customer.wishlist });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    await connectDB();
    const customer = await Customer.findById(decoded.id);
    
    customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
    await customer.save();
    
    await customer.populate('wishlist');
    
    return NextResponse.json({ success: true, wishlist: customer.wishlist });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}