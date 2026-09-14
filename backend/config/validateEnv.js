// Validates required environment variables at startup so the server
// fails immediately with a clear, actionable message instead of
// crashing later (or silently misbehaving) mid-request.

const REQUIRED = [
  { key: 'MONGO_URI', hint: 'a MongoDB connection string, e.g. mongodb+srv://user:pass@cluster.mongodb.net/style-heaven' },
  { key: 'JWT_SECRET', hint: 'any long random string used to sign login tokens' },
];

// Recommended but not fatal — the server can run without these,
// just with reduced functionality (flagged clearly at startup).
const RECOMMENDED = [
  { key: 'STRIPE_SECRET_KEY', hint: 'a Stripe secret key — without it, card checkout is disabled and only COD works' },
  { key: 'STRIPE_WEBHOOK_SECRET', hint: 'your Stripe webhook signing secret — without it, orders will never be marked as paid after a card charge succeeds' },
  { key: 'FRONTEND_ORIGIN', hint: 'your frontend URL for CORS — defaults to http://localhost:3000 if unset' },
];

function validateEnv() {
  const missing = REQUIRED.filter((v) => !process.env[v.key] || !process.env[v.key].trim());

  if (missing.length > 0) {
    console.error('\n✖ Missing required environment variables:\n');
    missing.forEach((v) => console.error(`  - ${v.key}  (${v.hint})`));
    console.error('\nCopy .env.example to .env and fill these in, then restart.\n');
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
    console.error('\n✖ JWT_SECRET is too short — use at least 16 random characters.\n');
    process.exit(1);
  }

  const missingRecommended = RECOMMENDED.filter((v) => !process.env[v.key] || !process.env[v.key].trim());
  if (missingRecommended.length > 0) {
    console.warn('\n⚠ Running without optional environment variables:\n');
    missingRecommended.forEach((v) => console.warn(`  - ${v.key}  (${v.hint})`));
    console.warn('');
  }
}

module.exports = validateEnv;
