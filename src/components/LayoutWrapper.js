// src/components/LayoutWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartSidebar />}
      
      <main style={{ minHeight: isAdminRoute ? '100vh' : 'calc(100vh - 400px)' }}>
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
    </>
  );
}