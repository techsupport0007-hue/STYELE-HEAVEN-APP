'use client';

import { useState } from 'react';
import { applyPromo } from '@/lib/api';


export default function OrderSummarySidebar({ cart, promoCodes, onPromoCodesChange, onPlaceOrder, placing, canPlaceOrder, paymentMethod }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [applying, setApplying] = useState(false);

  const mrp = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const offerTotal = cart.reduce((sum, i) => sum + (i.offerPrice ?? i.price) * i.qty, 0);
  const productDiscount = mrp - offerTotal;
  const promoDiscount = promoCodes.reduce((s, p) => s + p.discount, 0);
  const subtotal = Math.max(offerTotal - promoDiscount, 0);
  const delivery = 0;
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
    <aside className="h-fit rounded-2xl border border-line bg-white p-5 md:sticky md:top-28">
      <h2 className="text-sm font-bold uppercase tracking-widest text-ink">Order Summary</h2>

      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.key} className="flex gap-3">
            <div className="relative h-16 w-13 flex-none overflow-hidden rounded-lg bg-gray-100" style={{ width: 52 }}>
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="line-clamp-1 text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted">Size {item.size} · Qty {item.qty}</p>
            </div>
            <span className="text-sm font-semibold text-ink">₹{(item.offerPrice ?? item.price) * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Promo code</label>
        <div className="flex gap-2">
          <input
            className="input-underline uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
          />
          <button
            onClick={handleApply}
            disabled={applying}
            className="rounded-full border border-ink px-3 text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-40"
          >
            {applying ? '…' : 'Apply'}
          </button>
        </div>
        {status && <p className="mt-1.5 text-[11px] text-muted">{status}</p>}
        {promoCodes.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {promoCodes.map((p) => (
              <li key={p.code} className="flex items-center justify-between rounded-full bg-emerald/10 px-3 py-1.5 text-[11px] font-semibold text-emerald">
                <span>{p.code} — ₹{p.discount} off</span>
                <button onClick={() => removeCode(p.code)} className="text-sale hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between text-ink"><span>Product Total</span><span>₹{mrp}</span></div>
        <div className="flex justify-between text-success"><span>Discount</span><span>− ₹{productDiscount + promoDiscount}</span></div>
        <div className="flex justify-between text-ink"><span>Shipping Fee</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
      </div>
      <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
        <span>Order Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={() => onPlaceOrder(total)}
        disabled={!canPlaceOrder || placing}
        className="mt-6 h-12 w-full rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
      >
        {placing ? 'Placing order…' : paymentMethod === 'stripe' ? 'Continue to payment' : 'Place order (Cash on Delivery)'}
      </button>
      {!canPlaceOrder && (
        <p className="mt-2 text-center text-[11px] text-muted">
          Fill in your contact details, select an address and payment method first.
        </p>
      )}
    </aside>
  );
}
