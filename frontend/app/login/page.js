'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { setToken } from '@/lib/useAuth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not log in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-serif text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Log in to your Style Heaven account.</p>

      {error && <p className="mt-4 text-sm text-sale">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Email</label>
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
        New here? <a href="/signup" className="font-semibold text-ink underline">Create an account</a>
      </p>
    </div>
  );
}
