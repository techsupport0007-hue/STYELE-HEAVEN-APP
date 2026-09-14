'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';

const NAV_GROUPS = [
  { type: 'link', label: 'Home', href: '/' },
  {
    type: 'group',
    label: 'Shop',
    items: [
      { label: 'Men', href: '/products?cat=Men' },
      { label: 'Women', href: '/products?cat=Women' },
      { label: 'Kids', href: '/products?cat=Kids' },
      { label: 'Fashion & Accessories', href: '/products?cat=Fashion' },
    ],
  },
  {
    type: 'group',
    label: 'Deals & New Arrivals',
    items: [
      { label: 'New Arrivals', href: '/products?filter=new' },
      { label: 'Best Sellers', href: '/products?filter=bestsellers' },
      { label: 'Deals', href: '/products?filter=deals' },
    ],
  },
  { type: 'link', label: 'About Us', href: '/about' },
  {
    type: 'group',
    label: 'Contact',
    items: [
      { label: 'Customer Support', href: '/contact' },
      { label: 'Merchant Partner', href: '/merchant' },
    ],
  },
];

export default function MobileDrawer({ open, onClose }) {
  const closeBtnRef = useRef(null);
  const { user, loading: authLoading, logout } = useAuth();

  // Root-cause fix for "navbar disappears on mobile": lock the
  // scroll on <body> (not a wrapper) so the fixed header can never
  // be carried off-screen by an underlying scroll while the drawer
  // is open, and always release the lock on unmount/close.
  useEffect(() => {
    if (open) {
      document.body.classList.add('drawer-open');
      closeBtnRef.current?.focus();
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => document.body.classList.remove('drawer-open');
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-drawer bg-ink/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-y-0 right-0 z-drawer flex w-[85vw] max-w-sm flex-col
                       bg-white shadow-2xl md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-serif text-xl text-ink">Menu</span>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full text-xl leading-none text-ink hover:bg-surface"
              >
                ×
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4">
              {NAV_GROUPS.map((entry) =>
                entry.type === 'link' ? (
                  <a
                    key={entry.href}
                    href={entry.href}
                    onClick={onClose}
                    className="block border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
                  >
                    {entry.label}
                  </a>
                ) : (
                  <div key={entry.label} className="border-b border-line py-3.5">
                    <p className="text-sm font-bold uppercase tracking-wide text-ink">{entry.label}</p>
                    <div className="mt-2 flex flex-col gap-2.5 pl-3">
                      {entry.items.map((sub) => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className="text-sm text-ink-soft hover:text-emerald"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )
              )}
            </nav>
            <div className="flex flex-col gap-2 border-t border-line px-5 py-4">
              {!authLoading && user ? (
                <>
                  <p className="py-1 text-sm font-semibold text-ink">Hey, {user.name?.split(' ')[0]}</p>
                  <a href="/orders" onClick={onClose} className="py-1.5 text-sm text-ink-soft">Order History &amp; Tracking</a>
                  <a href="/account" onClick={onClose} className="py-1.5 text-sm text-ink-soft">Update Profile</a>
                  <a href="/wishlist" onClick={onClose} className="py-1.5 text-sm text-ink-soft">Wishlist</a>
                  <button
                    onClick={() => { onClose(); logout(); }}
                    className="py-1.5 text-left text-sm font-semibold text-sale"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/wishlist" onClick={onClose} className="py-2 text-sm font-semibold text-ink">
                    Wishlist
                  </a>
                  <a href="/login" onClick={onClose} className="py-2 text-sm font-semibold text-ink">
                    Login / Sign Up
                  </a>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
