import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from 'recharts';
import {
  Search, Plus, Edit3, Trash2, AlertTriangle, Package,
  Users, UserCheck, FileText, Download, Star, Tag,
  Truck, Bell, CheckCheck, User, Save, Camera, Minus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tables, staff as staffData, customers as customerData, promos, reviews as reviewData,
  salesData, monthlyRevenue, popularDishes, deliveries, notifications as defaultNotifs } from '../data/mockData';
import { useDebounce, usePagination } from '../hooks/useRestaurant';
import { Modal, Pagination, StarRating } from '../components/common/index';

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ fontSize: 14, fontWeight: 700, color: p.color || p.fill }}>
        {typeof p.value === 'number' && p.value > 1000 ? `₹${p.value.toLocaleString()}` : p.value}
      </div>)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TABLES PAGE
═══════════════════════════════════════════════════ */
export function TablesPage() {
  const [section, setSection] = useState('All');
  const sections = ['All', 'Indoor', 'Outdoor', 'Private'];

  const filteredTables = tables.filter(t => section === 'All' || t.section === section);
  const statusCounts = { available: tables.filter(t => t.status === 'available').length, occupied: tables.filter(t => t.status === 'occupied').length, reserved: tables.filter(t => t.status === 'reserved').length };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Table Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Restaurant floor layout and table status</p>

      <div className="grid grid-3 mb-24">
        {[
          { label: 'Available', value: statusCounts.available, color: 'var(--green)', icon: '✅' },
          { label: 'Occupied', value: statusCounts.occupied, color: 'var(--red)', icon: '🔴' },
          { label: 'Reserved', value: statusCounts.reserved, color: 'var(--purple)', icon: '🟣' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}22`, fontSize: 22 }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label} Tables</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-8 mb-20">
        {sections.map(s => <button key={s} className={`btn btn-sm ${section === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSection(s)}>{s}</button>)}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {filteredTables.map((t, i) => (
          <motion.div key={t.id} className={`table-item ${t.status}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            onClick={() => toast.success(`Table ${t.number}: ${t.status.toUpperCase()}`)}>
            <div style={{ fontSize: 28 }}>{t.status === 'available' ? '🪑' : t.status === 'occupied' ? '👥' : '🔒'}</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{t.number}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{t.capacity} seats</div>
            <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{t.section}</div>
            <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2, textTransform: 'uppercase' }}>{t.status}</div>
          </motion.div>
        ))}
      </div>

      <div className="card mt-auto" style={{ marginTop: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Legend</h3>
        <div className="flex gap-20 flex-wrap">
          {[{ label: 'Available', cls: 'available' }, { label: 'Occupied', cls: 'occupied' }, { label: 'Reserved', cls: 'reserved' }].map(l => (
            <div key={l.cls} className="flex items-center gap-8">
              <div className={`table-item ${l.cls}`} style={{ width: 32, height: 32, padding: 0, fontSize: 0 }} />
              <span style={{ fontSize: 13 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INVENTORY PAGE
═══════════════════════════════════════════════════ */
export function InventoryPage() {
  const { inventory, updateInventory, addInventoryItem } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit: 'kg', minStock: '', supplier: '', costPerUnit: '' });
  const dSearch = useDebounce(search, 300);

  const filtered = inventory.filter(i => {
    const matchSearch = !dSearch || i.name.toLowerCase().includes(dSearch.toLowerCase());
    return matchSearch && (filter === 'all' || i.status === filter);
  });

  const handleUpdate = (id, field, val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) return;
    const item = inventory.find(i => i.id === id);
    const newQty = field === 'quantity' ? num : item.quantity;
    const status = newQty <= item.minStock ? 'low' : 'ok';
    updateInventory(id, { [field]: num, status, lastUpdated: '2025-06-12' });
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.quantity || !form.minStock) { toast.error('Fill all required fields'); return; }
    addInventoryItem({ ...form, id: Date.now(), quantity: parseFloat(form.quantity), minStock: parseFloat(form.minStock), costPerUnit: parseFloat(form.costPerUnit) || 0, status: parseFloat(form.quantity) <= parseFloat(form.minStock) ? 'low' : 'ok', lastUpdated: '2025-06-12' });
    toast.success('Item added to inventory');
    setForm({ name: '', category: '', quantity: '', unit: 'kg', minStock: '', supplier: '', costPerUnit: '' });
    setModal(null);
  };

  const lowCount = inventory.filter(i => i.status === 'low').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Inventory Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {inventory.length} items tracked · {lowCount > 0 ? <span style={{ color: 'var(--red)' }}>⚠️ {lowCount} low stock</span> : '✅ All stocked'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Item</button>
      </div>

      {lowCount > 0 && (
        <div className="card mb-16" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'var(--red-soft)' }}>
          <div className="flex items-center gap-8 mb-8">
            <AlertTriangle size={18} color="var(--red)" />
            <span style={{ fontWeight: 700, color: 'var(--red)' }}>Low Stock Alert — {lowCount} items need restocking</span>
          </div>
          <div className="flex flex-wrap gap-8">
            {inventory.filter(i => i.status === 'low').map(i => (
              <span key={i.id} className="badge badge-cancelled">{i.name} ({i.quantity}{i.unit})</span>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-20">
        <div className="flex gap-12 flex-wrap">
          <div className="search-box" style={{ flex: '1 1 200px' }}>
            <Search size={16} className="search-icon" />
            <input className="form-input" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {['all', 'ok', 'low'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f === 'all' ? 'All' : f === 'ok' ? '✅ In Stock' : '⚠️ Low Stock'}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Item</th><th>Category</th><th>Stock</th><th>Min Stock</th><th>Supplier</th><th>Cost/Unit</th><th>Updated</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={item.status === 'low' ? { background: 'rgba(239,68,68,0.04)' } : {}}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.category}</td>
                  <td>
                    <div className="flex items-center gap-8">
                      <button className="btn btn-xs btn-outline" onClick={() => handleUpdate(item.id, 'quantity', item.quantity - 1)}>-</button>
                      <span style={{ fontWeight: 700, color: item.status === 'low' ? 'var(--red)' : 'var(--text-primary)', minWidth: 40, textAlign: 'center' }}>{item.quantity}{item.unit}</span>
                      <button className="btn btn-xs btn-outline" onClick={() => handleUpdate(item.id, 'quantity', item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.minStock}{item.unit}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{item.supplier}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.costPerUnit}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.lastUpdated}</td>
                  <td><span className={`badge badge-${item.status}`}>{item.status === 'ok' ? '✅ OK' : '⚠️ Low'}</span></td>
                  <td>
                    <button className="btn btn-success btn-xs" onClick={() => { updateInventory(item.id, { quantity: item.quantity + 10, status: 'ok', lastUpdated: '2025-06-12' }); toast.success(`Restocked ${item.name} by 10${item.unit}`); }}>
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal === 'add' && (
          <Modal title="Add Inventory Item" onClose={() => setModal(null)}>
            <div className="grid grid-2 mb-14">
              <div className="form-group">
                <label className="form-label">Item Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Chicken Breast" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Protein" />
              </div>
            </div>
            <div className="grid grid-3 mb-14">
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input className="form-input" type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="form-select" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                  {['kg', 'g', 'L', 'ml', 'pcs', 'dozen'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Stock *</label>
                <input className="form-input" type="number" value={form.minStock} onChange={e => setForm(p => ({ ...p, minStock: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-2 mb-20">
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <input className="form-input" value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} placeholder="Supplier name" />
              </div>
              <div className="form-group">
                <label className="form-label">Cost per Unit (₹)</label>
                <input className="form-input" type="number" value={form.costPerUnit} onChange={e => setForm(p => ({ ...p, costPerUnit: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-12 justify-end">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add to Inventory</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BILLING PAGE
═══════════════════════════════════════════════════ */
export function BillingPage() {
  const { orders } = useApp();
  const [selected, setSelected] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  const billableOrders = orders.filter(o => o.status === 'completed' || o.status === 'ready');
  const order = selected ? orders.find(o => o.id === selected) : null;

  const subtotal = order ? order.items.reduce((a, i) => a + i.price * i.qty, 0) : 0;
  const taxAmt = Math.round(subtotal * 0.05);
  const discountAmt = Math.round(subtotal * (discount / 100));
  const grandTotal = subtotal + taxAmt - discountAmt;

  const applyPromo = () => {
    const valid = promos.find(p => p.code === promoCode.toUpperCase() && p.status === 'active');
    if (!valid) { toast.error('Invalid or expired promo code'); return; }
    if (valid.type === 'percent') setDiscount(valid.discount);
    else setDiscount(Math.min((valid.discount / subtotal) * 100, 100));
    toast.success(`Promo applied! ${valid.type === 'percent' ? valid.discount + '% off' : '₹' + valid.discount + ' off'}`);
  };

  const generateBill = () => {
    toast.success('Invoice generated! (Mock Print)');
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Billing & Invoices</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Generate bills and manage payments</p>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start', gap: 20 }}>
        {/* Order selector */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Select Order</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {billableOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No billable orders</p>
            ) : billableOrders.map(o => (
              <button key={o.id} onClick={() => setSelected(o.id)}
                style={{ padding: '10px 12px', background: selected === o.id ? 'var(--accent-soft)' : 'var(--bg-input)', border: `1px solid ${selected === o.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'left' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{o.id}</span>
                  <span className={`badge badge-${o.status}`}>{o.status}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>{o.customer}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹{o.total} · {o.items.length} items</div>
              </button>
            ))}
          </div>
        </div>

        {/* Invoice */}
        <div className="card">
          {!order ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
              <p>Select an order to generate invoice</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '2px dashed var(--border)' }}>
                <div style={{ fontSize: 24 }}>🍽️</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg,var(--accent),#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodFlow ERP</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>12 Food Street, MG Road, Bangalore | +91 9876543210</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>Invoice #{order.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.date} · {order.time}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="grid grid-2 mb-16" style={{ gap: 12 }}>
                <div style={{ fontSize: 13 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 2 }}>CUSTOMER</div>
                  <div style={{ fontWeight: 600 }}>{order.customer}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 2 }}>TABLE / TYPE</div>
                  <div style={{ fontWeight: 600 }}>{order.table || order.type}</div>
                </div>
              </div>

              {/* Items */}
              <table style={{ width: '100%', marginBottom: 16 }}>
                <thead><tr>
                  <th style={{ textAlign: 'left', padding: '6px 0', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>ITEM</th>
                  <th style={{ textAlign: 'center', padding: '6px 0', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>QTY</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>PRICE</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>TOTAL</th>
                </tr></thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ padding: '7px 0', fontSize: 13 }}>{item.name}</td>
                      <td style={{ padding: '7px 0', fontSize: 13, textAlign: 'center', color: 'var(--text-muted)' }}>{item.qty}</td>
                      <td style={{ padding: '7px 0', fontSize: 13, textAlign: 'right', color: 'var(--text-secondary)' }}>₹{item.price}</td>
                      <td style={{ padding: '7px 0', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Promo code */}
              <div className="flex gap-8 mb-16">
                <input className="form-input" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Promo code" />
                <button className="btn btn-outline" onClick={applyPromo}>Apply</button>
              </div>

              {/* Totals */}
              <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius)', padding: 14, border: '1px solid var(--border)', marginBottom: 16 }}>
                {[
                  { label: 'Subtotal', val: `₹${subtotal.toLocaleString()}` },
                  { label: 'GST (5%)', val: `₹${taxAmt}` },
                  discount > 0 ? { label: `Discount (${Math.round(discount)}%)`, val: `-₹${discountAmt}`, color: 'var(--green)' } : null,
                ].filter(Boolean).map((row, i) => (
                  <div key={i} className="flex justify-between" style={{ fontSize: 13, marginBottom: 6, color: row.color || 'var(--text-secondary)' }}>
                    <span>{row.label}</span><span>{row.val}</span>
                  </div>
                ))}
                <div className="divider" style={{ margin: '8px 0' }} />
                <div className="flex justify-between" style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
                  <span>Grand Total</span><span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-10 justify-end">
                <button className="btn btn-outline" onClick={generateBill}><Download size={14} /> Download PDF</button>
                <button className="btn btn-primary" onClick={generateBill}><FileText size={14} /> Generate Invoice</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STAFF PAGE
═══════════════════════════════════════════════════ */
export function StaffPage() {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [staffList, setStaffList] = useState(staffData);
  const [form, setForm] = useState({ name: '', role: 'Waiter', email: '', phone: '', salary: '', shift: 'Morning', status: 'active' });
  const dSearch = useDebounce(search, 300);

  const filtered = staffList.filter(s => !dSearch || s.name.toLowerCase().includes(dSearch.toLowerCase()) || s.role.toLowerCase().includes(dSearch.toLowerCase()));

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email required'); return; }
    if (modal === 'add') {
      setStaffList(prev => [...prev, { ...form, id: Date.now(), avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(), joinDate: '2025-06-12', salary: parseFloat(form.salary) || 0 }]);
      toast.success('Staff member added!');
    } else {
      setStaffList(prev => prev.map(s => s.id === modal.id ? { ...s, ...form } : s));
      toast.success('Staff info updated!');
    }
    setModal(null);
    setForm({ name: '', role: 'Waiter', email: '', phone: '', salary: '', shift: 'Morning', status: 'active' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-24 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Staff Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{staffList.filter(s => s.status === 'active').length} active staff members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Staff</button>
      </div>

      <div className="card mb-20">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input className="form-input" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Staff Member</th><th>Role</th><th>Contact</th><th>Salary</th><th>Shift</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-10">
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{s.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-orange">{s.role}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.phone}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{s.salary.toLocaleString()}</td>
                  <td><span className="badge badge-blue">{s.shift}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.joinDate}</td>
                  <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                  <td>
                    <div className="flex gap-6">
                      <button className="btn btn-outline btn-xs" onClick={() => { setForm({ ...s, salary: s.salary.toString() }); setModal(s); }}>
                        <Edit3 size={11} />
                      </button>
                      <button className="btn btn-danger btn-xs" onClick={() => { setStaffList(prev => prev.filter(st => st.id !== s.id)); toast.success('Staff removed'); }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add Staff Member' : `Edit: ${modal.name}`} onClose={() => setModal(null)}>
            <div className="grid grid-2 mb-14">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Staff name" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  {['Head Chef', 'Chef', 'Manager', 'Waiter', 'Cashier', 'Delivery'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-2 mb-14">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-3 mb-20">
              <div className="form-group">
                <label className="form-label">Monthly Salary (₹)</label>
                <input className="form-input" type="number" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Shift</label>
                <select className="form-select" value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}>
                  {['Morning', 'Evening', 'Night'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-12 justify-end">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Add Staff' : 'Save Changes'}</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CUSTOMERS PAGE
═══════════════════════════════════════════════════ */
export function CustomersPage() {
  const [search, setSearch] = useState('');
  const dSearch = useDebounce(search, 300);

  const filtered = customerData.filter(c => !dSearch || c.name.toLowerCase().includes(dSearch.toLowerCase()) || c.email.toLowerCase().includes(dSearch.toLowerCase()));
  const { current, page, total, next, prev, goTo } = usePagination(filtered, 8);

  return (
    <div>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Customer Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{customerData.length} registered customers</p>
        </div>
      </div>

      <div className="grid grid-3 mb-20">
        {[
          { label: 'Total Customers', value: customerData.length, color: 'var(--accent)', icon: '👥' },
          { label: 'VIP / Premium', value: customerData.filter(c => ['VIP', 'Premium'].includes(c.status)).length, color: 'var(--yellow)', icon: '⭐' },
          { label: 'Avg Spend', value: `₹${Math.round(customerData.reduce((a, c) => a + c.totalSpent, 0) / customerData.length).toLocaleString()}`, color: 'var(--green)', icon: '💰' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}22`, fontSize: 22 }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-16">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input className="form-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Orders</th><th>Total Spent</th><th>Loyalty Points</th><th>Status</th><th>Last Visit</th></tr></thead>
            <tbody>
              {current.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-10">
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{c.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.orders}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{c.totalSpent.toLocaleString()}</td>
                  <td><span style={{ color: 'var(--yellow)', fontWeight: 700 }}>⭐ {c.loyaltyPoints}</span></td>
                  <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} total={total} prev={prev} next={next} goTo={goTo} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ANALYTICS PAGE
═══════════════════════════════════════════════════ */
export function AnalyticsPage() {
  const { orders } = useApp();
  const totalRevenue = monthlyRevenue.reduce((a, m) => a + m.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((a, m) => a + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  const pieData = [
    { name: 'Dine-in', value: 52, color: 'var(--accent)' },
    { name: 'Delivery', value: 31, color: 'var(--purple)' },
    { name: 'Takeaway', value: 17, color: 'var(--teal)' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-24 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Business intelligence and performance insights</p>
        </div>
        <button className="btn btn-outline" onClick={() => toast.success('Report downloaded (Mock)')}><Download size={16} /> Export Report</button>
      </div>

      <div className="grid grid-4 mb-24">
        {[
          { icon: '💰', label: 'Total Revenue (6M)', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, color: 'var(--accent)', delta: '+18%' },
          { icon: '🛒', label: 'Total Orders (6M)', value: totalOrders.toLocaleString(), color: 'var(--blue)', delta: '+24%' },
          { icon: '📊', label: 'Avg Order Value', value: `₹${avgOrderValue}`, color: 'var(--green)', delta: '+5%' },
          { icon: '👥', label: 'Customer Growth', value: '+342', color: 'var(--purple)', delta: '+28%' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}22`, fontSize: 22 }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-delta text-green">{s.delta} vs last month</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2 mb-24">
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: 'var(--accent)', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Daily Sales This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Bar dataKey="sales" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Order Distribution</h3>
          <div className="flex items-center gap-20" style={{ height: 220 }}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} paddingAngle={4}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-10 mb-10">
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Performing Dishes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {popularDishes.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between mb-4">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                  <div className="flex gap-8 items-center">
                    <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{d.trend}</span>
                    <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>₹{d.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(d.orders / 700) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CART PAGE (Customer)
═══════════════════════════════════════════════════ */
export function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, addOrder, user } = useApp();
  const navigate = useNavigate ? null : null;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', payment: 'cash', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + tax;

  const handleCheckout = () => {
    if (!form.name || !form.phone) { toast.error('Please fill customer details'); return; }
    const newOrder = {
      id: `ORD${String(Date.now()).slice(-3)}`, customer: form.name, table: null,
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      status: 'new', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: grandTotal, type: form.address ? 'delivery' : 'takeaway',
      paymentStatus: form.payment === 'online' ? 'paid' : 'pending',
      date: '2025-06-12', address: form.address,
    };
    addOrder(newOrder);
    clearCart();
    setSubmitted(true);
    toast.success('Order placed successfully! 🎉');
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Order Placed!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your order has been received and is being prepared.</p>
      <div className="flex gap-12 justify-center">
        <button className="btn btn-outline" onClick={() => window.location.href = '/menu'}>Order More</button>
        <button className="btn btn-primary" onClick={() => window.location.href = '/my-orders'}>Track Order</button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Browse our menu and add something delicious!</p>
      <button className="btn btn-primary" onClick={() => window.location.href = '/menu'}>Browse Menu</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>🛒 My Cart</h1>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        {/* Cart items */}
        <div>
          <div className="card mb-16">
            <div className="flex justify-between items-center mb-14">
              <h3 style={{ fontWeight: 700 }}>{cart.length} item{cart.length > 1 ? 's' : ''}</h3>
              <button className="btn btn-danger btn-sm" onClick={clearCart}>Clear All</button>
            </div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div style={{ fontSize: 32, flexShrink: 0 }}>{item.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>₹{item.price} × {item.qty} = ₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-8">
                  <button className="btn btn-outline btn-xs" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                  <button className="btn btn-outline btn-xs" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  <button className="btn btn-danger btn-xs" onClick={() => removeFromCart(item.id)}><Trash2 size={11} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout form */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Delivery Details</h3>
            <div className="form-group mb-12">
              <label className="form-label">Your Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group mb-12">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" />
            </div>
            <div className="form-group mb-12">
              <label className="form-label">Delivery Address (leave blank for takeaway)</label>
              <textarea className="form-textarea" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Full address..." />
            </div>
            <div className="form-group mb-12">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={form.payment} onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}>
                <option value="cash">Cash on Delivery</option>
                <option value="online">Online Payment (Mock)</option>
                <option value="card">Card at Delivery</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Special Instructions</label>
              <textarea className="form-textarea" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any special requests..." />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between mb-8" style={{ fontSize: 13 }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="flex justify-between mb-6" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-6" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <span>GST (5%)</span><span>₹{tax}</span>
          </div>
          <div className="divider" />
          <div className="flex justify-between mb-20" style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
            <span>Total</span><span>₹{grandTotal.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary w-full btn-lg" onClick={handleCheckout}>
            🎉 Place Order
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>Estimated delivery: 30-45 minutes</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MY ORDERS PAGE (Customer)
═══════════════════════════════════════════════════ */
export function MyOrdersPage() {
  const { orders, user } = useApp();
  const myOrders = orders.filter(o => o.customer === user?.name || o.type === 'delivery').slice(0, 10);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>My Orders</h1>
      {myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>No orders yet</h3>
          <button className="btn btn-primary" onClick={() => window.location.href = '/menu'}>Order Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myOrders.map((o, i) => (
            <motion.div key={o.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex justify-between items-start flex-wrap gap-12 mb-10">
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 2 }}>{o.id}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.date} · {o.time}</div>
                </div>
                <div className="flex gap-8">
                  <span className={`badge badge-${o.status}`}>{o.status}</span>
                  <span className={`badge badge-${o.paymentStatus}`}>{o.paymentStatus}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                {o.items.map(i => `${i.name} (×${i.qty})`).join(', ')}
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>₹{o.total.toLocaleString()}</span>
                {o.status === 'completed' && <button className="btn btn-outline btn-sm">⭐ Leave Review</button>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REVIEWS PAGE
═══════════════════════════════════════════════════ */
export function ReviewsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dish: '', rating: 5, text: '' });
  const [reviews, setReviews] = useState(reviewData);

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  const handleSubmit = () => {
    if (!form.dish || !form.text.trim()) { toast.error('Fill all fields'); return; }
    setReviews(prev => [{ id: Date.now(), customer: 'You', avatar: 'ME', rating: form.rating, text: form.text, dish: form.dish, date: '2025-06-12' }, ...prev]);
    setShowForm(false);
    setForm({ dish: '', rating: 5, text: '' });
    toast.success('Review submitted! Thank you 🌟');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Reviews & Ratings</h1>
          <div className="flex items-center gap-12 mt-4">
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--yellow)' }}>⭐ {avgRating}</span>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Average Rating</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{reviews.length} reviews</div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          <Star size={16} /> Write a Review
        </button>
      </div>

      {showForm && (
        <motion.div className="card mb-20" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Your Review</h3>
          <div className="grid grid-2 mb-14">
            <div className="form-group">
              <label className="form-label">Dish Name</label>
              <input className="form-input" value={form.dish} onChange={e => setForm(p => ({ ...p, dish: e.target.value }))} placeholder="Which dish?" />
            </div>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select className="form-select" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★ {'⭐'.repeat(r)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group mb-14">
            <label className="form-label">Your Experience</label>
            <textarea className="form-textarea" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="Share your dining experience..." rows={3} />
          </div>
          <div className="flex gap-10 justify-end">
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Review</button>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.map((r, i) => (
          <motion.div key={r.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex justify-between items-start flex-wrap gap-10 mb-10">
              <div className="flex items-center gap-12">
                <div className="avatar" style={{ width: 40, height: 40 }}>{r.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }, (_, j) => <span key={j} style={{ color: j < r.rating ? 'var(--yellow)' : 'var(--border-strong)', fontSize: 16 }}>★</span>)}
                </div>
              </div>
            </div>
            <span className="badge badge-orange mb-8">{r.dish}</span>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 8, fontStyle: 'italic' }}>"{r.text}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OFFERS PAGE
═══════════════════════════════════════════════════ */
export function OffersPage() {
  const [search, setSearch] = useState('');

  const filtered = promos.filter(p => !search || p.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Offers & Promotions</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage discount codes and special campaigns</p>
        </div>
        <button className="btn btn-primary" onClick={() => toast.success('Add Promo coming soon!')}><Plus size={16} /> New Promo</button>
      </div>

      <div className="card mb-20">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input className="form-input" placeholder="Search promo codes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-2">
        {filtered.map((p, i) => (
          <motion.div key={p.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ borderLeft: `4px solid ${p.status === 'active' ? 'var(--green)' : p.status === 'expiring' ? 'var(--yellow)' : 'var(--red)'}` }}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800, color: 'var(--accent)', letterSpacing: 2 }}>{p.code}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Min order: ₹{p.minOrder}</div>
              </div>
              <div className="flex flex-col items-end gap-6">
                <span className={`badge badge-${p.status}`}>{p.status}</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>
                  {p.type === 'percent' ? `${p.discount}%` : `₹${p.discount}`} OFF
                </div>
              </div>
            </div>
            <div className="divider" style={{ margin: '10px 0' }} />
            <div className="flex justify-between" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Expires: {p.expires}</span>
              <span>{p.usages} uses</span>
            </div>
            <div className="flex gap-8 mt-auto" style={{ marginTop: 12 }}>
              <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard.writeText(p.code); toast.success(`Copied: ${p.code}`); }}>📋 Copy Code</button>
              <button className="btn btn-danger btn-sm" onClick={() => toast.success('Promo deactivated')}>Deactivate</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DELIVERY PAGE
═══════════════════════════════════════════════════ */
export function DeliveryPage() {
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Delivery Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Track and manage all delivery orders</p>

      <div className="grid grid-3 mb-24">
        {[
          { label: 'Out for Delivery', value: 1, color: 'var(--yellow)', icon: '🛵' },
          { label: 'Delivered Today', value: 8, color: 'var(--green)', icon: '✅' },
          { label: 'Cancelled', value: 1, color: 'var(--red)', icon: '❌' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}22`, fontSize: 24 }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {deliveries.map((d, i) => (
          <motion.div key={d.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="flex justify-between items-start flex-wrap gap-12">
              <div>
                <div className="flex gap-8 items-center mb-4">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>{d.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>→ {d.orderId}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{d.customer}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📍 {d.address}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>🛵 Driver: {d.driver} · 📏 {d.distance}</div>
              </div>
              <div className="flex flex-col items-end gap-8">
                <span className={`badge badge-${d.status === 'out-for-delivery' ? 'preparing' : d.status === 'cancelled' ? 'cancelled' : 'completed'}`}>
                  {d.status.replace(/-/g, ' ')}
                </span>
                {d.estimatedTime !== '-' && <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>⏱️ {d.estimatedTime}</div>}
              </div>
            </div>
            {d.status === 'out-for-delivery' && (
              <div style={{ marginTop: 12, background: 'var(--accent-soft)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Truck size={16} color="var(--accent)" />
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Order is on the way — ETA {d.estimatedTime}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NOTIFICATIONS PAGE
═══════════════════════════════════════════════════ */
export function NotificationsPage() {
  const { notifications, markNotifRead, markAllNotifRead } = useApp();
  const [filter, setFilter] = useState('all');

  const typeIcons = { order: '🛒', reservation: '📅', inventory: '📦', promo: '🏷️', payment: '💰' };

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && !n.read) || n.type === filter);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Notifications</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {unread > 0 ? <><strong style={{ color: 'var(--accent)' }}>{unread} unread</strong> notification{unread > 1 ? 's' : ''}</> : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && <button className="btn btn-outline btn-sm" onClick={markAllNotifRead}><CheckCheck size={14} /> Mark all read</button>}
      </div>

      <div className="flex gap-8 mb-16 flex-wrap">
        {['all', 'unread', 'order', 'reservation', 'inventory', 'promo'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
          <h3>No notifications</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((n, i) => (
            <motion.div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => markNotifRead(n.id)}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {typeIcons[n.type] || '🔔'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between items-start gap-8 mb-4">
                  <div style={{ fontWeight: 600, fontSize: 14 }} className="flex items-center gap-8">
                    {n.title}
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════ */
export function ProfilePage() {
  const { user } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', bio: 'Restaurant management professional' });

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div className="card mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--red-soft))', border: '1px solid var(--border-strong)' }}>
        <div className="flex items-center gap-20 flex-wrap">
          <div style={{ position: 'relative' }}>
            <div className="avatar" style={{ width: 72, height: 72, fontSize: 22, borderRadius: 18 }}>{user?.avatar}</div>
            <button style={{ position: 'absolute', bottom: -3, right: -3, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => toast.success('Photo upload (mock)')}>
              <Camera size={12} color="white" />
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{user?.email}</p>
            <span className={`role-badge role-${user?.role}`} style={{ display: 'inline-block', marginTop: 8 }}>{user?.role}</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setEditing(e => !e)}>
            {editing ? <><Save size={14} onClick={handleSave} /> Save</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-2 mb-20">
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Full Name', field: 'name' },
              { label: 'Email Address', field: 'email', type: 'email' },
              { label: 'Phone Number', field: 'phone' },
            ].map(f => (
              <div key={f.field} className="form-group">
                <label className="form-label">{f.label}</label>
                {editing ? (
                  <input className="form-input" type={f.type || 'text'} value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))} />
                ) : (
                  <div style={{ fontSize: 14, padding: '10px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {form[f.field] || <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Account Settings</h3>
          <div className="form-group mb-14">
            <label className="form-label">Bio</label>
            {editing ? (
              <textarea className="form-textarea" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} />
            ) : (
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{form.bio}</div>
            )}
          </div>
          <div className="divider" />
          <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Change Password</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="form-input" type="password" placeholder="Current password" />
            <input className="form-input" type="password" placeholder="New password" />
            <input className="form-input" type="password" placeholder="Confirm new password" />
            <button className="btn btn-primary btn-sm" onClick={() => toast.success('Password updated (mock)')}>Update Password</button>
          </div>
        </motion.div>
      </div>

      {editing && (
        <div className="flex gap-12 justify-end">
          <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Changes</button>
        </div>
      )}
    </div>
  );
}
