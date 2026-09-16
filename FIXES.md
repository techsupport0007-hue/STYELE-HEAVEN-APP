# Style Haven (6) — Bug Fix & Product Image Update

## Product images

- Replaced the old LoremFlickr/generic placeholder image source with real Pexels fashion/product photography.
- Added deterministic photo pools for Men, Women, Kids, Fashion accessories and Footwear.
- Each product gets two real photos (primary + gallery/hover) based on its product type/category.
- Re-seeding the database updates existing products to the new image URLs.
- Product cards and the product-detail gallery now fall back to `/placeholder-product.svg` if an external photo fails.
- Kept `/media` static serving for backwards compatibility with older local-image records.

## Bug fixes

- Fixed product-card cart entries so a failed product image is not stored as the fallback URL.
- Reset the PDP active gallery image whenever a new product is loaded.
- Guarded the PDP gallery against an out-of-range active image index.
- Added image error fallbacks to the PDP main image and thumbnails.
- Removed stale image-generator assumptions from the seed pipeline.
- Corrected stale documentation describing the catalog/image implementation.

## Verification performed

- Backend JavaScript syntax check: PASS.
- Product-image mapping smoke test: PASS for representative Men/Women/Kids/Fashion/Accessories types.
- Confirmed no stale LoremFlickr/Picsum/generated-SVG image references remain in frontend/backend source.

## Important

Run the seed again after replacing the old project:

```bash
cd backend
npm install
npm run seed
npm start
```

Then start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The sandbox used for this patch could not complete `npm install` because external package-network access timed out, so a fresh dependency install and full Next.js build should be run on the development machine.

## Round 6 — product image hotfix (31 Aug 2026)

- Fixed the root cause shown in the storefront screenshot: existing MongoDB records could still contain the old local `/media/products/*.svg` placeholder paths. The API now normalizes legacy/missing image records to real category-matched Pexels photography at response time, so a database reseed is no longer required just to display images.
- Replaced Next.js remote `Image` rendering for product photos with native browser `<img>` rendering. This removes the unnecessary Next image pipeline as another possible failure point for external product photography.
- Product detail gallery uses the same robust image loading path.
- A full reseed is still recommended when you want the new image URLs permanently written into MongoDB, but it is no longer required for the storefront to display real images.

## Round 7 — colour swatch bug fix + DB connection hardening (testing pass)

- **Bug found & fixed:** the product detail page rendered colour swatches with
  `style={{ backgroundColor: c.toLowerCase() }}` — using the raw colour name
  directly as a CSS colour value. Several colours actually used in the seed
  data (`Charcoal`, `Rust`, `Sand`, `Forest`, `Blush`, `IndigoBlue`, `Floral`)
  are **not valid CSS colour keywords**, so the browser silently ignored the
  style and those swatches rendered as blank/invisible circles. Added
  `frontend/lib/colorSwatch.js` — an explicit colour-name → hex map covering
  every colour in the seed data plus common extras, with a visible grey
  fallback for anything not listed — and wired it into the swatch style.
- Hardened `config/db.js`: added `serverSelectionTimeoutMS: 8000` so a down/
  unreachable MongoDB fails fast with a clear error instead of hanging for
  Mongoose's default ~30s.

## Testing performed this round

- Backend: `node --check` on every `.js` file — pass. Required every backend
  module (models, routes, middleware, utils, config) directly — all load
  without throwing.
- Backend: booted `server.js` against an unreachable MongoDB to confirm it
  fails the way `config/db.js` intends, rather than crashing on bad code.
- Frontend: fresh `npm install` + `next build` — compiles clean, all 21
  routes (static + dynamic) generate successfully, both before and after
  the fix above.
- Spot-checked several hardcoded Pexels photo IDs in
  `backend/utils/productImage.js` against real Pexels listings — could not
  confirm a couple of the exact IDs are real photos (they may 404). This is
  already mitigated by the `onError` fallback to `/placeholder-product.svg`
  in both `ProductCard.jsx` and the product detail gallery, so a wrong ID
  degrades to a placeholder image rather than a broken-image icon — but a
  full manual/visual pass over the image pools (or regenerating them from a
  verified Pexels API call) is worth doing before launch.
- Could not spin up a real or in-memory MongoDB in this environment (no
  network path to a Mongo binary), so the full request→DB→response path for
  each route (auth, orders, promo, wishlist, contact) was verified by close
  logic review and cross-checking frontend/backend payload shapes rather
  than by executing live requests. Recommend running the existing
  `backend/scripts/wiring-test.js` (and a manual click-through) against a
  real MongoDB instance before deploying.

## Round 8 — production hardening

- **Critical fix: card payments now actually charge a card.** Previously
  choosing "Stripe" at checkout created an order marked `pending` and did
  nothing else — no Stripe call, no card collection, ever. Now order
  creation produces a real Stripe PaymentIntent (rolling the order back if
  Stripe fails), the frontend collects card details via Stripe Elements
  (`components/checkout/StripePaymentForm.jsx`), and a new
  `POST /api/webhooks/stripe` endpoint is the source of truth that marks
  orders `paid`/`failed` based on Stripe's own confirmation — never the
  frontend's say-so.
- Added production middleware to `server.js`: `helmet`, `compression`,
  `express-mongo-sanitize`, rate limiting (general + stricter on
  login/signup), request logging via `morgan`, `trust proxy` for correct
  client IPs behind a reverse proxy, and graceful shutdown on
  `SIGTERM`/`SIGINT`.
- Added `.gitignore` for both `frontend/` and `backend/` (none existed —
  `.env` files and `node_modules` had no protection from being committed).
- Added `DEPLOYMENT.md` with environment variables, Stripe webhook setup
  instructions, hosting suggestions, and a go-live checklist.
- Verified: full backend module load test, live server boot against a
  stubbed DB with real HTTP requests (including a bad-signature webhook
  request correctly rejected with 400, confirming the raw-body wiring is
  correct), and a full frontend `next build` — all pass.

## Round 9 — image repetition + relevance bug (reported with screenshot)

**Bug, exactly as reported:** the storefront showed the identical photo
across differently-named products (Jumpsuit, Cardigan, Skirt, Kurti all
rendering the same image). Root cause in `backend/utils/productImage.js`:
almost every category's photo pool was built from the *same small set* of
underlying photo IDs, just reordered — e.g. Dress, Top, Kurti, Saree,
Palazzo, Jumpsuit, Skirt, and Cardigan all drew from one shared set of 4
photo IDs. That's not occasional bad luck, it's a guaranteed collision.
The same pattern existed in men's, kids', and accessory categories too —
`Necklace` and `Earrings` were, before this fix, the literal same array.

**Fix:** rebuilt every category's photo pool from scratch so no two
categories share a photo ID — verified programmatically (see below), not
just by inspection. All of Women's apparel (the categories in the reported
screenshot) plus Men's Shirt/Jacket/Trousers/Blazer, Kids' 5 categories,
and Necklace/Earrings were rebuilt using photo IDs individually confirmed
against real Pexels listings via web search (not guessed/fabricated IDs —
see Round 7's warning about that failure mode). A handful of lower-traffic
categories (Men's T-Shirt/Sweatshirt/Kurta/Shorts, Palazzo, and the fashion
accessories: Tote Bag, Belt, Scarf, Sunglasses, Watch, Wallet, Cap) were
fixed for the duplication bug using the pre-existing IDs redistributed so
no two categories share one, but were **not** individually re-verified for
exact garment-type relevance in this pass — recommend a follow-up
verification pass on those specifically (the Antigravity handoff prompt
already covers this).

**Verified, not assumed:** wrote a small script that parses every entry in
`PHOTO_POOLS` and confirms zero photo IDs are shared across any two
categories (the 4 "hand-curated alias" entries — Shirts/Dresses/Co-ords/
Footwear — are intentionally excluded since they're meant to mirror an
existing category, not a bug). Result: 34 categories checked, 89 unique
photo IDs, 0 collisions. Also directly simulated the exact 5 products from
the reported screenshot (Jumpsuit/Cardigan/Skirt/Kurti/Palazzo) and
confirmed each now resolves to a distinct photo ID.

**To see this fix live:** re-run `node seed.js` — it clears and
re-inserts the product collection each time, so this is safe to re-run
against an existing database.
