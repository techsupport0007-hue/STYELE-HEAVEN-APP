const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      const err = new Error('Name, email and a password of at least 8 characters are required.');
      err.status = 400;
      throw err;
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.status = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash });
    res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+passwordHash');
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      throw err;
    }
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      throw err;
    }
    res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/me — update name, phone
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/me/addresses — add a saved address
router.post('/me/addresses', requireAuth, async (req, res, next) => {
  try {
    const { label, firstName, lastName, phone, street, city, state, pincode, landmark, isDefault } = req.body;
    if (!street || !city || !state || !pincode) {
      const err = new Error('Street, city, state and pincode are required.');
      err.status = 400;
      throw err;
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
    user.addresses.push({
      label, firstName, lastName, phone, street, city, state, pincode, landmark,
      isDefault: isDefault || user.addresses.length === 0,
    });
    await user.save();
    res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/me/addresses/:addressId — set as default
router.patch('/me/addresses/:addressId', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const target = user.addresses.id(req.params.addressId);
    if (!target) return res.status(404).json({ error: 'Address not found.' });
    user.addresses.forEach((a) => { a.isDefault = false; });
    target.isDefault = true;
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/auth/me/addresses/:addressId
router.delete('/me/addresses/:addressId', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.addresses.id(req.params.addressId)?.deleteOne();
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
