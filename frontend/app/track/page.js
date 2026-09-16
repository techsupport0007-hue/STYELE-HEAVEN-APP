'use client';

import { useState } from 'react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const value = orderId.trim().toUpperCase();

    if (!value) return;

    window.location.href = `/track/${value}`;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">
        Support
      </p>

      <h1 className="mt-2 font-serif text-4xl text-ink">
        Track your order
      </h1>

      <p className="mt-3 text-sm text-muted">
        Enter the Order ID from your order confirmation.
        Your Order ID looks like SH-ORD-XXXXX.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex gap-2"
      >
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="SH-ORD-XXXXX"
          className="input-underline"
          aria-label="Order ID"
        />

        <button
          type="submit"
          className="h-11 flex-none rounded-full bg-cta px-6 text-xs font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
        >
          Track
        </button>
      </form>
    </div>
  );
}