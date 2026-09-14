const express = require('express');
const Stripe = require('stripe');

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// POST /api/payments/create-intent { amount }  — amount in rupees
router.post('/create-intent', async (req, res, next) => {
  try {
    if (!stripe) {
      const err = new Error('Stripe is not configured on the server.');
      err.status = 503;
      throw err;
    }
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      const err = new Error('A valid amount is required.');
      err.status = 400;
      throw err;
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
