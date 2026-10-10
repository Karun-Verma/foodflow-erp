import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/common/index';

import LandingPage from './pages/LandingPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import ReservationsPage from './pages/ReservationsPage';
import {
  TablesPage, InventoryPage, BillingPage, StaffPage, CustomersPage,
  AnalyticsPage, CartPage, MyOrdersPage, ReviewsPage, OffersPage,
  DeliveryPage, NotificationsPage, ProfilePage
} from './pages/AllPages';

function ProtectedRoute({ children, roles }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px' },
        success: { iconTheme: { primary: 'var(--green)', secondary: 'white' } },
        error: { iconTheme: { primary: 'var(--red)', secondary: 'white' } },
      }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Layout><MenuPage /></Layout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['admin','staff']}><Layout><OrdersPage /></Layout></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><Layout><ReservationsPage /></Layout></ProtectedRoute>} />
        <Route path="/tables" element={<ProtectedRoute roles={['admin','staff']}><Layout><TablesPage /></Layout></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute roles={['admin']}><Layout><InventoryPage /></Layout></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute roles={['admin','staff']}><Layout><BillingPage /></Layout></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute roles={['admin']}><Layout><StaffPage /></Layout></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute roles={['admin']}><Layout><CustomersPage /></Layout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute roles={['admin']}><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute roles={['customer']}><Layout><CartPage /></Layout></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute roles={['customer']}><Layout><MyOrdersPage /></Layout></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Layout><ReviewsPage /></Layout></ProtectedRoute>} />
        <Route path="/offers" element={<ProtectedRoute roles={['admin']}><Layout><OffersPage /></Layout></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute roles={['admin','staff']}><Layout><DeliveryPage /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
