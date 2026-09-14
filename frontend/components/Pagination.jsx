'use client';

import { useState } from 'react';

function pageList(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

export default function Pagination({ page, pages, onChange }) {
  const [jump, setJump] = useState('');
  if (pages <= 1) return null;
  const list = pageList(page, pages);

  function handleJump(e) {
    e.preventDefault();
    const n = parseInt(jump, 10);
    if (n >= 1 && n <= pages) onChange(n);
    setJump('');
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-sm text-ink disabled:opacity-30"
        >
          ‹
        </button>

        {list.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            {i > 0 && p - list[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
            <button
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold ${
                p === page ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:bg-surface'
              }`}
            >
              {p}
            </button>
          </span>
        ))}

        <button
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-sm text-ink disabled:opacity-30"
        >
          ›
        </button>
      </nav>

      {pages > 8 && (
        <form onSubmit={handleJump} className="flex items-center gap-2 text-xs text-muted">
          <span>Jump to page</span>
          <input
            type="number"
            min={1}
            max={pages}
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            className="h-8 w-16 rounded border border-line px-2 text-center text-ink focus:outline-none focus:ring-1 focus:ring-emerald"
          />
          <span>of {pages}</span>
          <button type="submit" className="font-semibold text-emerald underline">Go</button>
        </form>
      )}
    </div>
  );
}
