# Style Haven — Modern Fashion Store

A React/Next.js storefront on an Express + MongoDB backend.

## Structure

```
style-heaven-app/
├── frontend/   Next.js 14 (App Router) + Tailwind CSS
└── backend/    Express + Mongoose + Stripe (test mode)
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY
npm run seed               # loads 211 sample products across Men/Women/Kids/Fashion/Accessories + 2 promo codes
npm start                  # http://localhost:4000
```

The server validates required env vars (`MONGO_URI`, `JWT_SECRET`) at startup
and exits immediately with a clear message if they're missing or invalid —
`config/validateEnv.js`. `JWT_SECRET` must be at least 16 characters.

Promo codes seeded for testing: `WELCOME10` (10% off, ₹999 min order),
`FLAT200` (₹200 off, ₹1999 min order). Multiple codes can be stacked at
checkout — the backend re-validates and applies each one cumulatively
server-side, never trusting client-sent discount amounts.

Dev-only route wiring check (doesn't need a real DB):
```bash
node scripts/wiring-test.js
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev                 # http://localhost:3000, proxies /api/* to the backend on :4000
```

## Design system

- **Palette**: no black/dark theme — deep navy (`#16213E`) for text and
  structural chrome (nav, footer, badges), warm cream/off-white backgrounds,
  emerald secondary accent, and a warm amber (`cta` / `cta-deep`) reserved
  specifically for primary action buttons (Add to Cart, Continue, Submit).
  All defined in `frontend/tailwind.config.js`.
- **Navigation**: consolidated to 5 links — Home, Shop (mega-dropdown: Men,
  Women, Kids, Fashion & Accessories), Deals & New Arrivals (dropdown), About
  Us, Contact (hover dropdown: Customer Support → `/contact`, Merchant
  Partner → `/merchant`). Mobile drawer mirrors the same grouped structure.
- **Product cards**: rounded, hover-lift with shadow, discount badge,
  wishlist heart overlay, solid "Add to Cart" button with an inline
  add-confirmation state.
- **Footer**: fully routed — Shop, Support (Shipping & Returns, Size Guide,
  Track Order, FAQ, Contact), Company (About, Join as Merchant, Merchant
  Login, Terms of Service, Privacy Policy), and social links.

## What's implemented against the spec

- **Catalog & pagination**: 211 seeded products (18 pages at 12/page (with a 48-item API cap)),
  server-side pagination/filtering/sorting via `/api/products`, jump-to-page
  control on the frontend for deep catalogs.
- **PDP**: gallery with thumbnails, size selector, colour swatches, quantity
  with stock cap, pincode delivery check, description/fabric/size guide.
- **Checkout**: 4-section accordion (Contact Info → Address → Promo Code &
  Review → Payment), each section unlocking after the previous is completed
  and re-openable to edit. Address includes street/city/state/pincode plus an
  optional landmark. Multiple promo codes can be applied with live
  recalculation. Payment: Stripe-test-mode or COD. Success screen shows the
  generated Order ID, Tracking ID, and any applied promo codes.
- **Contact form**: Query Type dropdown (General Inquiry / Order Related /
  Service Request / Feedback-Other) with a conditionally required Order ID
  field when "Order Related" is selected.
- **Merchant form**: Business Name, Contact Person, Email, Phone, Business
  Address, GSTIN (regex-validated 15-character format), Product Category,
  and a required compliance checkbox, alongside a written merchant-partner
  guidelines panel.
- **Backend**: Mongoose schemas for User/Product/Order/Promo; order creation
  re-prices every line item from the database (never trusts client-sent
  prices), checks and decrements stock, validates and stacks multiple promo
  codes cumulatively, and generates collision-checked unique `SH-ORD-xxxxx` /
  `SH-TRK-xxxxx` IDs. Order tracking lookup at `/api/orders/track/:trackingId`
  and the matching `/track/[trackingId]` frontend page. JWT auth
  (signup/login), wishlist endpoints, fail-fast env validation at startup.

## Verified in this environment

- **Backend**: every model's Mongoose validation exercised directly
  (`validateSync`), all 211 generated seed products pass validation with
  zero failures and zero duplicate unique codes, promo discount/expiry/min-
  order logic and order pricing math unit-tested, every route file syntax-
  checked, full route wiring smoke-tested end-to-end (health check, 404
  handling, dispatch) with a stubbed DB connection, and env validation
  confirmed to both reject a missing `MONGO_URI` (exit 1) and accept a valid
  config.
- **Frontend**: `next build` completes with zero errors across all 20 routes.
  `next start` was hit with curl for every route (`/`, `/products`,
  `/product/[id]`, `/checkout`, `/contact`, `/cart`, `/login`, `/signup`,
  `/merchant`, `/merchant/login`, `/wishlist`, `/about`, `/terms`,
  `/privacy`, `/shipping-returns`, `/size-guide`, `/faq`, `/track`,
  `/track/[trackingId]`) — all return 200, with expected content (new nav
  labels, footer links, contact form's conditional field, CTA color classes)
  confirmed present in the rendered HTML.
- **Not yet tested**: a real MongoDB connection end-to-end (no MongoDB
  instance is reachable from this sandbox). Point `MONGO_URI` at a real
  database and run `npm run seed`, then click through the actual UI —
  especially the multi-promo checkout flow and PDP wishlist/cart handoff —
  since sandbox verification here was necessarily API/build-level, not a
  real browser session.
- **Product imagery**: product records now receive real category-matched Pexels photography. The seed process deterministically selects two relevant photos per product and stores the direct HTTPS URLs in MongoDB. The frontend uses `next/image` with `unoptimized`, so the photos load directly without an unnecessary image-optimization proxy. If an external photo ever fails, the product card/PDP falls back to the bundled placeholder.
- Stripe integration is **test mode** only; `PaymentStep.jsx` shows the
  Stripe test-card hint as static UI rather than live Stripe Elements.

## Round 3 — bug fixes & checkout redesign

- **Search fix**: searching "men" returned 0 results because the backend's
  text index only covered `title`/`category`, and no generated product title
  literally contains the word "men" (titles are like "Classic Navy Shirt",
  category is `mainCategory: "Men"`). Backend now does a case-insensitive
  regex `$or` match across `title`, `category`, `mainCategory`, and
  `description` — verified directly that the regex matches `mainCategory:
  "Men"`. Also fixed the actual reported trigger: clicking a filter chip
  (e.g. "New Arrivals") while a search was active silently combined
  `badge=NEW AND regex(q)`, which could zero out results even when the
  search term alone had matches — filter/sort/category changes now clear an
  active search, and the active search term shows as a dismissible chip.
- **Homepage hero**: was cropping the subject at an extreme 21:9 ratio on
  desktop; now caps at 16:9 with `object-position: top` so the full subject
  stays in frame.
- **Footer dead space**: removed a blanket `mt-20` on the footer that
  stacked with each page's own bottom padding.
- **Checkout redesigned** from the 4-step accordion to a MaxMall-style
  single-page 2-column layout: a 3-node progress tracker (Cart → Checkout →
  Payment), left column with Contact Info, saved-address selector cards
  (primary tag + "+ Add New Address"), and Payment Method selection, right
  column a sticky Order Summary (thumbnails, promo codes, cost breakdown,
  Submit Order). Logged-in users see their real saved addresses via
  `/api/auth/me`; guests get a local-only address for that order. The old
  accordion components (`AccordionSection`, `CustomerStep`, `AddressStep`,
  `SummaryStep`, `PaymentStep`) were removed as dead code.
- **B2C focus**: removed the `/merchant/login` vendor-portal page entirely.
  Footer/nav only ever linked to `/merchant` (the partner *enquiry* page) —
  verified no remaining references to the login route anywhere in the app.
- **Contact form**: Query Type options now match spec exactly — General
  Query, Order Status / Issue, Returns & Refunds, Product Feedback — with
  the Order ID field required for either of the two order-related options.
- **Account menu, 404/error pages, PDP image max-height** were already
  correctly implemented from a prior pass and were verified, not rebuilt.

Verified this round: all backend files syntax-checked, wiring test passes
end-to-end, the search regex was unit-tested directly against real seed
data shapes, new `landmark` field validated on both `User` and `Order`
schemas, `next build` clean across 21 routes (down from `/merchant/login`
being removed), and every route curl-tested for the correct status code
(200 for real routes, 404 for a nonexistent route — confirming the custom
not-found page is wired correctly).

## Round 4 — wishlist, spacing, permanent local product images

- **Wishlist heart was fully non-functional** — both `ProductCard` and the
  PDP heart button only toggled local component state; nothing was ever
  sent to the backend, so it reset on every reload and never matched
  `/wishlist`. Built `lib/useWishlist.js`: a shared, cached hook (one GET
  request no matter how many product cards are on a page) with optimistic
  toggle + rollback on failure, wired into both locations. Login/signup now
  route their token storage through `setToken()`/`clearToken()` so a new
  session correctly invalidates the previous user's cached wishlist.
- **`/api/orders/mine` and `/auth/me/addresses` 404s** — both routes exist
  and are correctly registered in the code (verified by reading the exact
  file/line the error pointed at). This is almost certainly a **stale
  backend process** — Node doesn't hot-reload, so if these route files
  changed since the backend was last restarted, the running process is
  still serving an old route table. No code changes were needed here;
  just stop and restart `node server.js` / `npm.cmd start` after replacing
  the files.
- **PDP layout**: the gallery column is now `sticky` so it stays in view
  instead of leaving blank space once the (taller) info column scrolls
  past a shorter image. The "Added to bag" confirmation no longer shifts
  layout — it's a fixed, auto-dismissing toast instead of an inline message.
- **Checkout/cart box sizing**: checkout page width capped at `max-w-5xl`
  (was full container width), gaps and card padding tightened across the
  checkout page, order summary sidebar, and cart summary box.
- **Product images — replaced entirely.** The mismatched stock photos
  (forest, monkey, lake reflection) were Picsum placeholders with no
  relationship to the product. Built a real local image pipeline:
  - `backend/utils/productImage.js` generates a shaped SVG per product —
    10 silhouette families (topwear, bottomwear, dress, kids set, bag,
    footwear, eyewear, watch, jewelry, flat accessory) covering all 33
    garment types in the catalog, filled with that product's actual
    assigned color.
  - `seed.js` now writes one real file per product to
    `backend/public/products/<uniqueCode>.svg` and stores the relative
    path `/media/products/<uniqueCode>.svg` on the product document —
    never an external URL.
  - `server.js` serves that folder statically at `/media`; the frontend's
    `next.config.js` proxies `/media/:path*` the same way it already
    proxied `/api/:path*`, and `dangerouslyAllowSVG` is enabled (scoped
    with a strict CSP) since Next blocks SVG optimization by default.
  - All 10 hand-curated products' old Pexels URLs were removed too, so
    **every** product image is now self-hosted and permanent — no product
    photo depends on any external host, ever again.

Verified this round: family-mapping tested against all 33 garment types
used in the catalog (100% correct), the real `seed.js` run end-to-end
against a stubbed DB layer generated all 210 files, every one validated as
well-formed XML. The full image pipeline was tested for real — booted the
actual backend and frontend together, confirmed the backend serves the SVG
with the correct `image/svg+xml` content-type, confirmed the frontend's
`/media` rewrite proxies it byte-for-byte unchanged, and confirmed Next's
own image optimizer (`/_next/image`) successfully processes it end-to-end
(this specifically needed `dangerouslyAllowSVG`, which was missing before
and would have caused a hard failure). `next build` is clean across all 21
routes, and every route was curl-tested for the correct status code with
both servers running together.

One thing to run after pulling this update: **`npm.cmd run seed` needs to
be run again** — the product image paths changed from external URLs to
local `/media/products/*.svg` paths, so existing seeded data in your
database still points at the old (broken/mismatched) image sources.

## Round 4 — wishlist, image architecture, spacing, verification

- **Wishlist actually works now**: the heart on `ProductCard` and the PDP
  was pure local `useState` — never called the backend, reset on every
  reload. Built `lib/useWishlist.js`, a shared cached hook (one GET
  request no matter how many product cards render), optimistic
  toggle with rollback on failure, redirects a guest to `/login`. Wired
  into both locations; login/signup now route through `setToken()` so a
  new session correctly invalidates the previous user's cached wishlist.
- **Product images — real architecture change**: replaced the Picsum
  placeholder photos (which had no relationship to the product — a monkey
  photo on a shorts set, a lake on a dungaree) with `backend/utils/
  productImage.js`, which generates a real local SVG file per product,
  shaped to match its actual garment type (10 shape families covering all
  33 catalog types — topwear, bottomwear, dress, kids-set, bag, footwear,
  eyewear, watch, jewelry, flat-accessory) and colored with the product's
  actual assigned color. `seed.js` now writes these to `backend/public/
  products/*.svg` and stores the path (`/media/products/<code>.svg`) on
  each product — no external image host, ever. Backend serves them via
  `express.static` at `/media`; `next.config.js` proxies `/media/:path*`
  the same way it already proxies `/api/:path*`, and `dangerouslyAllowSVG`
  is enabled (scoped to same-origin/self-hosted content only) since Next
  blocks SVG optimization by default for security.
- **PDP layout**: gallery column is now `sticky` so it stays in view
  instead of leaving blank space once a taller info column scrolls past a
  shorter image — this was very likely the actual cause of the "blank
  image" screenshot, not a broken image load.
- **Add-to-bag layout shift**: the inline "Added to bag" message that
  pushed page content down was replaced with a fixed, auto-dismissing
  toast.
- **Checkout/cart spacing**: checkout page capped at a narrower max-width
  instead of stretching the full 1360px container; tightened gap/padding
  on the order-summary sidebar on both checkout and cart pages.
- **API 404s on `/api/orders/mine` and `/auth/me/addresses`**: both routes
  were verified correct in the code (right path, right mount order, right
  method). This is almost certainly a stale backend process — Node doesn't
  hot-reload route files, so if these routes were added after the backend
  was last started, restarting it (`npm.cmd start` again after replacing
  files) resolves it.

Verified this round: `familyFor()` unit-tested against all 33 catalog
types with correct family assignment for each; `generateProductSVG()`
output validated as well-formed XML for all 210 seed products (ran the
real `seed.js` against a stubbed DB layer — not a reimplementation); a
real static file was generated and fetched with the correct `200` status
and `image/svg+xml` content-type first directly from the backend, then
again through the actual Next.js `/media` rewrite exactly as a browser
would request it; `next build` clean across all 21 routes; every route
curl-tested for 200 with no runtime errors in the server log.

## Round 5 — blank/mismatched product images investigation

Your screenshots showed products with completely blank image boxes (browser
alt-text visible, no image rendered) and, before that, product images that
didn't match the products at all (a monkey photo on a shorts set) — the
latter should already be fixed by Round 4's local SVG image system, but the
blank-box symptom needed more investigation.

What I tested and ruled out: the backend correctly serves generated SVGs at
`/media/products/*.svg` with `200` and the right content-type; the Next.js
`/media` rewrite correctly proxies this from the frontend's origin; and —
contrary to my initial suspicion — Next.js's built-in Image Optimizer
(`/_next/image`) *also* correctly resolves and serves these rewrite-proxied
local paths with `200`, so that was not the bug either.

What changed anyway: switched `next/image` usages for product images
(`ProductCard`, the PDP gallery and thumbnails) to `unoptimized`. This isn't
a confirmed fix for a reproduced bug — I could not reproduce the blank-image
symptom in this sandbox — but it's a legitimate simplification regardless:
it removes an entire proxy/optimization layer for images that are vector
graphics anyway (no resizing/compression benefit to lose), which eliminates
a class of potential Next-version- or environment-specific quirks around
SVG optimization even if my sandbox didn't reproduce one.

**The most likely real explanation, which I could not verify remotely**: the
backend process needs to be fully restarted with the current code AND
`npm run seed` needs to have been re-run since Round 4's image-architecture
change. If either was skipped, the database still holds product documents
from before local images existed (old Picsum URLs, likely broken/blocked on
your network) or the running Node process is serving an old route table
without the `/media` static route. Both would produce exactly this symptom.
If the blank images persist after a full reseed + restart with the `unoptimized`
build, that would be a strong signal the cause is something this sandbox
genuinely cannot reproduce (e.g. a network/proxy restriction specific to
your machine blocking `localhost:4000` from the frontend process, or a
Node/Next version difference) — in which case checking the browser's DevTools
Network tab for the actual failing request URL and status code on a real
product image would be the fastest way to pin it down.

Verified this round: `next build` clean across all 21 routes with the
`unoptimized` changes in place; confirmed via a live boot of both servers
that the exact request an `unoptimized` `<Image>` now makes
(`GET /media/products/*.svg` directly, no `/_next/image` hop) returns `200`
with the correct `image/svg+xml` content-type; spot-checked that page routes
still render correctly.
