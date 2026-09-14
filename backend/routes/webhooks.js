const express = require('express');
const Stripe = require('stripe');
const Order = require('../models/Order');

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

/*
  POST /api/webhooks/stripe

  This is the source of truth for whether a card payment actually
  succeeded — never trust the frontend's word for it. Stripe calls this
  endpoint directly (server-to-server) when a PaymentIntent's status
  changes, and we verify the request really came from Stripe using the
  signing secret before acting on it.

  IMPORTANT: this route must receive the RAW request body (not JSON-
  parsed) for signature verification to work — see server.js, where this
  route is mounted with express.raw() *before* the global express.json()
  middleware.

  Setup: in the Stripe dashboard (or `stripe listen` for local dev),
  point a webhook at POST <your-backend-url>/api/webhooks/stripe for at
  least the `payment_intent.succeeded` and `payment_intent.payment_failed`
  events, then put the signing secret it gives you into STRIPE_WEBHOOK_SECRET.
*/
router.post('/stripe', async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook received but STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET is not configured.');
    return res.status(503).send('Webhook not configured.');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw Buffer — see server.js
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          { paymentStatus: 'paid' }
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: intent.id },
          { paymentStatus: 'failed' }
        );
        break;
      }
      default:
        // Other event types are ignored — acknowledge so Stripe doesn't retry.
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Error handling Stripe webhook event:', err);
    // Still 200 here would stop Stripe retrying a transient DB error, so
    // return 500 to let Stripe retry delivery.
    res.status(500).send('Webhook handler error.');
  }
});

module.exports = router;
