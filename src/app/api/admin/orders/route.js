import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendOrderStatusUpdate } from '@/lib/email';

// GET all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({})
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

// PUT - Update order status with email notification
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
    
    // Send email notification on status update
    if (body.orderStatus && order.customerEmail) {
      await sendOrderStatusUpdate(order, order.customerEmail, body.orderStatus);
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}