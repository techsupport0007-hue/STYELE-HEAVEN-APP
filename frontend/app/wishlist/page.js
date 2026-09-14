'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';

export default function WishlistPage() {
  const [state, setState] = useState({ products: [], loading: true, needsLogin: false, error: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('sh_token');
    if (!token) {
      setState({ products: [], loading: false, needsLogin: true, error: '' });
      return;
    }
    api
      .get('/wishlist')
      .then(({ data }) => setState({ products: data.products, loading: false, needsLogin: false, error: '' }))
      .catch((err) =>
        setState({
          products: [],
          loading: false,
          needsLogin: err?.response?.status === 401,
          error: err?.response?.data?.error || 'Could not load your wishlist.',
        })
      );
  }, []);

  return (
    <div className="mx-auto max-w-container px-4 py-10 md:px-8">
      <h1 className="mb-8 font-serif text-3xl">Your Wishlist</h1>

      {state.loading && <p className="text-sm text-muted">Loading…</p>}

      {!state.loading && state.needsLogin && (
        <div className="rounded border border-line bg-surface p-10 text-center">
          <p className="text-sm text-muted">Log in to see items you&apos;ve saved.</p>
          <a
            href="/login"
            className="mt-4 inline-block h-11 leading-[44px] rounded-full px-6 bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
          >
            Log in
          </a>
        </div>
      )}

      {!state.loading && !state.needsLogin && state.error && (
        <p className="text-sm text-sale">{state.error}</p>
      )}

      {!state.loading && !state.needsLogin && !state.error && state.products.length === 0 && (
        <p className="text-sm text-muted">
          Nothing saved yet. Tap the heart on any product to add it here.
        </p>
      )}

      {state.products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {state.products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
