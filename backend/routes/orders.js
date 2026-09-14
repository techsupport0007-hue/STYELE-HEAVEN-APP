const express = require('express');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Promo = require('../models/Promo');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { generateOrderId, generateTrackingId } = require('../utils/generateIds');

const router = express.Router();
const FREE_SHIPPING_MIN = 1999;
const SHIPPING_FEE = 100;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

async function uniqueId(generator, Model, field) {
  for (let i = 0; i < 5; i++) {
    const value = generator();
    // eslint-disable-next-line no-await-in-loop
    const exists = await Model.exists({ [field]: value });
    if (!exists) return value;
  }
  throw new Error('Could not generate a unique ID. Please try again.');
}

// POST /api/orders
// Body: { customer, shippingAddress, items:[{productId,size,color,qty}], promoCode, paymentMethod }
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { customer, shippingAddress, items, promoCodes, paymentMethod } = req.body;
    const requestedCodes = Array.isArray(promoCodes) ? promoCodes.filter(Boolean) : [];

    if (!Array.isArray(items) || items.length === 0) {
      const err = new Error('Your bag is empty.');
      err.status = 400;
      throw err;
    }
    if (!['stripe', 'cod'].includes(paymentMethod)) {
      const err = new Error('Select a valid payment method.');
      err.status = 400;
      throw err;
    }
    if (!shippingAddress?.street || !shippingAddress?.pincode) {
      const err = new Error('A complete shipping address is required.');
      err.status = 400;
      throw err;
    }

    // Re-price every line item from the database — never trust
    // prices sent by the client.
    const orderItems = [];
    let mrp = 0;
    let offerTotal = 0;

    for (const line of items) {
      if (!mongoose.isValidObjectId(line.productId)) {
        const err = new Error('One of the items in your bag is invalid.');
        err.status = 400;
        throw err;
      }
      // eslint-disable-next-line no-await-in-loop
      const product = await Product.findById(line.productId);
      if (!product) {
        const err = new Error(`Product ${line.productId} is no longer available.`);
        err.status = 400;
        throw err;
      }
      const qty = Math.max(1, parseInt(line.qty, 10) || 1);
      if (product.stockCount < qty) {
        const err = new Error(`Only ${product.stockCount} left in stock for "${product.title}".`);
        err.status = 409;
        throw err;
      }
      const unitPrice = product.offerPrice ?? product.price;
      mrp += product.price * qty;
      offerTotal += unitPrice * qty;

      orderItems.push({
        product: product._id,
        title: product.title,
        size: line.size,
        color: line.color,
        qty,
        price: product.price,
        offerPrice: product.offerPrice,
      });
    }

    let promoDiscount = 0;
    const appliedPromos = [];
    let runningSubtotal = offerTotal;
    for (const rawCode of requestedCodes) {
      // eslint-disable-next-line no-await-in-loop
      const promo = await Promo.findOne({ code: rawCode.toUpperCase() });
      if (!promo) continue;
      if (appliedPromos.some((p) => p.code === promo.code)) continue; // no duplicates
      const check = promo.isValidFor(runningSubtotal);
      if (!check.ok) continue;
      const discount = promo.computeDiscount(runningSubtotal);
      promoDiscount += discount;
      runningSubtotal -= discount;
      appliedPromos.push(promo);
    }

    const subtotal = Math.max(offerTotal - promoDiscount, 0);
    const delivery = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
    const total = subtotal + delivery;

    const orderId = await uniqueId(generateOrderId, Order, 'orderId');
    const trackingId = await uniqueId(generateTrackingId, Order, 'trackingId');

    const order = await Order.create({
      orderId,
      trackingId,
      user: req.user?.id || undefined,
      items: orderItems,
      shippingAddress: { ...shippingAddress, ...customer },
      pricing: { mrp, discount: mrp - subtotal, delivery, total },
      promoCodes: appliedPromos.map((p) => p.code),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'pending',
    });

    // For card payments, actually create a Stripe PaymentIntent tied to
    // this order and return its clientSecret so the frontend can collect
    // real card details via Stripe Elements. (Previously the frontend had
    // no Stripe integration at all — choosing "Stripe" silently skipped
    // payment collection entirely and still created the order.) If Stripe
    // isn't configured or the intent fails to create, roll the order back
    // rather than leave a stuck "pending" order with no way to ever pay it.
    let clientSecret = null;
    if (paymentMethod === 'stripe') {
      if (!stripe) {
        await Order.findByIdAndDelete(order._id);
        const err = new Error('Card payment is not available right now. Please try Cash on Delivery.');
        err.status = 503;
        throw err;
      }
      try {
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // paise
          currency: 'inr',
          automatic_payment_methods: { enabled: true },
          metadata: { orderId: order._id.toString(), orderCode: order.orderId },
        });
        order.stripePaymentIntentId = intent.id;
        await order.save();
        clientSecret = intent.client_secret;
      } catch (stripeErr) {
        await Order.findByIdAndDelete(order._id);
        const err = new Error('Could not start the payment. Please try again.');
        err.status = 502;
        throw err;
      }
    }

    // Decrement stock and promo usage once the order (and, for card
    // payments, its PaymentIntent) is confirmed to exist. Note: for card
    // payments this reserves stock as soon as checkout starts, before the
    // card is actually charged — acceptable for a small-scale store, but a
    // high-volume production deployment should move this to the webhook
    // handler (on payment_intent.succeeded) with a short stock hold/expiry
    // for pending PaymentIntents instead.
    await Promise.all(
      orderItems.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stockCount: -i.qty } }))
    );
    await Promise.all(
      appliedPromos.map((p) => Promo.findByIdAndUpdate(p._id, { $inc: { usedCount: 1 } }))
    );

    res.status(201).json({ order, clientSecret });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/mine — order history for the logged-in user
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get('/track/:trackingId', async (req, res, next) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId });
    if (!order) return res.status(404).json({ error: 'No order found with this tracking ID.' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
