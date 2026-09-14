'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { setToken } from '@/lib/useAuth';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-serif text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Join Style Heaven for a faster checkout.</p>

      {error && <p className="mt-4 text-sm text-sale">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Full name</label>
          <input required className="input-underline" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Email</label>
          <input type="email" required className="input-underline" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Mobile number</label>
          <input
            type="tel"
            maxLength={10}
            className="input-underline"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Password</label>
          <input
            type="password"
            required
            minLength={8}
            className="input-underline"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        <button
          disabled={loading}
          className="h-12 w-full rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <a href="/login" className="font-semibold text-ink underline">Log in</a>
      </p>
    </div>
  );
}
