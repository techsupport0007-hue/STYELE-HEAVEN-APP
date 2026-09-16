const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    size: String,

    color: String,

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    offerPrice: {
      type: Number,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    // Customer's complete name used for delivery.
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    // Kept for compatibility with existing saved addresses.
    firstName: String,

    lastName: String,

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },

    street: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{6}$/,
    },

    // Optional field.
    landmark: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    /**
     * Customer-visible unique Order ID.
     *
     * This is the ONLY public ID used by customers
     * for order history and tracking.
     */
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /**
     * Every order must belong to an authenticated customer.
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    /**
     * Products purchased in this order.
     */
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (value) =>
          Array.isArray(value) && value.length > 0,
        message: 'Order must contain at least one item.',
      },
    },

    /**
     * Delivery/customer address.
     */
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    /**
     * Order pricing calculated by backend.
     */
    pricing: {
      mrp: {
        type: Number,
        required: true,
      },

      discount: {
        type: Number,
        required: true,
        default: 0,
      },

      delivery: {
        type: Number,
        required: true,
        default: 0,
      },

      total: {
        type: Number,
        required: true,
      },
    },

    /**
     * Promo codes actually accepted by backend.
     */
    promoCodes: {
      type: [String],
      default: [],
    },

    /**
     * Payment method selected during checkout.
     */
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      required: true,
    },

    /**
     * Payment state.
     */
    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'paid',
        'failed',
        'cod_pending',
      ],
      default: 'pending',
    },

    /**
     * Customer-facing order progress.
     */
    orderStatus: {
      type: String,
      enum: [
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'Processing',
    },

    /**
     * Stripe PaymentIntent reference.
     * Internal only — never shown as Order ID.
     */
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);