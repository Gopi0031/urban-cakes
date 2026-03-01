import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// ❌ DO NOT initialize Razorpay here globally.
// It crashes the build if env vars are missing.

export async function POST(request) {
  try {
    // ✅ Initialize Razorpay INSIDE the function
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency = 'INR' } = await request.json();
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: 'receipt_' + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Payment Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}