const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ products: user?.wishlist || [] });
  } catch (err) {
    next(err);
  }
});

router.post('/:productId', requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: req.params.productId } });
    res.status(201).json({ added: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:productId', requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: req.params.productId } });
    res.json({ removed: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
