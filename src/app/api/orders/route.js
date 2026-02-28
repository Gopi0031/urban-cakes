import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderConfirmation } from '@/lib/email';

// GET all orders
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    
    let query = {};
    if (phone) {
      query.customerPhone = phone;
    }
    
    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create order
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate order number
    const orderNumber = 'UB' + Date.now();
    
    const order = await Order.create({
      ...body,
      orderNumber,
    });
    
    // Send confirmation email
    if (body.customerEmail) {
      await sendOrderConfirmation(order, body.customerEmail);
    }
    
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update order
export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}