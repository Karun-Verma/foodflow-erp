import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, ShoppingCart, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';

const pageTitles = {
  '/dashboard': 'Dashboard', '/orders': 'Order Management', '/menu': 'Menu Management',
  '/reservations': 'Table Reservations', '/tables': 'Table Management', '/inventory': 'Inventory',
  '/staff': 'Staff Management', '/customers': 'Customer Management', '/billing': 'Billing & Invoices',
  '/delivery': 'Delivery Management', '/offers': 'Offers & Promotions', '/reviews': 'Reviews & Ratings',
  '/analytics': 'Reports & Analytics', '/notifications': 'Notifications', '/profile': 'Profile',
  '/cart': 'My Cart', '/my-orders': 'My Orders',
};

export function Topbar() {
  const { theme, toggleTheme, user, setSidebarOpen, unreadCount, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'FoodFlow ERP';

  return (
    <header className="topbar">
      <button className="icon-btn" onClick={() => setSidebarOpen(o => !o)}><Menu size={20} /></button>
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <button className="icon-btn" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        {user?.role === 'customer' && (
          <button className="icon-btn" onClick={() => navigate('/cart')}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="notif-dot" />}
          </button>
        )}
        <button className="icon-btn" onClick={() => navigate('/notifications')}>
          <Bell size={18} />
          {unreadCount > 0 && <span className="notif-dot" />}
        </button>
        <div className="avatar" onClick={() => navigate('/profile')}>{user?.avatar || '??'}</div>
      </div>
    </header>
  );
}

export function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content with-sidebar">
        <Topbar />
        <main className="page-content animate-fade">{children}</main>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ height: 20, width: '60%' }} />
      <div className="skeleton" style={{ height: 14, width: '90%' }} />
      <div className="skeleton" style={{ height: 14, width: '75%' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div className="skeleton" style={{ height: 28, width: 60 }} />
        <div className="skeleton" style={{ height: 28, width: 60 }} />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 32 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{ width: size, height: size, border: `3px solid var(--border)`, borderTop: `3px solid var(--accent)`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

export function StarRating({ rating, size = 13, showValue = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div className="stars">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ fontSize: size, color: i < Math.floor(rating) ? 'var(--yellow)' : 'var(--border-strong)' }}>★</span>
        ))}
      </div>
      {showValue && <span style={{ fontSize: 12, fontWeight: 600 }}>{rating.toFixed(1)}</span>}
    </div>
  );
}

export function Modal({ title, onClose, children, maxWidth = 560 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 20 }}
      onClick={onClose}>
      <div className="card animate-scale" style={{ maxWidth, width: '100%', border: '1px solid var(--border-strong)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-20">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Pagination({ page, total, prev, next, goTo }) {
  if (total <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-8" style={{ marginTop: 24 }}>
      <button className="btn btn-outline btn-sm" onClick={prev} disabled={page === 1}>← Prev</button>
      {Array.from({ length: Math.min(total, 7) }, (_, i) => (
        <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => goTo(i + 1)}>{i + 1}</button>
      ))}
      <button className="btn btn-outline btn-sm" onClick={next} disabled={page === total}>Next →</button>
    </div>
  );
}
