'use client';

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)',
      paddingTop: '60px',
      paddingBottom: '20px',
      borderTop: '2px solid #fbcfe8',
      marginTop: '60px'
    }}>
      <div className="container">
        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>

          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)'
              }}>
                🍰
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  Urban Bakes
                </h3>
                <p style={{ fontSize: '12px', color: '#888', margin: 0, marginTop: '2px' }}>
                  Premium Bakery
                </p>
              </div>
            </div>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              🎂 Baking happiness since 2024. We deliver premium cakes and pastries fresh to your doorstep with love and care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '4px',
                height: '4px',
                background: 'linear-gradient(135deg, #db2777, #ec4899)',
                borderRadius: '50%'
              }}></span>
              Quick Links
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {[
                { href: '/', label: '🏠 Home' },
                { href: '/gallery', label: '🖼️ Gallery' },
                { href: '/about', label: '👥 About Us' },
                { href: '/my-orders', label: '📦 Track Order' }
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  style={{
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    paddingLeft: '8px',
                    borderLeft: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#db2777';
                    e.currentTarget.style.borderLeftColor = '#db2777';
                    e.currentTarget.style.paddingLeft = '12px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '4px',
                height: '4px',
                background: 'linear-gradient(135deg, #db2777, #ec4899)',
                borderRadius: '50%'
              }}></span>
              Contact Us
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              color: '#666',
              fontSize: '14px'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff0f5';
                e.currentTarget.style.color = '#db2777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#666';
              }}>
                <MapPin size={18} color="#db2777" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Urban Bakes, Mahatma Gandhi Inner Ring Road, Gorantla, Guntur<br />AP, India - 522002</span>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                transition: 'all 0.2s',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff0f5';
                e.currentTarget.style.color = '#db2777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#666';
              }}>
                <Phone size={18} color="#db2777" style={{ flexShrink: 0 }} />
                <a href="tel:+919876543210" style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}>
                  +91 89777 39123
                </a>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                transition: 'all 0.2s',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff0f5';
                e.currentTarget.style.color = '#db2777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#666';
              }}>
                <Mail size={18} color="#db2777" style={{ flexShrink: 0 }} />
                <a href="mailto:hello@urbanbakes.com" style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}>
                  urbanbakes@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: '2px solid #fbcfe8',
          paddingTop: '20px',
          marginTop: '20px'
        }}>
          {/* Footer Bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Copyright */}
            <p style={{
              color: '#888',
              fontSize: '13px',
              margin: 0
            }}>
              © 2025 Urban Bakes. All rights reserved. Made with 💖
            </p>

            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              {[
                { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/urban__bakes/' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                // { icon: Twitter, label: 'Twitter', href: '#' }
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    title={social.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '38px',
                      height: '38px',
                      background: 'white',
                      borderRadius: '50%',
                      border: '2px solid #fbcfe8',
                      color: '#db2777',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #db2777, #ec4899)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#db2777';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(219, 39, 119, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#db2777';
                      e.currentTarget.style.borderColor = '#fbcfe8';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}