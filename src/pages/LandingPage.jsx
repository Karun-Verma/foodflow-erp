import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Phone, MapPin, Clock, ChevronRight, Mail } from 'lucide-react';
import { menuItems, reviews } from '../data/mockData';

const specials = [
  { title: 'Happy Hours', desc: '20% off all beverages from 4-6 PM', icon: '🕐', badge: 'Daily' },
  { title: 'Weekend Brunch', desc: 'Special brunch menu every Saturday & Sunday', icon: '🌅', badge: 'Weekend' },
  { title: 'Family Pack', desc: 'Family combo at ₹899 — feeds up to 4', icon: '👨‍👩‍👧‍👦', badge: 'Best Value' },
  { title: 'Birthday Treat', desc: 'Free dessert platter on your birthday!', icon: '🎂', badge: 'Special' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const navigate = useNavigate();
  const featured = menuItems.filter(m => m.popular).slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="flex items-center gap-12">
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--accent),#ef4444)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽️</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,var(--accent),#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodFlow</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Order Now</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
          <motion.div variants={fadeUp}>
            <span className="badge badge-orange" style={{ marginBottom: 16, fontSize: 12 }}>🔥 Now Open — 11 AM to 11 PM</span>
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
            Authentic Flavors<br />
            <span style={{ background: 'linear-gradient(135deg,var(--accent),#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Delivered Fresh
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32, maxWidth: 480 }}>
            Experience the finest Indian and Continental cuisine made with hand-picked ingredients. Dine in, take away, or get it delivered — your way.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-12 flex-wrap">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Order Online 🛒</button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>Reserve a Table 🍽️</button>
          </motion.div>
          <motion.div variants={fadeUp} className="flex gap-24 flex-wrap" style={{ marginTop: 32 }}>
            {[{ val: '4.9★', lbl: 'Rating' }, { val: '50K+', lbl: 'Happy Guests' }, { val: '120+', lbl: 'Dishes' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.lbl}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
          style={{ textAlign: 'center', fontSize: 120, lineHeight: 1, filter: 'drop-shadow(0 20px 40px rgba(249,115,22,0.3))' }}>
          🍛
        </motion.div>
      </section>

      {/* Featured Dishes */}
      <section style={{ padding: '60px 40px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="flex justify-between items-center mb-24 flex-wrap gap-16">
            <div>
              <h2 style={{ fontSize: 30, fontWeight: 800 }}>Most Loved Dishes</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Bestsellers chosen by our guests</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/register')}>View Full Menu <ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-menu">
            {featured.map((item, i) => (
              <motion.div key={item.id} className="food-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                onClick={() => navigate('/register')}>
                <div className="food-card-img">{item.image}</div>
                <div className="food-card-body">
                  <div className="flex justify-between items-start gap-8 mb-4">
                    <h4 style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</h4>
                    <span className="badge badge-orange">{item.category}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }} className="truncate">{item.desc}</p>
                  <div className="flex items-center gap-8">
                    <div className="stars">{Array.from({ length: 5 }, (_, j) => <span key={j} style={{ fontSize: 11 }}>{j < Math.floor(item.rating) ? '★' : '☆'}</span>)}</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({item.reviews})</span>
                  </div>
                </div>
                <div className="food-card-footer">
                  <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>₹{item.price}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Order</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section style={{ padding: '60px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="badge badge-orange" style={{ marginBottom: 12 }}>Limited Time</span>
          <h2 style={{ fontSize: 30, fontWeight: 800 }}>Special Offers</h2>
        </div>
        <div className="grid grid-4">
          {specials.map((s, i) => (
            <motion.div key={i} className="card card-hover" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
              <div className="badge badge-orange mb-8">{s.badge}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: '60px 40px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800 }}>What Our Guests Say</h2>
          </div>
          <div className="grid grid-3">
            {reviews.slice(0, 3).map((r, i) => (
              <motion.div key={r.id} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="flex gap-4 mb-12">
                  {Array.from({ length: r.rating }, (_, j) => <span key={j} style={{ color: 'var(--yellow)', fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{r.text}"</p>
                <div className="flex items-center gap-10">
                  <div className="avatar" style={{ width: 38, height: 38 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.customer}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ordered: {r.dish}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section style={{ padding: '60px 40px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ background: 'linear-gradient(135deg,var(--accent-soft),var(--red-soft))', border: '1px solid var(--border-strong)', borderRadius: 28, padding: '60px 40px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Reserve Your Table Today</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            Book a table for a special occasion or just a great meal. We'll take care of the rest.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Book a Table</button>
        </motion.div>
      </section>

      {/* Contact & Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="grid grid-3 mb-24">
            <div>
              <div className="flex items-center gap-12 mb-16">
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--accent),#ef4444)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍽️</div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,var(--accent),#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodFlow ERP</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>A complete restaurant management system built for modern dining experiences.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 14 }}>Contact Us</h4>
              <div className="flex gap-8 items-center mb-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}><MapPin size={14} /> 12 Food Street, MG Road, Bangalore</div>
              <div className="flex gap-8 items-center mb-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}><Phone size={14} /> +91 9876543210</div>
              <div className="flex gap-8 items-center" style={{ fontSize: 13, color: 'var(--text-secondary)' }}><Mail size={14} /> hello@foodflow.com</div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 14 }}>Timings</h4>
              <div className="flex gap-8 items-center mb-8" style={{ fontSize: 13, color: 'var(--text-secondary)' }}><Clock size={14} /> Mon - Fri: 11:00 AM - 11:00 PM</div>
              <div className="flex gap-8 items-center" style={{ fontSize: 13, color: 'var(--text-secondary)' }}><Clock size={14} /> Sat - Sun: 10:00 AM - 11:30 PM</div>
            </div>
          </div>
          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>© 2025 FoodFlow ERP. All rights reserved. | Demo credentials: admin@foodflow.com / admin123</p>
        </div>
      </footer>
    </div>
  );
}
