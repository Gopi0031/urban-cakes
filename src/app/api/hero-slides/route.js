import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HeroSlide from '@/lib/models/HeroSlide'; // Corrected path to point to src/lib/models/

// GET: Fetch all slides
export async function GET() {
  await connectDB();
  try {
    // If the model hasn't been compiled yet, this might throw if not handled by mongoose.models check in the model file
    const slides = await HeroSlide.find().sort({ createdAt: -1 });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching slides:", error);
    // Return empty array on error to prevent frontend crash
    return NextResponse.json([]); 
  }
}

// POST: Add a new slide
export async function POST(req) {
  await connectDB();
  try {
    const { image } = await req.json();
    if (!image) {
        return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    const newSlide = await HeroSlide.create({ image });
    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a slide
export async function DELETE(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await HeroSlide.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}