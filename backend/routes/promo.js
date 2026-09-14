const express = require('express');
const Promo = require('../models/Promo');

const router = express.Router();

// POST /api/promo/apply { code, subtotal }
router.post('/apply', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || typeof subtotal !== 'number') {
      const err = new Error('A promo code and order subtotal are required.');
      err.status = 400;
      throw err;
    }

    const promo = await Promo.findOne({ code: code.toUpperCase() });
    if (!promo) {
      return res.json({ valid: false, discount: 0, message: 'This code does not exist.' });
    }

    const check = promo.isValidFor(subtotal);
    if (!check.ok) {
      return res.json({ valid: false, discount: 0, message: check.reason });
    }

    const discount = promo.computeDiscount(subtotal);
    res.json({ valid: true, discount, message: `Code applied — ₹${discount} off.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
