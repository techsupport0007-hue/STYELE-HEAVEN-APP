const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    uniqueCode: { type: String, required: true, unique: true, trim: true }, // e.g. SH-MEN-005
    category: { type: String, required: true, trim: true }, // e.g. "Shirts"
    mainCategory: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Kids', 'Fashion', 'Accessories'],
    },
    description: { type: String, default: '' },
    fabric: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 }, // MRP
    offerPrice: { type: Number, min: 0 }, // null/undefined = no active offer
    discountPercentage: { type: Number, min: 0, max: 90 },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    sizeGuide: { type: Map, of: String, default: undefined },
    colors: { type: [String], default: [] },
    badge: { type: String, enum: ['NEW', 'BESTSELLER', null], default: null },
    stockCount: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    isDeal: { type: Boolean, default: false }, // surfaced under the "Deals" quick filter
  },
  { timestamps: true }
);

// Keep discountPercentage consistent with price/offerPrice on save.
productSchema.pre('save', function (next) {
  if (this.offerPrice != null && this.offerPrice < this.price) {
    this.discountPercentage = Math.round((1 - this.offerPrice / this.price) * 100);
  } else {
    this.offerPrice = undefined;
    this.discountPercentage = undefined;
  }
  next();
});

productSchema.index({ mainCategory: 1 });
productSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
