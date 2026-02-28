import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    await connectDB();
    const customer = await Customer.findById(decoded.id).select('-password');

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}