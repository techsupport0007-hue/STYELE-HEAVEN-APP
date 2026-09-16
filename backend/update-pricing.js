require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/Product');

const MRP_VALUES = [
  999,
  1199,
  1299,
  1499,
  1699,
  1899,
  2199,
  2499,
  2799,
  2999,
  3199,
  3499,
  3999,
  4499,
  4999
];

const DISCOUNTS = [20, 25, 30, 35, 40, 45, 50];

async function updatePricing() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB.');
    console.log('Updating existing product prices only...');

    const products = await Product.find({}).sort({ _id: 1 });

    console.log(`Found ${products.length} existing products.`);

    if (!products.length) {
      console.log('No products found. Nothing changed.');
      await mongoose.disconnect();
      return;
    }

    let updated = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const mrp = MRP_VALUES[i % MRP_VALUES.length];
      const discountPercentage = DISCOUNTS[i % DISCOUNTS.length];

      const offerPrice = Math.round(
        mrp * (1 - discountPercentage / 100)
      );

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            price: mrp,
            offerPrice: offerPrice,
            discountPercentage: discountPercentage,
            isDeal: true
          }
        }
      );

      updated++;

      console.log(
        `${updated}. ${product.title} -> MRP ₹${mrp} | ${discountPercentage}% OFF | Offer ₹${offerPrice}`
      );
    }

    console.log('');
    console.log('======================================');
    console.log('PRICING UPDATE COMPLETED');
    console.log('======================================');
    console.log(`Products updated: ${updated}`);
    console.log('No products were deleted.');
    console.log('Product IDs remain unchanged.');
    console.log('Images, stock, reviews and other data remain unchanged.');
    console.log('======================================');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Pricing update failed:', error.message);

    try {
      await mongoose.disconnect();
    } catch (_) {}

    process.exit(1);
  }
}

updatePricing();