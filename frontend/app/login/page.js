'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { setToken } from '@/lib/useAuth';

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m3 3 18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a18.4 18.4 0 0 1-3.1 3.8" />
      <path d="M6.2 6.2C3.8 8.1 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          'Could not log in. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md items-center px-5 py-12 sm:px-6">
        <div className="w-full">
          {/* Logo */}
          <div className="mb-10 text-center">
            <a
              href="/"
              aria-label="Style Haven home"
              className="inline-flex flex-col items-center"
            >
              <span className="font-serif text-3xl tracking-[0.12em] text-ink">
                STYLE HAVEN
              </span>

              <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.4em] text-muted">
                Fashion · Lifestyle
              </span>
            </a>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-serif text-3xl text-ink sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Sign in to access your Style Haven account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-muted"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="input-underline w-full"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-semibold text-ink underline underline-offset-4 transition hover:text-muted"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="input-underline w-full pr-12"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted transition hover:text-ink"
                >
                  <EyeIcon hidden={!showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-ink text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Create account */}
          <div className="mt-8 border-t border-line pt-7 text-center">
            <p className="text-sm text-muted">
              New to Style Haven?
            </p>

            <a
              href="/signup"
              className="mt-2 inline-block text-sm font-bold text-ink underline underline-offset-4"
            >
              Create an account
            </a>
          </div>

          {/* Back to shopping */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-xs font-bold uppercase tracking-[0.15em] text-muted transition hover:text-ink"
            >
              ← Back to shopping
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}