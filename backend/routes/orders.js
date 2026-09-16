const express = require('express');
const Stripe = require('stripe');

const Order = require('../models/Order');
const Product = require('../models/Product');
const Promo = require('../models/Promo');

const { requireAuth } = require('../middleware/auth');
const { generateOrderId } = require('../utils/generateIds');

const router = express.Router();


const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * Generate a unique customer-visible Order ID.
 *
 * This is the ONLY public identifier used by customers.
 * No separate Tracking ID is generated.
 */
async function uniqueOrderId() {
  for (let i = 0; i < 5; i++) {
    const orderId = generateOrderId();

    const exists = await Order.exists({ orderId });

    if (!exists) {
      return orderId;
    }
  }

  throw new Error(
    'Could not generate a unique Order ID. Please try again.'
  );
}

/**
 * Basic email validation.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Indian mobile number validation.
 */
function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Indian PIN code validation.
 */
function isValidPincode(pincode) {
  return /^\d{6}$/.test(pincode);
}

/**
 * Create Order
 *
 * Authentication is mandatory.
 * Guest checkout is not allowed.
 *
 * The authenticated user ID comes from req.user.id.
 * The frontend cannot choose another user's ID.
 *
 * IMPORTANT:
 * Product stock is intentionally NOT reduced here.
 *
 * Style Haven currently treats products as continuously
 * orderable inventory. stockCount is therefore informational
 * only and does not block checkout.
 */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      customer = {},
      shippingAddress = {},
      items,
      promoCodes,
      paymentMethod,
    } = req.body;

    /**
     * ---------------------------------------------------------
     * 1. Validate customer information
     * ---------------------------------------------------------
     */

    const fullName = String(
      customer.fullName ||
        shippingAddress.fullName ||
        `${shippingAddress.firstName || ''} ${
          shippingAddress.lastName || ''
        }`
    ).trim();

    const email = String(
      customer.email || shippingAddress.email || ''
    )
      .trim()
      .toLowerCase();

    const phone = String(
      customer.phone || shippingAddress.phone || ''
    ).trim();

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({
        error: 'Full name is required.',
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        error: 'A valid email address is required.',
      });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        error: 'A valid 10-digit mobile number is required.',
      });
    }

    /**
     * ---------------------------------------------------------
     * 2. Validate shipping address
     * ---------------------------------------------------------
     */

    const street = String(
      shippingAddress.street || ''
    ).trim();

    const city = String(
      shippingAddress.city || ''
    ).trim();

    const state = String(
      shippingAddress.state || ''
    ).trim();

    const pincode = String(
      shippingAddress.pincode || ''
    ).trim();

    const landmark = String(
      shippingAddress.landmark || ''
    ).trim();

    if (!street) {
      return res.status(400).json({
        error: 'Street address is required.',
      });
    }

    if (!city) {
      return res.status(400).json({
        error: 'City is required.',
      });
    }

    if (!state) {
      return res.status(400).json({
        error: 'State is required.',
      });
    }

    if (!isValidPincode(pincode)) {
      return res.status(400).json({
        error: 'PIN code must be exactly 6 digits.',
      });
    }

    /**
     * ---------------------------------------------------------
     * 3. Validate cart
     * ---------------------------------------------------------
     */

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Your cart is empty.',
      });
    }

    /**
     * ---------------------------------------------------------
     * 4. Validate payment method
     * ---------------------------------------------------------
     */

    if (!['stripe', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({
        error: 'Invalid payment method.',
      });
    }

    /**
     * If Stripe is selected, verify it before creating
     * a permanent order record.
     */
    if (paymentMethod === 'stripe' && !stripe) {
      return res.status(500).json({
        error: 'Stripe is not configured on the server.',
      });
    }

    /**
     * ---------------------------------------------------------
     * 5. Validate promo codes
     * ---------------------------------------------------------
     */

    const requestedCodes = Array.isArray(promoCodes)
      ? promoCodes
          .filter(Boolean)
          .map((code) => String(code).trim().toUpperCase())
      : [];

    /**
     * ---------------------------------------------------------
     * 6. Load products from database
     *
     * IMPORTANT:
     * Frontend prices are NEVER trusted.
     *
     * Product model:
     *
     * price       = MRP
     * offerPrice  = selling price
     * stockCount  = informational only
     * ---------------------------------------------------------
     */

    const productIds = items.map(
      (item) => item.productId
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((product) => [
        String(product._id),
        product,
      ])
    );

    const orderItems = [];

    let mrp = 0;
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(
        String(item.productId)
      );

      if (!product) {
        return res.status(400).json({
          error: `Product not found: ${
            item.title || item.productId
          }`,
        });
      }

      const qty = Number(item.qty);

      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({
          error: `Invalid quantity for ${product.title}.`,
        });
      }

      /**
       * Product.price is the actual MRP.
       *
       * DO NOT use product.mrp because that field does
       * not exist in the current Product model.
       */
      const productMrp = Number(product.price || 0);

      /**
       * If offerPrice exists, use it.
       * Otherwise use normal price.
       */
      const productOfferPrice = Number(
      );

      if (productMrp <= 0) {
        return res.status(400).json({
          error: `Invalid MRP for ${product.title}.`,
        });
      }

      if (
        productOfferPrice <= 0 ||
        productOfferPrice > productMrp
      ) {
        return res.status(400).json({
          error: `Invalid selling price for ${product.title}.`,
        });
      }

      mrp += productMrp * qty;
      subtotal += productOfferPrice * qty;

      orderItems.push({
        product: product._id,
        title: product.title,
        size: item.size || undefined,
        color: item.color || undefined,
        qty,
        price: productMrp,
        offerPrice: productOfferPrice,
      });
    }

    /**
     * ---------------------------------------------------------
     * 7. Apply promo codes
     * ---------------------------------------------------------
     */

    let discount = mrp - subtotal;
    const appliedPromos = [];

    for (const code of requestedCodes) {
      const promo = await Promo.findOne({
        code,
        active: true,
      });

      if (!promo) {
        continue;
      }

      let promoDiscount = 0;

      if (promo.type === 'percentage') {
        promoDiscount = Math.round(
          (subtotal * Number(promo.value || 0)) / 100
        );
      } else if (promo.type === 'flat') {
        promoDiscount = Number(
          promo.value || 0
        );
      }

      promoDiscount = Math.max(
        0,
        Math.min(promoDiscount, subtotal)
      );

      if (promoDiscount > 0) {
        subtotal -= promoDiscount;
        discount += promoDiscount;
      }

      appliedPromos.push(promo);
    }

    /**
     * ---------------------------------------------------------
     * 8. Shipping
     * ---------------------------------------------------------
     */

    const delivery = 0;

    const total = Math.max(
      0,
      subtotal + delivery
    );

    /**
     * ---------------------------------------------------------
     * 9. Generate ONE public Order ID
     *
     * Example:
     * SH-ORD-12345
     *
     * No Tracking ID.
     * ---------------------------------------------------------
     */

    const orderId = await uniqueOrderId();

    /**
     * ---------------------------------------------------------
     * 10. Create order
     * ---------------------------------------------------------
     */

    const order = await Order.create({
      orderId,

      /**
       * Always associate the order with the authenticated
       * customer.
       */
      user: req.user.id,

      items: orderItems,

      shippingAddress: {
        fullName,
        email,
        phone,
        street,
        city,
        state,
        pincode,
        landmark: landmark || undefined,
      },

      pricing: {
        mrp,
        discount,
        delivery,
        total,
      },

      promoCodes: appliedPromos.map(
        (promo) => promo.code
      ),

      paymentMethod,

      paymentStatus:
        paymentMethod === 'cod'
          ? 'cod_pending'
          : 'pending',
    });

    /**
     * ---------------------------------------------------------
     * 11. Stripe PaymentIntent
     * ---------------------------------------------------------
     */

    let clientSecret = null;

    if (paymentMethod === 'stripe') {
      const paymentIntent =
        await stripe.paymentIntents.create({
          amount: Math.round(total * 100),
          currency: 'inr',

          metadata: {
            orderId: order.orderId,
            userId: String(req.user.id),
          },

          automatic_payment_methods: {
            enabled: true,
          },
        });

      order.stripePaymentIntentId =
        paymentIntent.id;

      await order.save();

      clientSecret =
        paymentIntent.client_secret;
    }

    /**
     * ---------------------------------------------------------
     * 12. STOCK HANDLING
     * ---------------------------------------------------------
     *
     * Intentionally NO stock reduction.
     *
     * stockCount is not used to:
     *
     * - block checkout
     * - reject an order
     * - reduce inventory
     * - mark a product unavailable
     *
     * Products remain orderable regardless of stockCount.
     */

    /**
     * ---------------------------------------------------------
     * 13. Response
     * ---------------------------------------------------------
     *
     * The customer receives exactly ONE public identifier:
     *
     * orderId
     *
     * No trackingId.
     */

    return res.status(201).json({
      order,
      clientSecret,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * ---------------------------------------------------------
 * Get logged-in customer's orders
 * ---------------------------------------------------------
 */
router.get(
  '/mine',
  requireAuth,
  async (req, res, next) => {
    try {
      const orders = await Order.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

      return res.json({
        orders,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ---------------------------------------------------------
 * Track an order using ONLY the customer-visible Order ID
 * ---------------------------------------------------------
 */
router.get(
  '/track/:orderId',
  async (req, res, next) => {
    try {
      const order = await Order.findOne({
        orderId: req.params.orderId,
      });

      if (!order) {
        return res.status(404).json({
          error:
            'No order found with this Order ID.',
        });
      }

      return res.json({
        order,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
