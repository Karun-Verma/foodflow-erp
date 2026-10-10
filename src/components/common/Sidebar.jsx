import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart, CalendarCheck, TableProperties,
  Package, Users, UserCheck, BarChart3, Bell, User, Settings, Tag,
  Truck, FileText, LogOut, ChefHat, Star
} from 'lucide-react';

const adminNav = [
  { label: 'MAIN', type: 'section' },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, notif: true },
  { to: '/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/tables', label: 'Tables', icon: TableProperties },
  { label: 'MANAGEMENT', type: 'section' },
  { to: '/menu', label: 'Menu Manager', icon: UtensilsCrossed },
  { to: '/inventory', label: 'Inventory', icon: Package, alert: true },
  { to: '/staff', label: 'Staff', icon: UserCheck },
  { to: '/customers', label: 'Customers', icon: Users },
  { label: 'BUSINESS', type: 'section' },
  { to: '/billing', label: 'Billing', icon: FileText },
  { to: '/delivery', label: 'Delivery', icon: Truck },
  { to: '/offers', label: 'Offers & Promos', icon: Tag },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { label: 'ACCOUNT', type: 'section' },
  { to: '/notifications', label: 'Notifications', icon: Bell, notif: true },
  { to: '/profile', label: 'Profile', icon: User },
];

const staffNav = [
  { label: 'MAIN', type: 'section' },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, notif: true },
  { to: '/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/tables', label: 'Tables', icon: TableProperties },
  { to: '/billing', label: 'Billing', icon: FileText },
  { label: 'ACCOUNT', type: 'section' },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

const customerNav = [
  { label: 'ORDER', type: 'section' },
  { to: '/menu', label: 'Browse Menu', icon: UtensilsCrossed },
  { to: '/cart', label: 'My Cart', icon: ShoppingCart, notif: true },
  { to: '/reservations', label: 'Reserve Table', icon: CalendarCheck },
  { label: 'MY ACCOUNT', type: 'section' },
  { to: '/my-orders', label: 'My Orders', icon: FileText },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

const roleNavMap = { admin: adminNav, staff: staffNav, customer: customerNav };

export default function Sidebar() {
  const { user, logout, sidebarOpen, setSidebarOpen, unreadCount, lowStockCount, cartCount } = useApp();
  const navigate = useNavigate();
  const navItems = roleNavMap[user?.role || 'customer'];

  const handleLogout = () => { logout(); navigate('/login'); setSidebarOpen(false); };

  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🍽️</div>
          <div>
            <div className="logo-text">FoodFlow</div>
            <div className="logo-sub">Restaurant ERP</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.type === 'section') return <div key={i} className="nav-section">{item.label}</div>;
            const Icon = item.icon;
            const badge = item.notif && (unreadCount > 0 || cartCount > 0)
              ? (item.to === '/cart' ? cartCount : unreadCount)
              : item.alert && lowStockCount > 0 ? lowStockCount : null;
            return (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}>
                <Icon size={17} />
                {item.label}
                {badge ? <span className="nbadge">{badge}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--radius)', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 8 }}>
            <div className="avatar" style={{ width: 32, height: 32 }}>{user?.avatar || '??'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{user?.name}</div>
              <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            </div>
          </div>
          <button className="nav-item" style={{ color: 'var(--red)', width: '100%' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
