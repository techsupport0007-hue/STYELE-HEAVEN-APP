'use client';

import { useEffect, useState } from 'react';
import { trackOrder } from '@/lib/api';

const STATUS_STEPS = ['Processing', 'Shipped', 'Delivered'];

export default function TrackOrderResultPage({ params }) {
  const { trackingId } = params;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    trackOrder(trackingId)
      .then(setOrder)
      .catch((err) => setError(err?.response?.data?.error || 'No order found with this tracking ID.'));
  }, [trackingId]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center md:px-8">
        <h1 className="font-serif text-2xl text-ink">{error}</h1>
        <a href="/track" className="mt-4 inline-block text-sm font-semibold text-emerald underline">
          Try another tracking ID
        </a>
      </div>
    );
  }

  if (!order) {
    return <div className="mx-auto max-w-md px-4 py-20 text-center text-muted">Looking up your order…</div>;
  }

  const currentStep = order.orderStatus === 'Cancelled'
    ? -1
    : STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Tracking</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">{order.trackingId}</h1>
      <p className="mt-1 text-sm text-muted">Order {order.orderId}</p>

      {order.orderStatus === 'Cancelled' ? (
        <p className="mt-8 text-sm font-semibold text-sale">This order was cancelled.</p>
      ) : (
        <div className="mt-10 flex items-center">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold ${
                    i <= currentStep ? 'border-emerald bg-emerald text-white' : 'border-line text-muted'
                  }`}
                >
                  {i <= currentStep ? '✓' : i + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${i <= currentStep ? 'text-ink' : 'text-muted'}`}>
                  {step}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${i < currentStep ? 'bg-emerald' : 'bg-line'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-2 rounded-2xl border border-line p-6 text-sm">
        <div className="flex justify-between"><span className="text-muted">Payment method</span><span className="font-semibold text-ink">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card / UPI / Wallet'}</span></div>
        <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-semibold text-ink">₹{order.pricing?.total}</span></div>
        <div className="flex justify-between"><span className="text-muted">Delivering to</span><span className="font-semibold text-ink">{order.shippingAddress?.city}, {order.shippingAddress?.state}</span></div>
      </div>
    </div>
  );
}
