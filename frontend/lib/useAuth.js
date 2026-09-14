'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

const TOKEN_KEY = 'sh_token';
const AUTH_EVENT = 'sh-auth-updated';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_EVENT));
  import('./useWishlist').then((m) => m.invalidateWishlistCache());
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
  import('./useWishlist').then((m) => m.invalidateWishlistCache());
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        // Token invalid/expired — clear it so the UI doesn't stay stuck
        // showing a logged-in state that the API no longer honours.
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(AUTH_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(AUTH_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  function logout() {
    clearToken();
    window.location.href = '/';
  }

  return { user, loading, logout, refresh };
}
