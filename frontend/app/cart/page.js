'use client';

import { useEffect, useState } from 'react';
import { readCart, writeCart } from '@/lib/useCartCount';


export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setLoaded(true);
  }, []);

  function update(next) {
    setCart(next);
    writeCart(next);
  }

  function setQty(key, qty) {
    if (qty < 1) return;
    update(cart.map((i) => (i.key === key ? { ...i, qty } : i)));
  }

  function remove(key) {
    update(cart.filter((i) => i.key !== key));
  }

  const mrp = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const offerTotal = cart.reduce((s, i) => s + (i.offerPrice ?? i.price) * i.qty, 0);
  const discount = mrp - offerTotal;
  const delivery = 0;
  const total = offerTotal + delivery;

  if (!loaded) return null;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-container px-4 py-20 text-center md:px-8">
        <h1 className="font-serif text-3xl">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted">Add something you like from the collection.</p>
        <a
          href="/products"
          className="mt-6 inline-block h-12 leading-[48px] rounded-full px-8 bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
        >
          Shop the collection
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-4 py-10 md:px-8">
      <h1 className="mb-8 font-serif text-3xl">Your Bag</h1>

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-4 py-5">
              <div className="h-24 w-20 flex-none overflow-hidden bg-gray-100">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Size {item.size} {item.color ? `· ${item.color}` : ''}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-24 items-center justify-between border border-line">
                    <button
                      onClick={() => setQty(item.key, item.qty - 1)}
                      className="h-full flex-1"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.key, item.qty + 1)}
                      className="h-full flex-1"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {item.offerPrice != null && item.offerPrice < item.price && (
                      <span className="text-xs text-muted line-through">₹{item.price}</span>
                    )}
                    <span className="text-sm font-bold">
                      ₹{(item.offerPrice ?? item.price) * item.qty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove(item.key)}
                aria-label="Remove item"
                className="self-start text-xs font-semibold text-sale underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-line p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Bag Total</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>MRP</span><span>₹{mrp}</span></div>
            <div className="flex justify-between text-success">
              <span>Discount</span><span>− ₹{discount}</span>
            </div>
            <div className="flex justify-between"><span>Subtotal</span><span>₹{offerTotal}</span></div>
            <div className="flex justify-between">
              <span>Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold">
            <span>Total</span><span>₹{total}</span>
          </div>
          <a
            href="/checkout"
            className="mt-6 block h-12 text-center leading-[48px] rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
          >
            Checkout →
          </a>
        </aside>
      </div>
    </div>
  );
}
