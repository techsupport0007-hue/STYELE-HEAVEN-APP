'use client';

import { useRef, useState } from 'react';

export default function NavDropdown({ label, items, wide }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  function show() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold tracking-wide text-ink hover:text-emerald"
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute left-1/2 top-full z-nav -translate-x-1/2 pt-3 ${wide ? 'w-64' : 'w-52'}`}
        >
          <div className="rounded-lg border border-line bg-white py-2 shadow-lg">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-emerald"
              >
                {item.label}
                {item.hint && <span className="ml-1.5 block text-xs text-muted">{item.hint}</span>}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
