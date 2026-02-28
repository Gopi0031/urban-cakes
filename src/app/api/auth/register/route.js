import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    console.log('--- REGISTER API CALLED ---');

    // 1. Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', { ...body, password: '***' });
    } catch (parseError) {
      console.error('Body parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = body;

    // 2. Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // 3. Connect to database
    try {
      await connectDB();
      console.log('Database connected');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // 4. Check if customer already exists
    try {
      const existingCustomer = await Customer.findOne({
        $or: [{ email: email.toLowerCase() }, { phone }],
      });

      if (existingCustomer) {
        console.log('Customer already exists');
        return NextResponse.json(
          { success: false, error: 'Email or phone already registered' },
          { status: 400 }
        );
      }
    } catch (findError) {
      console.error('Find customer error:', findError);
      return NextResponse.json(
        { success: false, error: 'Database query failed' },
        { status: 500 }
      );
    }

    // 5. Create customer
    let customer;
    try {
      customer = await Customer.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
      });
      console.log('Customer created:', customer._id);
    } catch (createError) {
      console.error('Create customer error:', createError);
      
      // Handle duplicate key error
      if (createError.code === 11000) {
        return NextResponse.json(
          { success: false, error: 'Email or phone already registered' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to create account: ' + createError.message },
        { status: 500 }
      );
    }

    // 6. Generate JWT token
    let token;
    try {
      const jwtSecret = process.env.JWT_SECRET || 'urban-bakes-default-secret-key-2024';
      token = jwt.sign(
        { id: customer._id, email: customer.email },
        jwtSecret,
        { expiresIn: '30d' }
      );
      console.log('Token generated');
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return NextResponse.json(
        { success: false, error: 'Token generation failed' },
        { status: 500 }
      );
    }

    // 7. Send welcome email (non-blocking, don't fail if email fails)
    try {
      // Only try email if SMTP is configured
      if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        const { sendWelcomeEmail } = await import('@/lib/email');
        await sendWelcomeEmail(customer.name, customer.email);
        console.log('Welcome email sent');
      } else {
        console.log('SMTP not configured, skipping email');
      }
    } catch (emailError) {
      console.error('Email error (non-critical):', emailError.message);
      // Don't return error - email failure shouldn't block registration
    }

    // 8. Return success
    console.log('Registration successful');
    return NextResponse.json(
      {
        success: true,
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          addresses: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('REGISTER FATAL ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}