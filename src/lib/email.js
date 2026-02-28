import nodemailer from 'nodemailer';

// Check if email is configured
const isEmailConfigured = () => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
};

// Create transporter only if configured
let transporter = null;

const getTransporter = () => {
  if (!isEmailConfigured()) {
    console.log('Email not configured - skipping');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
};

// Email Template Wrapper
const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #c41e3a 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .content { padding: 40px 30px; background: white; }
    .button { display: inline-block; background: linear-gradient(135deg, #ff6b35, #f7931e); color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .order-box { background: #f9fafb; padding: 24px; border-radius: 10px; margin: 20px 0; border: 2px solid #e5e7eb; }
    .item-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .total-row { display: flex; justify-content: space-between; padding: 16px 0; font-size: 20px; font-weight: bold; color: #ff6b35; border-top: 2px solid #ff6b35; margin-top: 12px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 13px; }
    .footer a { color: #ff6b35; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <h3 style="color: #ff6b35; margin-bottom: 12px; font-size: 20px;">🍰 Urban Bakes</h3>
      <p>Made with Love - Fresh Bakery Delights</p>
      <p style="font-size: 11px; color: #6b7280; margin-top: 16px;">This is an automated email.</p>
    </div>
  </div>
</body>
</html>
`;

// Send Welcome Email
export const sendWelcomeEmail = async (customerName, customerEmail) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.log('Skipping welcome email - not configured');
    return { success: false, error: 'Email not configured' };
  }

  const content = `
    <div class="header">
      <h1>🎉 Welcome to Urban Bakes!</h1>
      <p>Your account has been created successfully</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 16px;">Dear ${customerName},</p>
      <p style="margin-bottom: 24px;">Welcome to the Urban Bakes family! Get ready to experience the finest bakery delights. 🍰</p>
      <div style="background: linear-gradient(135deg, #fff5e1, #ffe4e1); padding: 24px; border-radius: 10px; margin: 24px 0;">
        <h3 style="color: #ff6b35; margin-bottom: 16px;">🎁 Welcome Offer!</h3>
        <p>Use code <strong style="background: white; padding: 8px 16px; border-radius: 6px; color: #ff6b35; font-size: 18px;">WELCOME10</strong> to get <strong>10% OFF</strong>!</p>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">Start Shopping →</a>
      </div>
    </div>
  `;

  try {
    await mailer.sendMail({
      from: `"🍰 Urban Bakes" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: '🎉 Welcome to Urban Bakes - Get 10% OFF!',
      html: emailTemplate(content),
    });
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Order Confirmation Email
export const sendOrderConfirmation = async (order, customerEmail) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.log('Skipping order email - not configured');
    return { success: false, error: 'Email not configured' };
  }

  const content = `
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
      <p>Thank you for your order from Urban Bakes</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 16px;">Dear ${order.customerName},</p>
      <p style="margin-bottom: 24px;">Your order has been confirmed! We're preparing your treats. 🍰</p>
      <div class="order-box">
        <h3 style="color: #ff6b35; margin-bottom: 16px;">📦 Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Paid Online'}</p>
        <h4 style="margin-top: 20px; margin-bottom: 12px;">Items:</h4>
        ${order.items.map(item => `
          <div class="item-row">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
          </div>
        `).join('')}
        <div class="total-row">
          <span>Total</span>
          <span>₹${order.total}</span>
        </div>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-orders" class="button">Track Order →</a>
      </div>
    </div>
  `;

  try {
    await mailer.sendMail({
      from: `"🍰 Urban Bakes" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `✅ Order Confirmed - ${order.orderNumber}`,
      html: emailTemplate(content),
    });
    return { success: true };
  } catch (error) {
    console.error('Order email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Order Status Update Email
export const sendOrderStatusUpdate = async (order, customerEmail, newStatus) => {
  const mailer = getTransporter();
  if (!mailer) return { success: false, error: 'Email not configured' };

  const statusMessages = {
    confirmed: { emoji: '✅', title: 'Order Confirmed!' },
    preparing: { emoji: '👨‍🍳', title: 'Being Prepared!' },
    'out-for-delivery': { emoji: '🚚', title: 'Out for Delivery!' },
    delivered: { emoji: '🎉', title: 'Order Delivered!' },
    cancelled: { emoji: '❌', title: 'Order Cancelled' },
  };

  const status = statusMessages[newStatus] || { emoji: '📦', title: 'Status Updated' };

  const content = `
    <div class="header">
      <h1>${status.emoji} ${status.title}</h1>
      <p>Order: ${order.orderNumber}</p>
    </div>
    <div class="content">
      <p>Dear ${order.customerName},</p>
      <p>Your order status has been updated to: <strong>${newStatus.replace('-', ' ').toUpperCase()}</strong></p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-orders" class="button">Track Order →</a>
      </div>
    </div>
  `;

  try {
    await mailer.sendMail({
      from: `"🍰 Urban Bakes" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${status.emoji} Order Update - ${order.orderNumber}`,
      html: emailTemplate(content),
    });
    return { success: true };
  } catch (error) {
    console.error('Status email error:', error.message);
    return { success: false, error: error.message };
  }
};