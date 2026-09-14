const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    size: String,
    color: String,
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // MRP at time of order
    offerPrice: { type: Number }, // price actually charged, per unit
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // e.g. SH-ORD-98412
    trackingId: { type: String, required: true, unique: true }, // e.g. SH-TRK-77210
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: guest checkout allowed
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    pricing: {
      mrp: { type: Number, required: true },
      discount: { type: Number, required: true, default: 0 },
      delivery: { type: Number, required: true, default: 0 },
      total: { type: Number, required: true },
    },
    promoCodes: { type: [String], default: [] },
    paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cod_pending'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
