'use client';

import { useState } from 'react';

const FAQS = [
  { q: 'How do I track my order?', a: 'Use your Tracking ID on the Track Order page, sent to you on the order confirmation screen and by email.' },
  { q: 'What payment methods are supported?', a: 'Card, UPI and wallets via Stripe (test mode in this build), plus Cash on Delivery.' },
  { q: 'Can I return or exchange an item?', a: 'Yes — most items can be returned within 7 days of delivery. See our Shipping & Returns page for details.' },
  { q: 'How do I apply a promo code?', a: 'Enter it during Step 3 (Promo Code & Review) at checkout. You can apply more than one valid code.' },
  { q: 'I want to sell on Style Heaven as a business — where do I start?', a: 'Head to the Merchant Partner page from the Contact menu and submit an enquiry with your business and GSTIN details.' },
  { q: 'Is Cash on Delivery available everywhere?', a: 'COD availability depends on your delivery pincode — check on the product page before ordering.' },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Support</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Frequently Asked Questions</h1>

      <div className="mt-10 divide-y divide-line rounded-2xl border border-line">
        {FAQS.map((item, i) => (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              aria-expanded={openIndex === i}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-ink"
            >
              {item.q}
              <span className="ml-4 text-lg text-emerald">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
