'use client';

import { useState } from 'react';

const METHODS = [
  {
    value: 'stripe',
    title: 'Card / UPI / Wallet — Stripe (Test Mode)',
    hint: 'Secure test payment. Use card 4242 4242 4242 4242, any future expiry & any CVC.',
  },
  {
    value: 'cod',
    title: 'Cash on Delivery',
    hint: 'Pay in cash when the order arrives.',
  },
];

export default function PaymentStep({ total, onPlaceOrder, placing }) {
  const [method, setMethod] = useState('stripe');

  return (
    <>
      <div className="space-y-4">
        {METHODS.map((m) => (
          <label
            key={m.value}
            className={`block cursor-pointer rounded-xl border p-5 transition ${
              method === m.value ? 'border-emerald bg-emerald/5' : 'border-line hover:border-ink'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value={m.value}
                checked={method === m.value}
                onChange={() => setMethod(m.value)}
                className="mt-1 accent-emerald"
              />
              <div>
                <p className="text-sm font-semibold text-ink">{m.title}</p>
                <p className="mt-1 text-xs text-muted">{m.hint}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-surface px-5 py-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">Amount payable</span>
        <span className="text-xl font-bold text-ink">₹{total}</span>
      </div>

      <button
        onClick={() => onPlaceOrder(method)}
        disabled={placing}
        className="mt-8 h-12 w-full rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40 md:w-auto md:px-10"
      >
        {placing ? 'Placing order…' : `Place order · ₹${total}`}
      </button>
    </>
  );
}
