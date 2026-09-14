'use client';

import { useState } from 'react';
import { applyPromo } from '@/lib/api';

const FREE_SHIPPING_MIN = 1999;
const SHIPPING_FEE = 100;

export default function SummaryStep({ cart, onNext, promoCodes, onPromoCodesChange }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [applying, setApplying] = useState(false);

  const mrp = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const offerTotal = cart.reduce((sum, i) => sum + (i.offerPrice ?? i.price) * i.qty, 0);
  const productDiscount = mrp - offerTotal;
  const promoDiscount = promoCodes.reduce((s, p) => s + p.discount, 0);
  const subtotal = Math.max(offerTotal - promoDiscount, 0);
  const delivery = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + delivery;

  async function handleApply() {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    if (promoCodes.some((p) => p.code === upper)) {
      setStatus('That code is already applied.');
      return;
    }
    setApplying(true);
    setStatus('');
    try {
      // Validate against the subtotal remaining after codes already
      // stacked — mirrors how the backend applies them cumulatively.
      const runningSubtotal = Math.max(offerTotal - promoDiscount, 0);
      const res = await applyPromo(upper, runningSubtotal);
      if (res.valid) {
        onPromoCodesChange([...promoCodes, { code: upper, discount: res.discount }]);
        setStatus(`"${upper}" applied — you saved ₹${res.discount}.`);
        setCode('');
      } else {
        setStatus(res.message || 'This code is not valid for your order.');
      }
    } catch (err) {
      setStatus(err?.response?.data?.error || 'Could not apply this code right now.');
    } finally {
      setApplying(false);
    }
  }

  function removeCode(codeToRemove) {
    onPromoCodesChange(promoCodes.filter((p) => p.code !== codeToRemove));
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-4 py-4">
              <div className="relative h-20 w-16 flex-none overflow-hidden rounded-lg bg-gray-100">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Size {item.size} · Qty {item.qty}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  {item.offerPrice != null && item.offerPrice < item.price && (
                    <span className="text-xs text-muted line-through">₹{item.price}</span>
                  )}
                  <span className="text-sm font-semibold text-ink">
                    ₹{(item.offerPrice ?? item.price) * item.qty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
            Promo codes — you can apply more than one
          </label>
          <div className="flex gap-2">
            <input
              className="input-underline max-w-[220px] uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button
              onClick={handleApply}
              disabled={applying}
              className="rounded-full border border-ink px-4 text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-40"
            >
              {applying ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {status && <p className="mt-2 text-xs text-muted">{status}</p>}

          {promoCodes.length > 0 && (
            <ul className="mt-3 space-y-2">
              {promoCodes.map((p) => (
                <li
                  key={p.code}
                  className="flex items-center justify-between rounded-full bg-emerald/10 px-4 py-2 text-xs font-semibold text-emerald"
                >
                  <span>{p.code} — ₹{p.discount} off</span>
                  <button onClick={() => removeCode(p.code)} className="text-sale hover:underline">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={onNext}
          className="mt-8 h-12 w-full rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep md:w-auto md:px-10"
        >
          Continue to payment →
        </button>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-6 md:sticky md:top-28">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Bag Total</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-ink"><span>MRP</span><span>₹{mrp}</span></div>
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>− ₹{productDiscount + promoDiscount}</span>
          </div>
          <div className="flex justify-between text-ink"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-ink">
            <span>Delivery</span>
            <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold text-ink">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </aside>
    </div>
  );
}
