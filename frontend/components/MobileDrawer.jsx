'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';

const SHOP_ITEMS = [
  { label: 'Women', href: '/products?cat=Women' },
  { label: 'Men', href: '/products?cat=Men' },
  { label: 'Kids', href: '/products?cat=Kids' },
  { label: 'Footwear', href: '/products?cat=Footwear' },
  { label: 'Accessories', href: '/products?cat=Fashion' },
];

const DISCOVER_ITEMS = [
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Best Sellers', href: '/products?filter=bestsellers' },
  { label: 'Best Offers', href: '/products?filter=deals' },
];

function UserIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c.8-3.6 3-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M6 8.5h12l1 12H5l1-12Z" />
      <path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" />
    </svg>
  );
}

export default function MobileDrawer({ open, onClose }) {
  const closeBtnRef = useRef(null);
  const { user, loading: authLoading, logout } = useAuth();

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
    function onKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function closeAndGo() {
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-drawer bg-black/45 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 left-0 z-drawer flex w-[88vw] max-w-[390px] flex-col bg-white md:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 32,
            }}
          >
            {/* Header */}
            <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-line px-5">
              <a
                href="/"
                onClick={closeAndGo}
                className="font-serif text-xl tracking-wide text-ink"
              >
                STYLE HAVEN
              </a>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-2xl text-ink hover:bg-surface"
              >
                ×
              </button>
            </div>

            {/* Account area */}
            <div className="border-b border-line bg-surface px-5 py-4">
              {!authLoading && user ? (
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <UserIcon />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                      Welcome back
                    </p>

                    <p className="truncate text-sm font-semibold text-ink">
                      {user.name || 'My Account'}
                    </p>
                  </div>
                </div>
              ) : (
                <a
                  href="/login"
                  onClick={closeAndGo}
                  className="flex items-center gap-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <UserIcon />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                      Account
                    </p>

                    <p className="text-sm font-semibold text-ink">
                      Login / Sign Up
                    </p>
                  </div>
                </a>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-5 pb-6">
              {/* Shop */}
              <div className="border-b border-line py-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Shop
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {SHOP_ITEMS.map((item) => (
                    <a
                      key={item.href + item.label}
                      href={item.href}
                      onClick={closeAndGo}
                      className="py-1 text-sm font-semibold text-ink"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Discover */}
              <div className="border-b border-line py-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Discover
                </p>

                <div className="flex flex-col">
                  {DISCOVER_ITEMS.map((item) => (
                    <a
                      key={item.href + item.label}
                      href={item.href}
                      onClick={closeAndGo}
                      className="flex items-center justify-between border-b border-line/70 py-3 text-sm font-semibold text-ink last:border-0"
                    >
                      {item.label}
                      <span className="text-muted">→</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div className="border-b border-line py-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Customer
                </p>

                <div className="flex flex-col">
                  <a
                    href="/wishlist"
                    onClick={closeAndGo}
                    className="flex items-center gap-3 py-3 text-sm font-semibold text-ink"
                  >
                    <HeartIcon />
                    Wishlist
                  </a>

                  <a
                    href="/cart"
                    onClick={closeAndGo}
                    className="flex items-center gap-3 py-3 text-sm font-semibold text-ink"
                  >
                    <BagIcon />
                    Shopping Bag
                  </a>

                  {user && (
                    <>
                      <a
                        href="/orders"
                        onClick={closeAndGo}
                        className="py-3 text-sm font-semibold text-ink"
                      >
                        Orders & Tracking
                      </a>

                      <a
                        href="/account"
                        onClick={closeAndGo}
                        className="py-3 text-sm font-semibold text-ink"
                      >
                        My Account
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Help */}
              <div className="py-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Help & Information
                </p>

                <div className="flex flex-col">
                  <a
                    href="/contact"
                    onClick={closeAndGo}
                    className="py-2.5 text-sm text-ink-soft"
                  >
                    Customer Support
                  </a>

                  <a
                    href="/about"
                    onClick={closeAndGo}
                    className="py-2.5 text-sm text-ink-soft"
                  >
                    About Style Haven
                  </a>

                  <a
                    href="/shipping-returns"
                    onClick={closeAndGo}
                    className="py-2.5 text-sm text-ink-soft"
                  >
                    Shipping & Returns
                  </a>

                  <a
                    href="/merchant"
                    onClick={closeAndGo}
                    className="py-2.5 text-sm text-ink-soft"
                  >
                    Join as Merchant
                  </a>
                </div>
              </div>
            </nav>

            {/* Logout */}
            {!authLoading && user && (
              <div className="shrink-0 border-t border-line px-5 py-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="w-full rounded-full border border-line py-3 text-xs font-bold uppercase tracking-wide text-sale"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}