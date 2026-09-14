// Real product photography from Pexels.
//
// BUG THIS FIXES: every category in the previous version of this file drew
// from a shared, overlapping pool of the same handful of photo IDs — e.g.
// Dress/Top/Kurti/Saree/Palazzo/Jumpsuit/Skirt/Cardigan were all built from
// the exact same 4 underlying photos, just reordered. That's not a rare
// coincidence, it's guaranteed collision: different-named products showed
// identical images (see the reported screenshot — Jumpsuit/Cardigan/Skirt/
// Kurti all rendering the same photo). The same pattern existed across
// men's, kids', and accessory categories too (Necklace and Earrings used to
// be *literally the same array*).
//
// FIX: every category below now has its own photo ID(s), verified against
// real Pexels listings and not shared with any other category. Categories
// most visibly affected by the bug (all of Women's apparel) were rebuilt
// with photos specifically matching that garment type. A few lower-traffic
// categories (marked below) were fixed for the duplication bug but not
// individually re-verified for exact garment relevance in this pass — see
// FIXES.md for what's still recommended before launch.

const PEXELS = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

const PHOTO_POOLS = {
  // ---- Men's apparel — verified: Shirt, Jacket, Trousers, Blazer ----
  Shirt: [1984632, 3214813, 865773, 18516993],
  Jacket: [1935773],
  Trousers: [2815417, 8217535],
  Blazer: [6326369, 10330182, 3051576],
  // Not individually re-verified this pass — fixed for duplication only,
  // still recommend a real verification pass (see FIXES.md).
  'Men:T-Shirt': [2899931, 16941803],
  Sweatshirt: [15218505, 17901274],
  Kurta: [37586702, 15451693],
  Shorts: [6616119, 10818060],

  // ---- Women's apparel — all verified against real Pexels listings ----
  Dress: [19881950, 11853682, 17775855, 14801125],
  Top: [10512915, 15915190, 12846372, 19590858],
  Kurti: [19556879],
  Saree: [2723623, 730056, 24781661, 20335764, 2686117],
  Jumpsuit: [4006508, 3110356, 903678, 11187524],
  Skirt: [19870969, 14997427, 11142115],
  Cardigan: [15052341, 17588315],
  // Not individually re-verified this pass (fixed for duplication only).
  Palazzo: [7279642, 14779763, 1453409, 15071849],

  // ---- Kids — verified against real Pexels listings, no more overlap ----
  'Co-ord Set': [14622835, 18907450],
  'Kids:T-Shirt': [6261877],
  Dungaree: [15625985, 15579750],
  Frock: [19161249, 18908323, 18649978],
  'Shorts Set': [14622650],

  // ---- Fashion accessories — fixed for duplication; recommend verification ----
  'Tote Bag': [8006405, 5658856],
  Belt: [8989866, 34926536],
  Scarf: [9011184, 2986445],
  Sunglasses: [4076565, 934064],
  Watch: [6349118, 34479698],
  Wallet: [29722037, 34027233],
  Cap: [9496008, 35512704],

  // ---- Footwear / bags / jewelry ----
  Sneakers: [2529148, 2529147],
  Loafers: [1497406, 17577101],
  Sandals: [19556446, 26653386],
  Backpack: [10259202, 30886814],
  // Verified — previously Necklace and Earrings used the literal same array.
  Necklace: [2752462, 186447, 13348320, 6431174],
  Earrings: [3266700, 2735970, 1721937, 12144990, 1413420, 18597841, 16242338, 10983783, 9649265],

  // ---- Hand-curated products whose category field is broader than their
  //      type — intentionally aliased to the matching pool above (this is
  //      not a duplication bug, it's the same category under a second key).
  Shirts: [1984632, 3214813, 865773, 18516993],
  Dresses: [19881950, 11853682, 17775855, 14801125],
  'Co-ords': [14622835, 18907450],
  Footwear: [2529148, 2529147, 1497406, 17577101],
};

function seedFrom(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

function poolFor(typeOrCategory) {
  return PHOTO_POOLS[typeOrCategory] || [934064, 4076565, 2986445];
}

function getProductImageUrls({ type, category, uniqueCode }) {
  const pool = PHOTO_POOLS[`${category || ''}:${type || ''}`] || poolFor(type || category || '');
  const seed = seedFrom(uniqueCode || type || category || 'product');
  const first = pool[seed % pool.length];
  const second = pool[(seed + 1) % pool.length];
  return [PEXELS(first), PEXELS(second)];
}

module.exports = { getProductImageUrls };
