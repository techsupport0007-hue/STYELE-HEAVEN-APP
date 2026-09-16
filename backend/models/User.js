const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    firstName: String,
    lastName: String,
    phone: { type: String, match: /^[6-9]\d{9}$/ },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true, match: /^\d{6}$/ },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      match: /^[6-9]\d{9}$/,
    },

    // Secure password reset token hash.
    // The actual reset token is never stored in the database.
    passwordResetTokenHash: {
      type: String,
      select: false,
    },

    // Password reset token expiry time.
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    addresses: [addressSchema],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    role: {
      type: String,
      enum: ['customer', 'merchant', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);