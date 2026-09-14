const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 }, // % (0-100) or ₹ amount
    minOrderValue: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

promoSchema.methods.isValidFor = function (subtotal) {
  if (!this.isActive) return { ok: false, reason: 'This code is no longer active.' };
  if (this.expiryDate < new Date()) return { ok: false, reason: 'This code has expired.' };
  if (this.usageLimit != null && this.usedCount >= this.usageLimit)
    return { ok: false, reason: 'This code has reached its usage limit.' };
  if (subtotal < this.minOrderValue)
    return { ok: false, reason: `Minimum order value for this code is ₹${this.minOrderValue}.` };
  return { ok: true };
};

promoSchema.methods.computeDiscount = function (subtotal) {
  const raw =
    this.discountType === 'percentage' ? (subtotal * this.value) / 100 : this.value;
  return Math.min(Math.round(raw), subtotal);
};

module.exports = mongoose.model('Promo', promoSchema);
