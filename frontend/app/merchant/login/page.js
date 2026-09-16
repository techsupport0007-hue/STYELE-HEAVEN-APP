'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function MerchantLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('sh_token', data.token);
      window.location.href = '/merchant';
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not log in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Style Haven B2B</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">Merchant login</h1>
      <p className="mt-2 text-sm text-muted">For approved business sourcing partners.</p>

      {error && <p className="mt-4 text-sm text-sale">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Business email</label>
          <input
            type="email"
            required
            className="input-underline"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Password</label>
          <input
            type="password"
            required
            className="input-underline"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button
          disabled={loading}
          className="h-12 w-full rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Not a partner yet? <a href="/merchant" className="font-semibold text-emerald underline">Submit a merchant enquiry</a>
      </p>
    </div>
  );
}
