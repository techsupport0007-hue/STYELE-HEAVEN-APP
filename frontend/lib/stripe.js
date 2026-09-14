import { loadStripe } from '@stripe/stripe-js';

// loadStripe() caches internally, but keeping our own singleton avoids
// re-reading the env var / re-triggering the dynamic import on every call.
let stripePromise;

export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set — card payment cannot load. Set it in frontend/.env.local.'
      );
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
