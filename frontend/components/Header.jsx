'use client';

import { useState } from 'react';
import Ticker from './Ticker';
import MobileDrawer from './MobileDrawer';
import NavDropdown from './NavDropdown';
import { useCartCount } from '@/lib/useCartCount';
import { useAuth } from '@/lib/useAuth';
import AccountMenu from './AccountMenu';

const SHOP_ITEMS = [
  { label: 'Men', href: '/products?cat=Men' },
  { label: 'Women', href: '/products?cat=Women' },
  { label: 'Kids', href: '/products?cat=Kids' },
  { label: 'Fashion & Accessories', href: '/products?cat=Fashion' },
];

const DEALS_ITEMS = [
  { label: 'New Arrivals', href: '/products?filter=new', hint: 'Just landed this week' },
  { label: 'Best Sellers', href: '/products?filter=bestsellers', hint: 'Most loved right now' },
  { label: 'Deals', href: '/products?filter=deals', hint: 'Up to 40% off' },
];

const CONTACT_ITEMS = [
  { label: 'Customer Support', href: '/contact', hint: 'Orders, delivery, returns' },
  { label: 'Merchant Partner', href: '/merchant', hint: 'Sourcing & business enquiry' },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const cartCount = useCartCount();
  const { user, loading: authLoading, logout } = useAuth();

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/products?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <header className="sticky top-0 z-nav w-full border-b border-line bg-white">
      {/* Top row: branding, search, action icons */}
      <div className="mx-auto flex max-w-container items-center gap-4 px-4 py-3 md:gap-8 md:px-8">
        <a href="/" className="flex flex-shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-ink text-sm font-semibold text-ink">
            SH
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-serif text-xl tracking-wide text-ink">STYLE HEAVEN</span>
            <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted">
              MODERN FASHION STORE
            </span>
          </span>
        </a>

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden max-w-md flex-1 items-stretch md:flex"
          role="search"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, categories, styles..."
            aria-label="Search products"
            className="w-full rounded-l-full border border-line border-r-0 bg-surface px-5 text-sm placeholder:text-muted/70 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="grid w-12 place-items-center rounded-r-full bg-ink text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </form>

        <div className="ml-auto hidden items-center gap-6 md:flex">
          <a href="/wishlist" aria-label="Wishlist" className="text-lg text-ink hover:text-emerald">
            ♡
          </a>
          {!authLoading && user ? (
            <AccountMenu user={user} onLogout={logout} />
          ) : (
            <a href="/login" className="flex items-center gap-2 text-sm text-ink hover:text-emerald">
              <span aria-hidden="true">👤</span>
              <span className="font-semibold">Login / Sign Up</span>
            </a>
          )}
          <a href="/cart" aria-label="My Cart" className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white hover:bg-ink-soft">
            <span aria-hidden="true">🛍️</span>
            <span className="font-semibold">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-cta text-[11px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-3 md:hidden">
          <a href="/cart" aria-label="My Cart" className="relative text-xl text-ink">
            🛍️
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-cta text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </a>
          <button
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
          </button>
        </div>
      </div>

      {/* Consolidated 5-link nav — desktop/tablet only; mobile uses the drawer */}
      <nav className="hidden border-t border-line md:block">
        <div className="mx-auto flex max-w-container items-center justify-center gap-10 px-8 py-3">
          <a href="/" className="text-[13px] font-semibold tracking-wide text-ink hover:text-emerald">
            Home
          </a>
          <NavDropdown label="Shop" items={SHOP_ITEMS} />
          <NavDropdown label="Deals & New Arrivals" items={DEALS_ITEMS} wide />
          <a href="/about" className="text-[13px] font-semibold tracking-wide text-ink hover:text-emerald">
            About Us
          </a>
          <NavDropdown label="Contact" items={CONTACT_ITEMS} wide />
        </div>
      </nav>

      <Ticker />

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
