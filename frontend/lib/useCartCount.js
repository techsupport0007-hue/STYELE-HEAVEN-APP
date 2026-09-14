'use client';

import { useEffect, useState } from 'react';

const CART_KEY = 'sh_cart';
const CART_EVENT = 'sh-cart-updated';

export function readCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const items = readCart();
      setCount(items.reduce((sum, i) => sum + (i.qty || 1), 0));
    };
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return count;
}
