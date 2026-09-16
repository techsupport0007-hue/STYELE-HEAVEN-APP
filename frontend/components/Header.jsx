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

const MOBILE_CATEGORIES = [
  { label: 'Women', href: '/products?cat=Women' },
  { label: 'Men', href: '/products?cat=Men' },
  { label: 'Kids', href: '/products?cat=Kids' },
  { label: 'Footwear', href: '/products?cat=Footwear' },
  { label: 'Accessories', href: '/products?cat=Fashion' },
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Sale', href: '/products?filter=deals' },
];

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
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
      {/* ================= DESKTOP / TABLET HEADER ================= */}
      <div className="mx-auto hidden max-w-container items-center gap-4 px-4 py-3 md:flex md:gap-8 md:px-8">
        <a href="/" className="flex flex-shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-ink text-sm font-semibold text-ink">
            SH
          </span>

          <span className="leading-tight">
            <span className="block font-serif text-xl tracking-wide text-ink">
              STYLE HAVEN
            </span>

            <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted">
              MODERN FASHION STORE
            </span>
          </span>
        </a>

        <form
          onSubmit={handleSearch}
          className="mx-auto flex max-w-md flex-1 items-stretch"
          role="search"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, styles..."
            aria-label="Search products"
            className="w-full rounded-l-full border border-line border-r-0 bg-surface px-5 text-sm placeholder:text-muted/70 focus:outline-none"
          />

          <button
            type="submit"
            aria-label="Search"
            className="grid w-12 place-items-center rounded-r-full bg-ink text-white"
          >
            <SearchIcon />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-6">
          <a
            href="/wishlist"
            aria-label="Wishlist"
            className="text-ink transition hover:text-emerald"
          >
            <HeartIcon />
          </a>

          {!authLoading && user ? (
            <AccountMenu user={user} onLogout={logout} />
          ) : (
            <a
              href="/login"
              className="flex items-center gap-2 text-sm text-ink transition hover:text-emerald"
            >
              <UserIcon />
              <span className="font-semibold">Login / Sign Up</span>
            </a>
          )}

          <a
            href="/cart"
            aria-label="My Cart"
            className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white transition hover:bg-ink-soft"
          >
            <BagIcon />

            <span className="font-semibold">Bag</span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-cta text-[11px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden">
        <div className="flex h-[58px] items-center justify-between px-4">
          {/* MENU */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center text-ink"
          >
            <span className="flex w-6 flex-col gap-[5px]">
              <span className="h-[1.5px] w-full bg-ink" />
              <span className="h-[1.5px] w-full bg-ink" />
              <span className="h-[1.5px] w-full bg-ink" />
            </span>
          </button>

          {/* LOGO */}
          <a
            href="/"
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="font-serif text-[19px] tracking-[0.08em] text-ink">
              STYLE HAVEN
            </span>
          </a>

          {/* ACTIONS */}
          <div className="flex items-center gap-1">
            <a
              href="/login"
              aria-label={user ? 'My Account' : 'Login / Sign Up'}
              className="grid h-10 w-9 place-items-center text-ink"
            >
              <UserIcon />
            </a>

            <a
              href="/wishlist"
              aria-label="Wishlist"
              className="grid h-10 w-9 place-items-center text-ink"
            >
              <HeartIcon />
            </a>

            <a
              href="/cart"
              aria-label="Shopping bag"
              className="relative grid h-10 w-9 place-items-center text-ink"
            >
              <BagIcon />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-cta px-1 text-[9px] font-bold text-ink">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3">
          <form
            onSubmit={handleSearch}
            role="search"
            className="flex h-10 overflow-hidden rounded-full border border-line bg-surface"
          >
            <div className="grid w-10 shrink-0 place-items-center text-muted">
              <SearchIcon />
            </div>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent pr-3 text-xs text-ink placeholder:text-muted focus:outline-none"
            />
          </form>
        </div>

        {/* MOBILE CATEGORY STRIP */}
        <div className="border-t border-line">
          <div className="flex gap-6 overflow-x-auto px-4 py-3 scrollbar-hide">
            {MOBILE_CATEGORIES.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] text-ink"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}
      <nav className="hidden border-t border-line md:block">
        <div className="mx-auto flex max-w-container items-center justify-center gap-10 px-8 py-3">
          <a
            href="/"
            className="text-[13px] font-semibold tracking-wide text-ink hover:text-emerald"
          >
            Home
          </a>

          <NavDropdown label="Shop" items={SHOP_ITEMS} />

          <NavDropdown
            label="Deals & New Arrivals"
            items={DEALS_ITEMS}
            wide
          />

          <a
            href="/about"
            className="text-[13px] font-semibold tracking-wide text-ink hover:text-emerald"
          >
            About Us
          </a>

          <NavDropdown
            label="Contact"
            items={CONTACT_ITEMS}
            wide
          />
        </div>
      </nav>

      {/* PROMOTIONAL TICKER */}
      <Ticker />

      {/* MOBILE DRAWER */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </header>
  );
}