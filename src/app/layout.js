import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Urban Bakes - Made with Love',
  description: 'Order fresh cakes with admin dashboard. WhatsApp delivery, Razorpay & COD payments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}