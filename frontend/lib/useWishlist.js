'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { getToken } from './useAuth';

const WISHLIST_EVENT = 'sh-wishlist-updated';

// Module-level cache shared by every component using this hook, so
// rendering 10+ ProductCards on a page triggers exactly one GET
// request instead of one per card.
let cache = null; // null = not yet loaded; Set of product id strings once loaded
let loadingPromise = null;

async function loadWishlist() {
  if (!getToken()) {
    cache = new Set();
    window.dispatchEvent(new Event(WISHLIST_EVENT));
    return cache;
  }
  if (!loadingPromise) {
    loadingPromise = api
      .get('/wishlist')
      .then(({ data }) => {
        cache = new Set((data.products || []).map((p) => String(p._id)));
        window.dispatchEvent(new Event(WISHLIST_EVENT));
        return cache;
      })
      .catch(() => {
        cache = new Set();
        window.dispatchEvent(new Event(WISHLIST_EVENT));
        return cache;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }
  return loadingPromise;
}

// Called on login/logout elsewhere so a new user's wishlist is refetched.
export function invalidateWishlistCache() {
  cache = null;
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export function useWishlist() {
  const [ids, setIds] = useState(cache || new Set());
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    function sync() {
      setIds(cache || new Set());
      setLoading(cache === null);
    }
    if (cache === null) loadWishlist().then(sync);
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, []);

  const toggle = useCallback(async (productId) => {
    const id = String(productId);
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }
    const wasIn = cache?.has(id);
    // Optimistic update so the heart responds instantly.
    cache = new Set(cache || []);
    if (wasIn) cache.delete(id);
    else cache.add(id);
    window.dispatchEvent(new Event(WISHLIST_EVENT));

    try {
      if (wasIn) await api.delete(`/wishlist/${id}`);
      else await api.post(`/wishlist/${id}`);
    } catch {
      // Revert on failure.
      cache = new Set(cache || []);
      if (wasIn) cache.add(id);
      else cache.delete(id);
      window.dispatchEvent(new Event(WISHLIST_EVENT));
    }
  }, []);

  return { ids, loading, toggle, has: (id) => ids.has(String(id)) };
}
