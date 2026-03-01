import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Urban Bakes - Premium Bakery',
  description: 'Order fresh cakes, pastries and premium bakery items online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Poppins', sans-serif" }}>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}