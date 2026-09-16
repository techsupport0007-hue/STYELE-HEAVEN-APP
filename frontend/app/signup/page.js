'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { setToken } from '@/lib/useAuth';

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a18.4 18.4 0 0 1-3.1 3.8" />
      <path d="M6.2 6.2C3.8 8.1 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (name.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    /*
     * Password requirements:
     * - Minimum 6 characters
     * - At least 1 alphabet
     * - At least 1 number
     * - At least 1 special character
     */
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

    if (!passwordPattern.test(form.password)) {
      setError(
        'Password must be at least 6 characters and contain at least 1 alphabet, 1 number, and 1 symbol.'
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/signup', {
        name,
        email,
        phone: phone || undefined,
        password: form.password,
      });

      setToken(data.token);
      window.location.href = '/';
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          'Could not create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="mx-auto flex w-full max-w-md items-center px-5 py-12 sm:px-6">
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
                Fashion {'\u00B7'} Lifestyle
              </span>
            </a>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-serif text-3xl text-ink sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Join Style Haven for a faster and easier checkout.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink">
                Full name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink">
                Mobile number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                placeholder="10-digit mobile number"
                autoComplete="tel"
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  className="h-12 w-full rounded-xl border border-line bg-white px-4 pr-12 text-sm text-ink outline-none transition focus:border-ink"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
                >
                  <EyeIcon hidden={!showPassword} />
                </button>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-muted">
                Minimum 6 characters with at least 1 alphabet, 1 number and 1 symbol.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className="h-12 w-full rounded-xl border border-line bg-white px-4 pr-12 text-sm text-ink outline-none transition focus:border-ink"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
                >
                  <EyeIcon hidden={!showConfirmPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-cta text-xs font-bold uppercase tracking-wide text-ink transition hover:bg-cta-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold text-ink underline underline-offset-4"
            >
              Sign in
            </a>
          </p>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-xs font-bold uppercase tracking-wide text-muted transition hover:text-ink"
            >
              {'\u2190'} Back to shopping
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}