import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Search, Calendar, Users, Clock, Phone, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tables } from '../data/mockData';
import { useDebounce } from '../hooks/useRestaurant';
import { Modal } from '../components/common/index';

function ReservationForm({ onSave, onClose }) {
  const [form, setForm] = useState({ customer: '', phone: '', date: '', time: '', guests: 2, table: '', special: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.customer.trim()) e.customer = 'Name is required';
    if (!form.phone || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Time is required';
    if (!form.table) e.table = 'Select a table';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({
      ...form, id: `RES${String(Date.now()).slice(-3)}`,
      status: 'confirmed', guests: parseInt(form.guests),
    });
    onClose();
  };

  const availableTables = tables.filter(t => t.status === 'available' && t.capacity >= form.guests);
  const times = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];

  return (
    <div>
      <div className="grid grid-2 mb-14">
        <div className="form-group">
          <label className="form-label">Guest Name</label>
          <input className="form-input" value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))} placeholder="Full name" />
          {errors.customer && <span className="form-error">{errors.customer}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="grid grid-3 mb-14">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Time</label>
          <select className="form-select" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
            <option value="">Select time</option>
            {times.map(t => <option key={t}>{t}</option>)}
          </select>
          {errors.time && <span className="form-error">{errors.time}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Number of Guests</label>
          <input className="form-input" type="number" value={form.guests} min={1} max={20} onChange={e => setForm(p => ({ ...p, guests: e.target.value, table: '' }))} />
        </div>
      </div>

      <div className="form-group mb-14">
        <label className="form-label">Select Table</label>
        <select className="form-select" value={form.table} onChange={e => setForm(p => ({ ...p, table: e.target.value }))}>
          <option value="">Choose a table</option>
          {availableTables.map(t => <option key={t.id} value={t.number}>{t.number} — {t.section} ({t.capacity} seats)</option>)}
        </select>
        {errors.table && <span className="form-error">{errors.table}</span>}
        {availableTables.length === 0 && <span className="form-error">No available tables for {form.guests} guests</span>}
      </div>

      <div className="form-group mb-20">
        <label className="form-label">Special Requests</label>
        <textarea className="form-textarea" value={form.special} onChange={e => setForm(p => ({ ...p, special: e.target.value }))} placeholder="e.g. Birthday celebration, window seat, dietary requirements..." rows={2} />
      </div>

      <div className="flex gap-12 justify-end">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>📅 Confirm Reservation</button>
      </div>
    </div>
  );
}

export default function ReservationsPage() {
  const { reservations, addReservation, updateReservation, user } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const dSearch = useDebounce(search, 300);

  const filtered = reservations.filter(r => {
    const matchSearch = !dSearch || r.customer.toLowerCase().includes(dSearch.toLowerCase()) || r.id.toLowerCase().includes(dSearch.toLowerCase());
    return matchSearch && (filter === 'all' || r.status === filter);
  });

  const counts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  const handleSave = (res) => {
    addReservation(res);
    toast.success(`Reservation confirmed for ${res.customer}!`);
  };

  const handleStatus = (id, status) => {
    updateReservation(id, { status });
    toast.success(`Reservation ${status}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-20 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Table Reservations</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{reservations.length} total reservations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Reservation
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-4 mb-20">
        {[
          { label: 'Confirmed', value: counts.confirmed, color: 'var(--green)', icon: '✅' },
          { label: 'Pending', value: counts.pending, color: 'var(--yellow)', icon: '⏳' },
          { label: 'Cancelled', value: counts.cancelled, color: 'var(--red)', icon: '❌' },
          { label: 'Today', value: reservations.filter(r => r.date === '2025-06-12').length, color: 'var(--accent)', icon: '📅' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}22` }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-20">
        <div className="flex gap-12 flex-wrap">
          <div className="search-box" style={{ flex: '1 1 200px' }}>
            <Search size={16} className="search-icon" />
            <input className="form-input" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-8 flex-wrap">
            {Object.entries(counts).map(([status, count]) => (
              <button key={status} className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(status)} style={{ textTransform: 'capitalize' }}>
                {status} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No reservations found</h3>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowModal(true)}>Make a Reservation</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((r, i) => (
            <motion.div key={r.id} className="card card-hover" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex justify-between items-start flex-wrap gap-12">
                <div className="flex gap-16 flex-wrap items-start">
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 2 }}>{r.id}</div>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{r.customer}</h3>
                    <div className="flex items-center gap-6 mt-4" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      <Phone size={11} /> {r.phone}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {[
                      { icon: <Calendar size={13} />, val: r.date },
                      { icon: <Clock size={13} />, val: r.time },
                      { icon: <Users size={13} />, val: `${r.guests} guests` },
                    ].map((info, j) => (
                      <div key={j} className="flex items-center gap-6" style={{ fontSize: 13 }}>
                        <span style={{ color: 'var(--accent)' }}>{info.icon}</span> {info.val}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-8">
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Table: {r.table}</span>
                  <div className="flex gap-8">
                    {r.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleStatus(r.id, 'confirmed')}>
                          <CheckCircle size={12} /> Confirm
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatus(r.id, 'cancelled')}>
                          <X size={12} /> Cancel
                        </button>
                      </>
                    )}
                    {r.status === 'confirmed' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleStatus(r.id, 'cancelled')}>
                        <X size={12} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {r.special && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--accent-soft)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent)' }}>
                  💬 {r.special}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal title="New Table Reservation" onClose={() => setShowModal(false)} maxWidth={580}>
            <ReservationForm onSave={handleSave} onClose={() => setShowModal(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
