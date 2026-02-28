import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    console.log('--- LOGIN API CALLED ---');

    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find customer
    const customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer) {
      console.log('Customer not found');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await customer.comparePassword(password);

    if (!isMatch) {
      console.log('Password mismatch');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    customer.lastLogin = new Date();
    await customer.save();

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'urban-bakes-default-secret-key-2024';
    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      jwtSecret,
      { expiresIn: '30d' }
    );

    console.log('Login successful for:', email);

    return NextResponse.json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses || [],
        wishlist: customer.wishlist || [],
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}