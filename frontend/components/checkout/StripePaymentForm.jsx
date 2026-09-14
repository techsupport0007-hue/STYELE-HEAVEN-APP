'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';

/*
  StripePaymentForm — collects real card details via Stripe Elements and
  confirms the PaymentIntent created server-side for this order.

  This replaces what was previously a no-op: choosing "Stripe" at checkout
  used to just create the order with paymentStatus: 'pending' and never
  actually charge a card. Now: the order is created first (server creates
  a real PaymentIntent tied to it and returns a clientSecret), and this
  component is what actually collects card details and confirms the charge.
  The definitive "did it really get paid" signal is the backend's Stripe
  webhook (routes/webhooks.js) — this component's success callback is only
  used for immediate UI feedback.
*/
export default function StripePaymentForm({ clientSecret, onSuccess, onError }) {
  const stripe = getStripe();
  if (!clientSecret || !stripe) {
    return (
      <p className="text-sm text-sale">
        Card payment isn't available right now. Please try Cash on Delivery instead.
      </p>
    );
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <PaymentInner onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}

function PaymentInner({ onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleConfirm(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErrorMsg('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      const msg = error.message || 'Payment failed. Please check your card details and try again.';
      setErrorMsg(msg);
      onError?.(msg);
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess?.(paymentIntent);
    } else {
      // e.g. 'processing' for some payment methods — the webhook will
      // settle the order's final status shortly after.
      onSuccess?.(paymentIntent);
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
      <PaymentElement />
      {errorMsg && <p className="text-sm text-sale">{errorMsg}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="h-12 w-full rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
      >
        {submitting ? 'Confirming payment…' : 'Pay now'}
      </button>
    </form>
  );
}
