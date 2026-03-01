'use client';

import { useState } from 'react';

export default function GalleryPage() {

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)', padding: '60px 20px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'slideInUp 0.6s ease-out' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
             Our Gallery
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore our beautiful collection of freshly baked delights. Each image tells a story of taste, quality, and passion.
          </p>
        </div>

       
        {/* Coming Soon Section */}
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)',
          borderRadius: '16px',
          border: '2px solid #fbcfe8'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#db2777',
            marginBottom: '12px'
          }}>
            📸  Coming Soon!
          </h2>
          <p style={{
            color: '#666',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            We're constantly adding new delicious creations to our gallery. Check back soon for more beautiful moments from Urban Bakes!
          </p>
          
        </div>
      </div>
    </div>
  );
}