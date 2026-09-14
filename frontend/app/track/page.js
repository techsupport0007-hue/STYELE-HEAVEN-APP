'use client';

import { useState } from 'react';

export default function TrackOrderPage() {
  const [id, setId] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!id.trim()) return;
    window.location.href = `/track/${id.trim().toUpperCase()}`;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Support</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Track your order</h1>
      <p className="mt-3 text-sm text-muted">
        Enter the Tracking ID from your order confirmation — it looks like SH-TRK-77210.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="SH-TRK-XXXXX"
          className="input-underline"
        />
        <button className="h-11 flex-none rounded-full bg-cta px-6 text-xs font-bold uppercase tracking-wide text-ink hover:bg-cta-deep">
          Track
        </button>
      </form>
    </div>
  );
}
