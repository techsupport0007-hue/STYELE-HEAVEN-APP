const express = require('express');
const Product = require('../models/Product');
const { getProductImageUrls } = require('../utils/productImage');

// Older databases may still contain the previous local SVG placeholders.
// Normalize those records at API time so the storefront immediately receives
// real category-matched photography even before a manual reseed.
function normalizeProductImages(product) {
  const plain = product.toObject ? product.toObject() : product;
  const images = Array.isArray(plain.images) ? plain.images : [];
  const hasUsableRealImages = images.some((src) => typeof src === 'string' && /^https:\/\/images\.pexels\.com\//i.test(src));
  if (!hasUsableRealImages) {
    plain.images = getProductImageUrls({
      type: plain.category,
      category: plain.mainCategory,
      uniqueCode: plain.uniqueCode || plain._id,
    });
  }
  return plain;
}

const router = express.Router();

// GET /api/products?page=1&limit=12&category=Men&filter=deals&sort=price_asc&q=shirt
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const { category, filter, sort, q } = req.query;

    const query = {};
    if (category) query.mainCategory = category;
    if (filter === 'new') query.badge = 'NEW';
    if (filter === 'bestsellers') query.badge = 'BESTSELLER';
    if (filter === 'deals') query.isDeal = true;
    if (q && q.trim()) {
      // Case-insensitive partial match across everything a shopper might
      // type — not just an exact/whole-word $text match, which missed
      // category words like "men" that don't appear verbatim in a title.
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped, 'i');
      query.$or = [{ title: rx }, { category: rx }, { mainCategory: rx }, { description: rx }];
    }

    let sortSpec = { createdAt: -1 };
    if (sort === 'price_asc') sortSpec = { price: 1 };
    if (sort === 'price_desc') sortSpec = { price: -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      products: products.map(normalizeProductImages),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: normalizeProductImages(product) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
