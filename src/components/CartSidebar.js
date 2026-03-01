'use client';

import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useStore();

  if (!isCartOpen) return null;

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }} 
        onClick={closeCart}
      />
      <div style={{
        position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '400px',
        background: 'white', zIndex: 999, display: 'flex', flexDirection: 'column',
        boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease-out'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Your Cart ({cart.length})</h3>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
              <ShoppingCart size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '12px', background: '#fff0f5', padding: '10px', borderRadius: '10px' }}>
                  {item.image && <img src={item.image} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</h4>
                      <button onClick={() => removeFromCart(item._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#db2777', fontWeight: 'bold' }}>₹{item.price}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #db2777', color: '#db2777', background: 'white' }}><Minus size={12} /></button>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #db2777', color: 'white', background: '#db2777' }}><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: '#db2777', fontSize: '18px' }}>₹{cartTotal}</span>
            </div>
            <Link href="/checkout">
              <button onClick={closeCart} className="btn btn-primary" style={{ width: '100%' }}>Proceed to Checkout</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}