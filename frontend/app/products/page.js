'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import Pagination from '@/components/Pagination';
import { fetchProducts } from '@/lib/api';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-4 py-20 text-center text-muted">Loading…</div>}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsPageInner() {
  const params = useSearchParams();
  const router = useRouter();

  const category = params.get('cat') || '';
  const filter = params.get('filter') || '';
  const sort = params.get('sort') || '';
  const q = params.get('q') || '';
  const page = Number(params.get('page') || 1);

  const [state, setState] = useState({ products: [], total: 0, pages: 1, loading: true, error: '' });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await fetchProducts({ page, category, filter, sort, q, limit: 10 });
      setState({ products: data.products, total: data.total, pages: data.pages, loading: false, error: '' });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err?.response?.data?.error || 'Could not load products right now.',
      }));
    }
  }, [page, category, filter, sort, q]);

  useEffect(() => {
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [load]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    // Filtering/sorting is a browsing action, distinct from a text search —
    // clicking a filter chip while a search term is active previously
    // combined them (badge=NEW AND regex(q)), which could zero out
    // results even though relevant products exist. Selecting a filter
    // now starts a fresh browse instead of narrowing an active search.
    if (['filter', 'sort', 'cat'].includes(key) && q) {
      next.delete('q');
    }
    router.push(`/products?${next.toString()}`);
  }

  function handleClearSearch() {
    const next = new URLSearchParams(params.toString());
    next.delete('q');
    next.delete('page');
    router.push(`/products?${next.toString()}`);
  }

  return (
    <div className="mx-auto max-w-container px-4 py-10 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">
          {category || 'All Products'}
        </p>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl">
          {q ? `Results for “${q}”` : 'The Style Heaven Collection'}
        </h1>
        <p className="mt-2 text-sm text-muted">{state.total} products</p>
        {q && (
          <button
            onClick={handleClearSearch}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-line"
          >
            Search: &ldquo;{q}&rdquo; <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      <Filters
        filter={filter}
        sort={sort}
        onFilterChange={(v) => updateParam('filter', v)}
        onSortChange={(v) => updateParam('sort', v)}
      />

      {state.error && (
        <div className="mt-10 rounded border border-line bg-surface p-6 text-center text-sm text-muted">
          {state.error}
        </div>
      )}

      {state.loading ? (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-product w-full rounded-2xl" />
              <div className="skeleton mt-3 h-3 w-1/2 rounded" />
              <div className="skeleton mt-2 h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : !state.error && state.products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-surface p-10 text-center text-sm text-muted">
          No products match these filters yet.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {state.products.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination page={page} pages={state.pages} onChange={(p) => updateParam('page', p)} />
    </div>
  );
}
