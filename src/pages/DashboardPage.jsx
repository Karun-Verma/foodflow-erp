import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShoppingCart, CalendarCheck, Package, Users, TrendingUp, AlertTriangle, ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { salesData, monthlyRevenue, popularDishes } from '../data/mockData';

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ fontSize: 14, fontWeight: 700, color: p.color || p.fill }}>
        {p.name === 'revenue' || p.name === 'sales' ? '₹' : ''}{p.value?.toLocaleString()}
      </div>)}
    </div>
  );
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user, orders, reservations, inventory, lowStockCount, menuItems } = useApp();
  const navigate = useNavigate();

  const todayOrders = orders.filter(o => o.date === '2025-06-12');
  const todayRevenue = todayOrders.filter(o => o.paymentStatus === 'paid').reduce((a, o) => a + o.total, 0);
  const pendingOrders = todayOrders.filter(o => ['new', 'preparing'].includes(o.status)).length;
  const todayReservations = reservations.filter(r => r.date === '2025-06-12').length;
  const activeOrders = orders.filter(o => ['new', 'preparing', 'ready'].includes(o.status));

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <div>
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Welcome */}
        <motion.div variants={fadeUp} className="flex justify-between items-center mb-24 flex-wrap gap-16">
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 👋
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
              {isAdmin ? "Here's your restaurant overview for today." : isCustomer ? "Ready to order something delicious?" : "Here's your shift overview."}
            </p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              <ShoppingCart size={16} /> View All Orders
            </button>
          )}
          {isCustomer && (
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              🍽️ Order Now
            </button>
          )}
        </motion.div>

        {/* Stats */}
        {!isCustomer && (
          <div className="grid grid-4 mb-24">
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--accent-soft)' }}>🛒</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--accent)' }}>{todayOrders.length}</div>
                <div className="stat-label">Today's Orders</div>
                <div className="stat-delta" style={{ color: pendingOrders > 0 ? 'var(--yellow)' : 'var(--green)' }}>
                  {pendingOrders} pending
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--green-soft)' }}>💰</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--green)' }}>₹{todayRevenue.toLocaleString()}</div>
                <div className="stat-label">Today's Revenue</div>
                <div className="stat-delta text-green">↑ +12% vs yesterday</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--blue-soft)' }}>📅</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--blue)' }}>{todayReservations}</div>
                <div className="stat-label">Reservations Today</div>
                <div className="stat-delta" style={{ color: 'var(--text-muted)' }}>
                  {reservations.filter(r => r.status === 'confirmed').length} confirmed
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="stat-card">
              <div className="stat-icon" style={{ background: lowStockCount > 0 ? 'var(--red-soft)' : 'var(--purple-soft)' }}>📦</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: lowStockCount > 0 ? 'var(--red)' : 'var(--purple)' }}>{inventory.length}</div>
                <div className="stat-label">Inventory Items</div>
                <div className="stat-delta" style={{ color: lowStockCount > 0 ? 'var(--red)' : 'var(--text-muted)' }}>
                  {lowStockCount > 0 ? `⚠️ ${lowStockCount} low stock` : '✓ All stocked'}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isCustomer && (
          <div className="grid grid-3 mb-24">
            {[
              { icon: '📋', label: 'Menu Items', value: menuItems.filter(m => m.available).length, color: 'var(--accent)', to: '/menu' },
              { icon: '🛒', label: 'My Orders', value: '0', color: 'var(--green)', to: '/my-orders' },
              { icon: '📅', label: 'Reservations', value: '0', color: 'var(--blue)', to: '/reservations' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="stat-card pointer" onClick={() => navigate(s.to)}>
                <div className="stat-icon" style={{ background: `${s.color}22`, fontSize: 24 }}>{s.icon}</div>
                <div className="stat-info">
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Charts - Admin only */}
        {isAdmin && (
          <div className="grid grid-2 mb-24">
            <motion.div variants={fadeUp} className="card">
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Weekly Sales</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Revenue this week</p>
                </div>
                <span className="badge badge-green">↑ +18%</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="sales" stroke="var(--accent)" strokeWidth={2} fill="url(#salesGrad)" dot={{ fill: 'var(--accent)', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUp} className="card">
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Monthly Revenue</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months</p>
                </div>
                <button className="btn btn-sm btn-outline" onClick={() => navigate('/analytics')}>Full Report</button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Active Orders + Popular Dishes */}
        <div className={`grid ${isAdmin ? 'grid-2' : 'grid-1'} mb-24`} style={{ gridTemplateColumns: isAdmin ? '3fr 2fr' : '1fr' }}>
          <motion.div variants={fadeUp} className="card">
            <div className="flex justify-between items-center mb-16">
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                {isCustomer ? '🍴 Popular Dishes' : '🔥 Active Orders'}
              </h3>
              <button className="btn btn-sm btn-outline" onClick={() => navigate(isCustomer ? '/menu' : '/orders')}>
                {isCustomer ? 'View Menu' : 'View All'}
              </button>
            </div>
            {isCustomer ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {popularDishes.slice(0, 4).map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.orders} orders</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{d.trend}</span>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/menu')}>Order</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <p>No active orders right now</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeOrders.map(o => (
                  <div key={o.id} className={`order-card ${o.status}`}>
                    <div className="flex justify-between items-start gap-8 mb-8">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{o.id}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customer} · {o.table || o.type}</div>
                      </div>
                      <div className="flex gap-8 items-center">
                        <span className={`badge badge-${o.status}`}>{o.status}</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{o.total}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      <Clock size={11} /> {o.time} · {o.items.length} items
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {isAdmin && (
            <motion.div variants={fadeUp} className="card">
              <div className="flex justify-between items-center mb-16">
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>🏆 Top Dishes</h3>
                <button className="btn btn-sm btn-outline" onClick={() => navigate('/analytics')}>Analytics</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {popularDishes.map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-4">
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{d.trend}</span>
                    </div>
                    <div className="flex justify-between mb-4" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>{d.orders} orders</span><span>₹{d.revenue.toLocaleString()}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(d.orders / 700) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Low Stock Alert - Admin only */}
        {isAdmin && lowStockCount > 0 && (
          <motion.div variants={fadeUp} className="card" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'var(--red-soft)' }}>
            <div className="flex items-center gap-12 mb-16">
              <AlertTriangle size={20} color="var(--red)" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--red)' }}>Low Inventory Alerts</h3>
              <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }} onClick={() => navigate('/inventory')}>Manage Inventory</button>
            </div>
            <div className="grid grid-4">
              {inventory.filter(i => i.status === 'low').map(item => (
                <div key={item.id} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '10px 12px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--red)' }}>{item.quantity}{item.unit} remaining</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Min: {item.minStock}{item.unit}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
