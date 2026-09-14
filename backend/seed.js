require('dotenv').config();
const validateEnv = require('./config/validateEnv');
validateEnv();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Promo = require('./models/Promo');
const { getProductImageUrls } = require('./utils/productImage');

const SIZES_APPAREL = ['S', 'M', 'L', 'XL'];
const SIZE_GUIDE_APPAREL = { S: 'Chest 36-38 in', M: 'Chest 39-41 in', L: 'Chest 42-44 in', XL: 'Chest 45-47 in' };

const products = [
  {
    title: 'Linen-Blend Casual Shirt',
    uniqueCode: 'SH-MEN-005',
    category: 'Shirts',
    mainCategory: 'Men',
    description: 'A breathable linen-cotton blend shirt built for warm-weather everyday wear.',
    fabric: '55% Linen, 45% Cotton',
    price: 1699,
    offerPrice: 1279,
    images: [], // filled in by generateImages() below
    sizes: SIZES_APPAREL,
    sizeGuide: SIZE_GUIDE_APPAREL,
    colors: ['SteelBlue', 'White'],
    badge: 'NEW',
    stockCount: 24,
    rating: 4.3,
    reviewCount: 58,
  },
  {
    title: 'Charcoal Checkered Flannel Coat',
    uniqueCode: 'SH-MEN-008',
    category: 'Shirts',
    mainCategory: 'Men',
    description: 'A heavyweight checkered overcoat for layering through winter.',
    fabric: '80% Wool, 20% Nylon',
    price: 2799,
    offerPrice: 2379,
    images: [], // filled in by generateImages() below
    sizes: SIZES_APPAREL,
    sizeGuide: SIZE_GUIDE_APPAREL,
    colors: ['Grey'],
    badge: 'BESTSELLER',
    stockCount: 12,
    rating: 4.6,
    reviewCount: 121,
    isDeal: true,
  },
  {
    title: 'Rust Printed Resort Shirt',
    uniqueCode: 'SH-MEN-012',
    category: 'Shirts',
    mainCategory: 'Men',
    description: 'Relaxed-fit resort shirt in a warm rust print, made for travel days.',
    fabric: '100% Rayon',
    price: 1899,
    offerPrice: 1519,
    images: [], // filled in by generateImages() below
    sizes: SIZES_APPAREL,
    sizeGuide: SIZE_GUIDE_APPAREL,
    colors: ['Rust'],
    badge: 'NEW',
    stockCount: 30,
    rating: 4.1,
    reviewCount: 34,
  },
  {
    title: 'Olive Formal White Poplin Shirt',
    uniqueCode: 'SH-MEN-014',
    category: 'Shirts',
    mainCategory: 'Men',
    description: 'Crisp poplin formal shirt with a tailored, structured collar.',
    fabric: '100% Cotton Poplin',
    price: 1299,
    offerPrice: 979,
    images: [], // filled in by generateImages() below
    sizes: SIZES_APPAREL,
    sizeGuide: SIZE_GUIDE_APPAREL,
    colors: ['White'],
    badge: 'BESTSELLER',
    stockCount: 40,
    rating: 4.4,
    reviewCount: 76,
    isDeal: true,
  },
  {
    title: 'Denim Utility Shirt',
    uniqueCode: 'SH-MEN-015',
    category: 'Shirts',
    mainCategory: 'Men',
    description: 'A sturdy denim shirt with utility pockets, built to be worn open or buttoned.',
    fabric: '100% Cotton Denim',
    price: 3199,
    offerPrice: 2559,
    images: [], // filled in by generateImages() below
    sizes: SIZES_APPAREL,
    sizeGuide: SIZE_GUIDE_APPAREL,
    colors: ['IndigoBlue'],
    badge: 'BESTSELLER',
    stockCount: 18,
    rating: 4.5,
    reviewCount: 92,
  },
  {
    title: 'Charcoal Denim Utility Shirt',
    uniqueCode: 'SH-MEN-016',
    category: 'Shirts',
    mainCategory: 'Men',
    description: 'The charcoal edit of our utility shirt — same fit, deeper tone.',
    fabric: '100% Cotton Denim',
    price: 2799,
    offerPrice: 2099,
    images: [], // filled in by generateImages() below
    sizes: SIZES_APPAREL,
    sizeGuide: SIZE_GUIDE_APPAREL,
    colors: ['Charcoal'],
    badge: 'NEW',
    stockCount: 22,
    rating: 4.2,
    reviewCount: 41,
  },
  {
    title: 'Floral Wrap Midi Dress',
    uniqueCode: 'SH-WMN-021',
    category: 'Dresses',
    mainCategory: 'Women',
    description: 'A flowing wrap midi dress in a hand-drawn floral print.',
    fabric: '100% Rayon Crepe',
    price: 2499,
    offerPrice: 1874,
    images: [], // filled in by generateImages() below
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral'],
    badge: 'BESTSELLER',
    stockCount: 16,
    rating: 4.7,
    reviewCount: 143,
    isDeal: true,
  },
  {
    title: 'Structured Blazer Co-ord',
    uniqueCode: 'SH-WMN-026',
    category: 'Co-ords',
    mainCategory: 'Women',
    description: 'A tailored blazer and trouser co-ord set for work-to-evening dressing.',
    fabric: '65% Polyester, 35% Viscose',
    price: 3499,
    images: [], // filled in by generateImages() below
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige'],
    badge: 'NEW',
    stockCount: 10,
    rating: 4.0,
    reviewCount: 12,
  },
  {
    title: 'Kids Weekend Co-ord Set',
    uniqueCode: 'SH-KID-031',
    category: 'Co-ords',
    mainCategory: 'Kids',
    description: 'Soft cotton co-ord for weekend play — machine washable and colourfast.',
    fabric: '100% Cotton',
    price: 1299,
    offerPrice: 974,
    images: [], // filled in by generateImages() below
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['SkyBlue'],
    badge: 'BESTSELLER',
    stockCount: 28,
    rating: 4.5,
    reviewCount: 39,
    isDeal: true,
  },
  {
    title: 'Flyknit Performance Sneakers',
    uniqueCode: 'SH-ACC-045',
    category: 'Footwear',
    mainCategory: 'Accessories',
    description: 'Lightweight knit sneakers with responsive cushioning for all-day wear.',
    fabric: 'Flyknit Textile Upper',
    price: 1999,
    offerPrice: 1199,
    images: [], // filled in by generateImages() below
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Red'],
    badge: 'BESTSELLER',
    stockCount: 15,
    rating: 4.1,
    reviewCount: 428,
    isDeal: true,
  },
];

// The 10 products above are hand-curated. Every product's images — these
// and the generated ones below — are assigned by generateImages() right
// before insert, using real category-matched photos (see productImage.js).
const CATEGORY_PLAN = [
  { main: 'Men', prefix: 'SH-MEN', types: ['Shirt', 'T-Shirt', 'Jacket', 'Trousers', 'Sweatshirt', 'Kurta', 'Shorts', 'Blazer'] },
  { main: 'Women', prefix: 'SH-WMN', types: ['Dress', 'Top', 'Kurti', 'Saree', 'Palazzo', 'Jumpsuit', 'Skirt', 'Cardigan'] },
  { main: 'Kids', prefix: 'SH-KID', types: ['Co-ord Set', 'T-Shirt', 'Dungaree', 'Frock', 'Shorts Set', 'Jacket'] },
  { main: 'Fashion', prefix: 'SH-FSH', types: ['Tote Bag', 'Belt', 'Scarf', 'Sunglasses', 'Watch', 'Wallet', 'Cap'] },
  { main: 'Accessories', prefix: 'SH-ACC', types: ['Sneakers', 'Loafers', 'Sandals', 'Backpack', 'Necklace', 'Earrings'] },
];

const ADJECTIVES = ['Classic', 'Modern', 'Relaxed', 'Slim-Fit', 'Everyday', 'Weekend', 'Studio', 'Heritage', 'Urban', 'Essential'];
const COLORS = ['Navy', 'Charcoal', 'Olive', 'Ivory', 'Rust', 'Sand', 'SteelBlue', 'Maroon', 'Forest', 'Blush'];
const FABRICS = ['100% Cotton', '100% Linen', 'Cotton-Poly Blend', '100% Rayon', 'Cotton Twill', 'Poly-Viscose Blend'];

let seedCounter = 100;
function nextCode(prefix) {
  seedCounter += 1;
  return `${prefix}-${String(seedCounter).padStart(3, '0')}`;
}

function buildGeneratedProducts(perCategory = 40) {
  const generated = [];
  CATEGORY_PLAN.forEach((cat) => {
    for (let i = 0; i < perCategory; i++) {
      const adjective = ADJECTIVES[i % ADJECTIVES.length];
      const type = cat.types[i % cat.types.length];
      const color = COLORS[i % COLORS.length];
      const basePrice = 799 + ((i * 137) % 4200);
      const hasOffer = i % 3 !== 0; // ~2/3 of products carry an offer price
      const offerPrice = hasOffer ? Math.round(basePrice * (0.6 + ((i % 4) * 0.08))) : undefined;
      const isNew = i % 5 === 0;
      const isBestseller = !isNew && i % 4 === 0;

      generated.push({
        title: `${adjective} ${color} ${type}`,
        uniqueCode: nextCode(cat.prefix),
        category: type,
        mainCategory: cat.main,
        description: `A ${adjective.toLowerCase()} ${type.toLowerCase()} in ${color.toLowerCase()}, made for everyday wear with a focus on fit and finish.`,
        fabric: FABRICS[i % FABRICS.length],
        price: basePrice,
        offerPrice,
        images: [], // filled in by generateImages() below
        sizes: cat.main === 'Kids' ? ['2-3Y', '4-5Y', '6-7Y', '8-9Y'] : cat.main === 'Fashion' ? [] : SIZES_APPAREL,
        sizeGuide: cat.main === 'Men' || cat.main === 'Women' ? SIZE_GUIDE_APPAREL : undefined,
        colors: [color],
        badge: isNew ? 'NEW' : isBestseller ? 'BESTSELLER' : null,
        stockCount: 5 + (i % 40),
        rating: Math.round((3.6 + ((i % 14) * 0.1)) * 10) / 10,
        reviewCount: 5 + (i * 3) % 400,
        isDeal: hasOffer && i % 6 === 0,
      });
    }
  });
  return generated;
}

const allProducts = [...products, ...buildGeneratedProducts(40)];

// Assigns two real, category-matched Pexels photo URLs per product. The
// selection is deterministic, so reseeding does not randomly change a product's
// photography unless the mapping itself is intentionally updated.
function generateImages(list) {
  list.forEach((p) => {
    p.images = getProductImageUrls({
      type: p.category,
      category: p.mainCategory,
      uniqueCode: p.uniqueCode,
    });
  });
}

async function seed() {
  generateImages(allProducts);
  console.log(`Assigned real Pexels product photos to ${allProducts.length} products.`);

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding…');

  await Product.deleteMany({});
  await Product.insertMany(allProducts);
  console.log(`Inserted ${allProducts.length} products.`);

  await Promo.deleteMany({});
  await Promo.create([
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      value: 10,
      minOrderValue: 999,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
    {
      code: 'FLAT200',
      discountType: 'fixed',
      value: 200,
      minOrderValue: 1999,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
  ]);
  console.log('Inserted 2 promo codes: WELCOME10, FLAT200');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
