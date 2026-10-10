import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { USERS, orders as initialOrders, reservations as initialRes, inventory as initialInv, menuItems as initialMenu, notifications as initialNotifs } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ffTheme') || 'dark');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ffUser') || 'null'));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('ffCart') || '[]'));
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('ffOrders') || JSON.stringify(initialOrders)));
  const [reservations, setReservations] = useState(() => JSON.parse(localStorage.getItem('ffReservations') || JSON.stringify(initialRes)));
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('ffInventory') || JSON.stringify(initialInv)));
  const [menuItems, setMenuItems] = useState(() => JSON.parse(localStorage.getItem('ffMenu') || JSON.stringify(initialMenu)));
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('ffNotifs') || JSON.stringify(initialNotifs)));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('ffTheme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('ffUser', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('ffCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('ffOrders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('ffReservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('ffInventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('ffMenu', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('ffNotifs', JSON.stringify(notifications)); }, [notifications]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  const login = useCallback((email, password) => {
    const u = USERS.find(u => u.email === email && u.password === password);
    if (u) { setUser(u); return { success: true, user: u }; }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => { setUser(null); setCart([]); }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(c => c.id !== id)), []);
  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  }, [removeFromCart]);
  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const addOrder = useCallback((order) => setOrders(prev => [order, ...prev]), []);
  const updateOrderStatus = useCallback((id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)), []);

  const addReservation = useCallback((res) => setReservations(prev => [res, ...prev]), []);
  const updateReservation = useCallback((id, data) => setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r)), []);

  const updateInventory = useCallback((id, data) => setInventory(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)), []);
  const addInventoryItem = useCallback((item) => setInventory(prev => [...prev, item]), []);

  const updateMenuItem = useCallback((id, data) => setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...data } : m)), []);
  const addMenuItem = useCallback((item) => setMenuItems(prev => [...prev, item]), []);
  const deleteMenuItem = useCallback((id) => setMenuItems(prev => prev.filter(m => m.id !== id)), []);

  const markNotifRead = useCallback((id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllNotifRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const lowStockCount = inventory.filter(i => i.status === 'low').length;

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, user, login, logout,
      cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
      orders, addOrder, updateOrderStatus,
      reservations, addReservation, updateReservation,
      inventory, updateInventory, addInventoryItem,
      menuItems, updateMenuItem, addMenuItem, deleteMenuItem,
      notifications, markNotifRead, markAllNotifRead, unreadCount, lowStockCount,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
