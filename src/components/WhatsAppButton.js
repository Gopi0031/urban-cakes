'use client';

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppButton({ cart = [], orderDetails = null }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const sendWhatsAppMessage = () => {
    let message = '';
    
    if (orderDetails) {
      // Order placed message
      message = `🎉 *New Order - ${orderDetails.orderNumber}*\n\n`;
      message += `👤 Customer: ${orderDetails.customerName}\n`;
      message += `📞 Phone: ${orderDetails.customerPhone}\n\n`;
      message += `📦 *Order Items:*\n`;
      orderDetails.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}\n`;
      });
      message += `\n💰 *Total: ₹${orderDetails.total}*\n`;
      message += `💳 Payment: ${orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}\n`;
      message += `\n📍 *Delivery Address:*\n${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state} - ${orderDetails.address.pincode}`;
    } else if (cart.length > 0) {
      // Cart inquiry message
      message = `🛒 *Hi! I'm interested in these items:*\n\n`;
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}\n`;
      });
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      message += `\n💰 *Total: ₹${total}*`;
    } else {
      // General inquiry
      message = `Hi! I'd like to know more about your bakery products. 🍰`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={sendWhatsAppMessage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        zIndex: 999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
        animation: 'pulse 2s infinite',
      }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
      
      {cart.length > 0 && (
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          background: '#ff6b35',
          color: 'white',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          border: '2px solid white',
        }}>
          {cart.length}
        </span>
      )}
    </button>
  );
}