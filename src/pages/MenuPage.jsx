import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Plus, Edit3, Trash2, X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { useDebounce, usePagination } from '../hooks/useRestaurant';
import { Modal, Pagination, StarRating } from '../components/common/index';

function MenuForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || {
    name: '', category: 'Starters', price: '', desc: '', image: '🍽️',
    rating: 4.5, reviews: 0, available: true, popular: false, prepTime: 15, calories: 0,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || form.price <= 0) e.price = 'Enter valid price';
    if (!form.desc.trim()) e.desc = 'Description is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form, price: parseFloat(form.price), id: form.id || Date.now() });
    onClose();
  };

  const EMOJIS = ['🍽️', '🍛', '🍔', '🍕', '🍗', '🍚', '🥗', '🍜', '🧀', '🐟', '🥭', '☕', '🍵', '🍮', '🍫', '🎁', '💑', '🥡'];

  return (
    <div>
      <div className="grid grid-2 mb-14">
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Butter Chicken" />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group mb-14">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the dish..." rows={2} />
        {errors.desc && <span className="form-error">{errors.desc}</span>}
      </div>

      <div className="grid grid-3 mb-14">
        <div className="form-group">
          <label className="form-label">Price (₹)</label>
          <input className="form-input" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="280" />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Prep Time (min)</label>
          <input className="form-input" type="number" value={form.prepTime} onChange={e => setForm(p => ({ ...p, prepTime: parseInt(e.target.value) }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Calories</label>
          <input className="form-input" type="number" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: parseInt(e.target.value) }))} />
        </div>
      </div>

      <div className="form-group mb-14">
        <label className="form-label">Icon / Image</label>
        <div className="flex flex-wrap gap-8 mb-8">
          {EMOJIS.map(em => (
            <button key={em} type="button" onClick={() => setForm(p => ({ ...p, image: em }))}
              style={{ width: 36, height: 36, borderRadius: 8, fontSize: 20, background: form.image === em ? 'var(--accent-soft)' : 'var(--bg-input)', border: `1px solid ${form.image === em ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer' }}>
              {em}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Selected: {form.image}</div>
      </div>

      <div className="flex gap-16 mb-20">
        <label className="flex items-center gap-8 pointer" style={{ fontSize: 14 }}>
          <input type="checkbox" checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} />
          Available
        </label>
        <label className="flex items-center gap-8 pointer" style={{ fontSize: 14 }}>
          <input type="checkbox" checked={form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} />
          Mark as Popular
        </label>
      </div>

      <div className="flex gap-12 justify-end">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>{item ? '💾 Update Item' : '➕ Add Item'}</button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, addToCart, user } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showAvailable, setShowAvailable] = useState(false);
  const [modal, setModal] = useState(null); // null | 'add' | item
  const debouncedSearch = useDebounce(search, 300);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const filtered = useMemo(() => {
    let arr = [...menuItems];
    if (debouncedSearch) arr = arr.filter(m => m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || m.desc.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (category !== 'All') arr = arr.filter(m => m.category === category);
    if (showAvailable) arr = arr.filter(m => m.available);
    return arr;
  }, [menuItems, debouncedSearch, category, showAvailable]);

  const { current, page, total, next, prev, goTo } = usePagination(filtered, 12);

  const handleSave = (item) => {
    if (item.id && menuItems.find(m => m.id === item.id)) {
      updateMenuItem(item.id, item);
      toast.success('Menu item updated!');
    } else {
      addMenuItem(item);
      toast.success('New item added to menu!');
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove "${name}" from menu?`)) {
      deleteMenuItem(id);
      toast.success(`${name} removed from menu.`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-24 flex-wrap gap-16">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Menu {isCustomer ? '— Order Online' : 'Management'}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{filtered.length} of {menuItems.length} items</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Menu Item
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-20">
        <div className="flex gap-12 flex-wrap">
          <div className="search-box" style={{ flex: '1 1 200px' }}>
            <Search size={16} className="search-icon" />
            <input className="form-input" placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <label className="flex items-center gap-8 btn btn-outline btn-sm pointer">
            <input type="checkbox" checked={showAvailable} onChange={e => setShowAvailable(e.target.checked)} />
            Available Only
          </label>
        </div>
        <div className="flex gap-8 flex-wrap" style={{ marginTop: 12 }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategory(c)}>
              {c === 'All' ? '🍽️' : ''} {c}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {current.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No dishes found</h3>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => { setSearch(''); setCategory('All'); }}>Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-menu">
          {current.map((item, i) => (
            <motion.div key={item.id} className="food-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="food-card-img" style={{ opacity: item.available ? 1 : 0.5 }}>
                {item.image}
                {!item.available && (
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'var(--red)', color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                    UNAVAILABLE
                  </div>
                )}
                {item.popular && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                    🔥 POPULAR
                  </div>
                )}
              </div>
              <div className="food-card-body">
                <div className="flex justify-between items-start gap-8 mb-4">
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</h4>
                  <span className="badge badge-orange" style={{ fontSize: 10 }}>{item.category}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}
                  className="truncate">{item.desc}</p>
                <StarRating rating={item.rating} size={12} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  ⏱️ {item.prepTime}min · 🔥 {item.calories} cal
                </div>
              </div>
              <div className="food-card-footer">
                <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>₹{item.price}</span>
                <div className="flex gap-8">
                  {isAdmin && (
                    <>
                      <button className="btn btn-outline btn-sm" onClick={() => setModal(item)}>
                        <Edit3 size={12} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.name)}>
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                  {(isCustomer || user?.role === 'staff') && item.available && (
                    <button className="btn btn-primary btn-sm" onClick={() => { addToCart(item); toast.success(`${item.name} added to cart!`); }}>
                      + Cart
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination page={page} total={total} prev={prev} next={next} goTo={goTo} />

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add New Menu Item' : `Edit: ${modal.name}`} onClose={() => setModal(null)} maxWidth={600}>
            <MenuForm item={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
