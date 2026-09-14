const { getProductImageUrls } = require('../utils/productImage');

// Import all products definition from seed logic
const SIZES_APPAREL = ['S', 'M', 'L', 'XL'];
const SIZE_GUIDE_APPAREL = { S: 'Chest 36-38 in', M: 'Chest 39-41 in', L: 'Chest 42-44 in', XL: 'Chest 45-47 in' };

const products = [
  { title: 'Linen-Blend Casual Shirt', uniqueCode: 'SH-MEN-005', category: 'Shirts', mainCategory: 'Men' },
  { title: 'Charcoal Checkered Flannel Coat', uniqueCode: 'SH-MEN-008', category: 'Shirts', mainCategory: 'Men' },
  { title: 'Rust Printed Resort Shirt', uniqueCode: 'SH-MEN-012', category: 'Shirts', mainCategory: 'Men' },
  { title: 'Olive Formal White Poplin Shirt', uniqueCode: 'SH-MEN-014', category: 'Shirts', mainCategory: 'Men' },
  { title: 'Denim Utility Shirt', uniqueCode: 'SH-MEN-015', category: 'Shirts', mainCategory: 'Men' },
  { title: 'Charcoal Denim Utility Shirt', uniqueCode: 'SH-MEN-016', category: 'Shirts', mainCategory: 'Men' },
  { title: 'Floral Wrap Midi Dress', uniqueCode: 'SH-WMN-021', category: 'Dresses', mainCategory: 'Women' },
  { title: 'Structured Blazer Co-ord', uniqueCode: 'SH-WMN-026', category: 'Co-ords', mainCategory: 'Women' },
  { title: 'Kids Weekend Co-ord Set', uniqueCode: 'SH-KID-031', category: 'Co-ords', mainCategory: 'Kids' },
  { title: 'Flyknit Performance Sneakers', uniqueCode: 'SH-ACC-045', category: 'Footwear', mainCategory: 'Accessories' },
];

const CATEGORY_PLAN = [
  { main: 'Men', prefix: 'SH-MEN', types: ['Shirt', 'T-Shirt', 'Jacket', 'Trousers', 'Sweatshirt', 'Kurta', 'Shorts', 'Blazer'] },
  { main: 'Women', prefix: 'SH-WMN', types: ['Dress', 'Top', 'Kurti', 'Saree', 'Palazzo', 'Jumpsuit', 'Skirt', 'Cardigan'] },
  { main: 'Kids', prefix: 'SH-KID', types: ['Co-ord Set', 'T-Shirt', 'Dungaree', 'Frock', 'Shorts Set', 'Jacket'] },
  { main: 'Fashion', prefix: 'SH-FSH', types: ['Tote Bag', 'Belt', 'Scarf', 'Sunglasses', 'Watch', 'Wallet', 'Cap'] },
  { main: 'Accessories', prefix: 'SH-ACC', types: ['Sneakers', 'Loafers', 'Sandals', 'Backpack', 'Necklace', 'Earrings'] },
];

const ADJECTIVES = ['Classic', 'Modern', 'Relaxed', 'Slim-Fit', 'Everyday', 'Weekend', 'Studio', 'Heritage', 'Urban', 'Essential'];
const COLORS = ['Navy', 'Charcoal', 'Olive', 'Ivory', 'Rust', 'Sand', 'SteelBlue', 'Maroon', 'Forest', 'Blush'];

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
      generated.push({
        title: `${adjective} ${color} ${type}`,
        uniqueCode: nextCode(cat.prefix),
        category: type,
        mainCategory: cat.main,
      });
    }
  });
  return generated;
}

async function auditCatalogImages() {
  console.log('--- Auditing Style Heaven Catalog Images ---');
  seedCounter = 100;
  const all = [...products, ...buildGeneratedProducts(40)];
  console.log(`Total products in catalog: ${all.length}`);

  const allUrls = new Set();
  const typeUrlMap = {}; // type -> Set of URLs
  let totalImages = 0;

  for (const p of all) {
    const images = getProductImageUrls({
      type: p.category,
      category: p.mainCategory,
      uniqueCode: p.uniqueCode,
    });
    p.images = images;
    if (!images || images.length < 2) {
      console.error(`ERROR: Product ${p.uniqueCode} has less than 2 images:`, images);
    }
    for (const img of images) {
      allUrls.add(img);
      totalImages++;
      const catType = `${p.mainCategory}:${p.category}`;
      if (!typeUrlMap[catType]) typeUrlMap[catType] = new Set();
      typeUrlMap[catType].add(img);
    }
  }

  console.log(`Assigned ${totalImages} image slots across ${allUrls.size} unique image URLs.`);

  // Audit cross-category / cross-type sharing
  console.log('\nChecking for improper photo sharing across distinct garment types...');
  const urlToTypes = {};
  for (const [catType, urls] of Object.entries(typeUrlMap)) {
    for (const url of urls) {
      if (!urlToTypes[url]) urlToTypes[url] = [];
      urlToTypes[url].push(catType);
    }
  }
  let crossTypeCollisions = 0;
  for (const [url, types] of Object.entries(urlToTypes)) {
    if (types.length > 1) {
      // It is only allowed if they are related curated vs generated of same type (e.g. Shirts vs Men:Shirt)
      const normalized = [...new Set(types.map(t => t.replace(/^Men:Shirts$/, 'Men:Shirt').replace(/^Women:Dresses$/, 'Women:Dress').replace(/^Accessories:Footwear$/, 'Accessories:Sneakers').replace(/^Women:Co-ords$/, 'Women:Co-ord Set').replace(/^Kids:Co-ords$/, 'Kids:Co-ord Set')))];
      if (normalized.length > 1) {
        console.warn(`WARNING: URL shared across different garment types (${types.join(', ')}): ${url}`);
        crossTypeCollisions++;
      }
    }
  }
  if (crossTypeCollisions === 0) {
    console.log('PASS: No cross-garment-type photo collisions found.');
  } else {
    console.log(`FAIL: ${crossTypeCollisions} improper cross-type collisions detected.`);
  }

  // Ping every unique URL with HEAD
  console.log(`\nPinging ${allUrls.size} unique image URLs via HTTP HEAD...`);
  let passed = 0;
  let failed = 0;
  const failures = [];

  const urlArray = Array.from(allUrls);
  const BATCH_SIZE = 10;
  for (let i = 0; i < urlArray.length; i += BATCH_SIZE) {
    const batch = urlArray.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (url) => {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            passed++;
          } else {
            failed++;
            failures.push({ url, status: res.status });
          }
        } catch (err) {
          failed++;
          failures.push({ url, error: err.message });
        }
      })
    );
    process.stdout.write(`  Verified ${Math.min(i + BATCH_SIZE, urlArray.length)}/${urlArray.length} URLs\r`);
  }

  console.log(`\n\n--- Image Audit Results ---`);
  console.log(`Total URLs Tested: ${urlArray.length}`);
  console.log(`HTTP 200 OK:      ${passed}`);
  console.log(`Failed / 404:      ${failed}`);

  if (failed > 0) {
    console.error('FAILURES:', failures);
    process.exit(1);
  } else {
    console.log('SUCCESS: All product images verified accessible with 200 OK!');
  }
}

auditCatalogImages().catch((err) => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
