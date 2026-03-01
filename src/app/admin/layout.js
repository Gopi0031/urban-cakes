// src/app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      {children}
    </div>
  );
}