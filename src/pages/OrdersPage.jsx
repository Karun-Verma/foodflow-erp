import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Filter, ChevronDown, ChevronUp, Clock, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useRestaurant';
import { Modal } from '../components/common/index';

const STATUS_FLOW = { new: 'preparing', preparing: 'ready', ready: 'completed' };
const STATUS_LABELS = { new: 'Confirm Order', preparing: 'Mark Ready', ready: 'Complete', completed: 'Done', cancelled: 'Cancelled' };

function OrderDetail({ order, onUpdateStatus, onClose }) {
  const subtotal = order.items.reduce((a, i) => a + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div>
      <div className="flex gap-12 flex-wrap mb-16">
        <span className={`badge badge-${order.type}`}>{order.type}</span>
        <span className={`badge badge-${order.status}`}>{order.status}</span>
        <span className={`badge badge-${order.paymentStatus}`}>{order.paymentStatus}</span>
      </div>

      <div className="grid grid-2 mb-16" style={{ gap: 12 }}>
        <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Customer</div>
          <div style={{ fontWeight: 600 }}>{order.customer}</div>
          {order.address && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{order.address}</div>}
        </div>
        <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Table / Time</div>
          <div style={{ fontWeight: 600 }}>{order.table || 'Takeaway/Delivery'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{order.time} · {order.date}</div>
        </div>
      </div>

      <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Ordered Items</h4>
      <div style={{ marginBottom: 16 }}>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}> × {item.qty}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius)', padding: 14, border: '1px solid var(--border)', marginBottom: 20 }}>
        <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 6 }}>
          <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 6, color: 'var(--text-muted)' }}>
          <span>GST (5%)</span><span>₹{tax}</span>
        </div>
        <div className="divider" style={{ margin: '8px 0' }} />
        <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>
          <span>Grand Total</span><span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-10 justify-end">
        <button className="btn btn-outline" onClick={onClose}>Close</button>
        {STATUS_FLOW[order.status] && (
          <button className="btn btn-primary" onClick={() => { onUpdateStatus(order.id, STATUS_FLOW[order.status]); onClose(); }}>
            {STATUS_LABELS[order.status]}
          </button>
        )}
        {order.status === 'new' && (
          <button className="btn btn-danger" onClick={() => { onUpdateStatus(order.id, 'cancelled'); onClose(); }}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { orders, updateOrderStatus, user } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dSearch = useDebounce(search, 300);

  const filtered = orders.filter(o => {
    const matchSearch = !dSearch || o.id.toLowerCase().includes(dSearch.toLowerCase()) || o.customer.toLowerCase().includes(dSearch.toLowerCase());
    const matchStatus = filter === 'all' || o.status === filter;
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    all: orders.length, new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const handleUpdateStatus = (id, status) => {
    updateOrderStatus(id, status);
    toast.success(`Order status updated to "${status}"`);
  };

  const todayRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((a, o) => a + o.total, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Order Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Total Revenue: <strong style={{ color: 'var(--accent)' }}>₹{todayRevenue.toLocaleString()}</strong></p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-8 flex-wrap mb-16">
        {Object.entries(counts).map(([status, count]) => (
          <button key={status} className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      {/* Search & Type filter */}
      <div className="card mb-20">
        <div className="flex gap-12 flex-wrap">
          <div className="search-box" style={{ flex: '1 1 200px' }}>
            <Search size={16} className="search-icon" />
            <input className="form-input" placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-8">
            {['all', 'dine-in', 'takeaway', 'delivery'].map(t => (
              <button key={t} className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTypeFilter(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No orders found</h3>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Type</th><th>Items</th>
                  <th>Total</th><th>Status</th><th>Payment</th><th>Time</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{order.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{order.customer}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.table || 'No table'}</div>
                    </td>
                    <td><span className={`badge badge-${order.type}`}>{order.type}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {order.items.slice(0, 2).map(i => i.name).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{order.total.toLocaleString()}</td>
                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                    <td><span className={`badge badge-${order.paymentStatus}`}>{order.paymentStatus}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.time}</td>
                    <td>
                      <div className="flex gap-6">
                        <button className="btn btn-outline btn-xs" onClick={() => setSelectedOrder(order)}>
                          <Eye size={11} />
                        </button>
                        {STATUS_FLOW[order.status] && (
                          <button className="btn btn-primary btn-xs" onClick={() => handleUpdateStatus(order.id, STATUS_FLOW[order.status])}>
                            {STATUS_LABELS[order.status]}
                          </button>
                        )}
                        {order.status === 'new' && (
                          <button className="btn btn-danger btn-xs" onClick={() => handleUpdateStatus(order.id, 'cancelled')}>✕</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <Modal title={`Order Details — ${selectedOrder.id}`} onClose={() => setSelectedOrder(null)} maxWidth={580}>
            <OrderDetail order={selectedOrder} onUpdateStatus={handleUpdateStatus} onClose={() => setSelectedOrder(null)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
