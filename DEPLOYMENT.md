# Deploying Style Haven to Production

This covers what changed to make the app production-ready, and the steps
to actually go live.

## What changed in this pass

### Fixed: card payments never actually charged anyone
Previously, choosing "Stripe" at checkout created an order with
`paymentStatus: 'pending'` and stopped — the frontend never called Stripe
at all, no card was ever collected or charged. Now:
1. `POST /api/orders` creates the order, then (for `paymentMethod: 'stripe'`)
   creates a real Stripe PaymentIntent tied to it and returns a
   `clientSecret`. If Stripe isn't configured or the intent fails, the
   order is rolled back rather than left stuck.
2. The frontend checkout page uses `StripePaymentForm` (Stripe Elements) to
   actually collect card details and confirm the charge with that
   `clientSecret`.
3. `POST /api/webhooks/stripe` is the **source of truth**: Stripe calls it
   directly when a PaymentIntent succeeds or fails, and only then is the
   order's `paymentStatus` updated to `paid`/`failed`. Never trust the
   frontend's word that a payment succeeded — always confirm via webhook.

### Fixed: colour swatches invisible for several colours
See `FIXES.md` Round 7 — some colour names weren't valid CSS colour
keywords. Now uses an explicit name→hex map (`frontend/lib/colorSwatch.js`).

### Backend hardening (`server.js`)
- `helmet()` — sets standard security headers.
- `compression()` — gzips responses.
- `express-mongo-sanitize` — strips `$`/`.` keys from input to block
  NoSQL-injection payloads.
- `express-rate-limit` — 300 req/15min generally, 20 req/15min specifically
  on `/api/auth/login` and `/api/auth/signup` to slow down brute-forcing.
- `morgan` request logging (`dev` format locally, `combined` in production).
- `app.set('trust proxy', 1)` — needed so rate limiting and `req.ip` see the
  real client IP when deployed behind a reverse proxy/load balancer.
- Graceful shutdown on `SIGTERM`/`SIGINT` — finishes in-flight requests and
  closes the MongoDB connection before exiting, instead of dropping
  connections mid-request on every deploy/restart.
- `config/db.js`: added `serverSelectionTimeoutMS: 8000` so a down database
  fails fast instead of hanging ~30s.

## Environment variables

**Backend** (`backend/.env` — copy from `.env.example`):
| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | Yes | Use MongoDB Atlas in production, not a local instance. |
| `JWT_SECRET` | Yes | 32+ random characters. Generate with `openssl rand -hex 32`. |
| `STRIPE_SECRET_KEY` | For card payments | Use your Stripe live secret key in production. |
| `STRIPE_WEBHOOK_SECRET` | For card payments | From the Stripe Dashboard webhook you create below. |
| `FRONTEND_ORIGIN` | Yes | Your deployed frontend's exact URL, for CORS. |
| `NODE_ENV` | Yes | Set to `production`. |
| `PORT` | No | Most hosts set this for you. |

**Frontend** (`frontend/.env.local` — copy from `.env.example`):
| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | Yes | Your deployed backend's URL. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For card payments | Your **live** publishable key (`pk_live_...`). Safe to expose. |

Never put `STRIPE_SECRET_KEY` or `JWT_SECRET` in anything prefixed
`NEXT_PUBLIC_` — those are bundled into client-side JavaScript and visible
to anyone.

## Setting up the Stripe webhook (required for card payments to work)

Without this, orders will charge the customer's card successfully but
**stay marked "pending" forever** — this step is not optional if you accept
card payments.

1. In the Stripe Dashboard → Developers → Webhooks → **Add endpoint**.
2. Endpoint URL: `https://<your-backend-domain>/api/webhooks/stripe`
3. Events to send: `payment_intent.succeeded`, `payment_intent.payment_failed`.
4. Copy the **Signing secret** shown and set it as `STRIPE_WEBHOOK_SECRET`.
5. For local testing before deploying, use the Stripe CLI instead:
   `stripe listen --forward-to localhost:4000/api/webhooks/stripe`
   (it prints a temporary webhook secret to use locally).

## Suggested hosting

- **Frontend (Next.js):** Vercel — zero-config for Next.js, set the two
  frontend env vars above in the project settings.
- **Backend (Express):** Render, Railway, or Fly.io — set the backend env
  vars above, deploy from the `backend/` folder, start command `npm start`.
- **Database:** MongoDB Atlas (free tier is fine to start) — get the
  connection string for `MONGO_URI`.

## Go-live checklist

- [ ] `MONGO_URI` points at a real MongoDB Atlas cluster (not `127.0.0.1`)
- [ ] `JWT_SECRET` is a fresh random value, not the example one
- [ ] `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are your
      **live** keys, not test keys, once you're ready for real charges
- [ ] Stripe webhook is configured and `STRIPE_WEBHOOK_SECRET` is set
      (test it with a real test-mode purchase before switching to live keys)
- [ ] `FRONTEND_ORIGIN` matches your deployed frontend's exact URL (CORS
      will silently block requests otherwise)
- [ ] `NODE_ENV=production` is set on the backend
- [ ] Run `backend/seed.js` once against the production database to
      populate the product catalog
- [ ] Confirm HTTPS is enforced (Vercel/Render/Railway do this by default)

## Known limitation worth knowing about

Stock is decremented as soon as an order is created — for card payments,
that's *before* the card is actually charged (payment is confirmed
asynchronously via the webhook above). For a small-scale store this is a
reasonable tradeoff, but at higher volume, a shopper who starts checkout
and abandons payment can hold stock hostage for other buyers. A more robust
approach for scale: decrement stock only in the webhook handler on
`payment_intent.succeeded`, with a short expiry on pending PaymentIntents
so abandoned ones release their hold automatically.
