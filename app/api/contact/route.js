import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const { fullName, phone, email, offering, message } = data;
    
    if (!fullName || !phone || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Here we would typically integrate with an email service like SendGrid, Resend, or a database
    // For now, we'll log the submission and return a success response.
    console.log('Received contact submission:', {
      fullName,
      phone,
      email,
      offering,
      message,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully. Our team will contact you shortly.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing your request.' },
      { status: 500 }
    );
  }
}
