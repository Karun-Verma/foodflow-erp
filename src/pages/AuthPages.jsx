import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,var(--accent),#ef4444)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>🍽️</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>{subtitle}</p>
          </div>
          <div className="card" style={{ border: '1px solid var(--border-strong)' }}>{children}</div>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 20 }}>
            🔐 Demo: admin@foodflow.com / admin123 · staff@foodflow.com / staff123 · customer@foodflow.com / customer123
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 4) e.password = 'Password too short';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 🎉`);
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
      toast.error(result.error);
    }
  };

  const quickLogin = (role) => {
    const creds = { admin: ['admin@foodflow.com', 'admin123'], staff: ['staff@foodflow.com', 'staff123'], customer: ['customer@foodflow.com', 'customer123'] };
    setForm({ email: creds[role][0], password: creds[role][1] });
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign in to FoodFlow ERP">
      <form onSubmit={handleSubmit}>
        {errors.general && <div style={{ background: 'var(--red-soft)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--red)' }}>{errors.general}</div>}

        <div className="form-group mb-16">
          <label className="form-label">Email Address</label>
          <div className="relative">
            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Enter your email" style={{ paddingLeft: 38 }} />
          </div>
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group mb-20">
          <div className="flex justify-between mb-4">
            <label className="form-label">Password</label>
            <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent)' }}>Forgot Password?</Link>
          </div>
          <div className="relative">
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter your password" style={{ paddingLeft: 38, paddingRight: 38 }} />
            <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShow(s => !s)}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={loading}>
          {loading ? '⏳ Signing in...' : '🔐 Sign In'}
        </button>

        <div className="divider" style={{ margin: '16px 0' }} />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 10 }}>Quick Demo Login:</p>
        <div className="flex gap-8 justify-center">
          {['admin', 'staff', 'customer'].map(r => (
            <button key={r} type="button" className="btn btn-outline btn-xs" onClick={() => quickLogin(r)} style={{ textTransform: 'capitalize' }}>{r}</button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'customer' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (!form.phone || form.phone.length < 10) e.phone = 'Enter a valid phone number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    toast.success('Account created! Please login with your credentials.');
    navigate('/login');
  };

  const Field = ({ label, field, type = 'text', placeholder, icon: Icon }) => (
    <div className="form-group mb-14">
      <label className="form-label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />}
        <input className="form-input" type={type} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} style={Icon ? { paddingLeft: 38 } : {}} />
      </div>
      {errors[field] && <span className="form-error">{errors[field]}</span>}
    </div>
  );

  return (
    <AuthLayout title="Create Account" subtitle="Join FoodFlow and start ordering">
      <form onSubmit={handleSubmit}>
        <Field label="Full Name" field="name" placeholder="Your full name" icon={User} />
        <Field label="Email Address" field="email" type="email" placeholder="your@email.com" icon={Mail} />
        <Field label="Phone Number" field="phone" type="tel" placeholder="+91 9876543210" icon={Phone} />

        <div className="form-group mb-14">
          <label className="form-label">Account Type</label>
          <select className="form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Field label="Password" field="password" type={show ? 'text' : 'password'} placeholder="Min 6 characters" icon={Lock} />

        <div className="form-group mb-20">
          <label className="form-label">Confirm Password</label>
          <div className="relative">
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" type={show ? 'text' : 'password'} value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" style={{ paddingLeft: 38 }} />
          </div>
          {errors.confirm && <span className="form-error">{errors.confirm}</span>}
        </div>

        <button className="btn btn-primary w-full" type="submit">Create Account 🎉</button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Enter a valid email'); return; }
    setSent(true);
    toast.success('Reset link sent! Check your email.');
  };

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you a reset link">
      {sent ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Email Sent!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Check your inbox for the password reset link.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button type="button" className="flex items-center gap-8 mb-20" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }} onClick={() => navigate('/login')}>
            <ArrowLeft size={14} /> Back to Login
          </button>
          <div className="form-group mb-20">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter registered email" style={{ paddingLeft: 38 }} />
            </div>
          </div>
          <button className="btn btn-primary w-full" type="submit">Send Reset Link 📧</button>
        </form>
      )}
    </AuthLayout>
  );
}
