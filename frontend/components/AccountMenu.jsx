'use client';

import { useRef, useState } from 'react';

export default function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const firstName = user.name?.split(' ')[0] || 'there';

  function show() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-ink hover:text-emerald"
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-bold text-white"
        >
          {firstName[0]?.toUpperCase()}
        </span>
        <span className="font-semibold">Hey, {firstName}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-nav w-56 pt-3">
          <div className="rounded-lg border border-line bg-white py-2 shadow-lg">
            <a href="/orders" className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-emerald">
              Order History &amp; Tracking
            </a>
            <a href="/account" className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-emerald">
              Update Profile
            </a>
            <a href="/account#addresses" className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-emerald">
              Saved Addresses
            </a>
            <a href="/wishlist" className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-emerald">
              Wishlist
            </a>
            <button
              onClick={onLogout}
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-sale hover:bg-surface"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
