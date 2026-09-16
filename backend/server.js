require('dotenv').config();
const validateEnv = require('./config/validateEnv');
validateEnv();

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const promoRoutes = require('./routes/promo');
const paymentRoutes = require('./routes/payments');
const contactRoutes = require('./routes/contact');
const wishlistRoutes = require('./routes/wishlist');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Behind a reverse proxy (Render/Railway/Heroku/Nginx/etc.) in production,
// so express-rate-limit and req.ip see the real client IP instead of the
// proxy's.
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan(isProd ? 'combined' : 'dev'));

// Stripe webhook needs the RAW request body to verify the signature, so
// it's mounted here — before the global express.json() below — with its
// own raw body parser scoped to just this path.
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json({ limit: '100kb' }));
app.use(mongoSanitize()); // strips any $ / . keys from req.body/query/params to block NoSQL-injection payloads

// General API rate limit — generous, just a backstop against abuse/bots.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Tighter limit on auth endpoints specifically, to slow down credential
// stuffing / brute-force login attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Keep /media available for backwards compatibility with older seeded data.
// Current products use verified Pexels HTTPS photo URLs directly.
app.use('/media', express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () => console.log(`Style Haven API running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Graceful shutdown: stop accepting new connections, let in-flight
// requests finish, then close the DB connection before exiting. Matters
// in production so a deploy/restart doesn't cut requests off mid-flight.
function shutdown(signal) {
  console.log(`\n${signal} received: shutting down gracefully...`);
  if (!server) return process.exit(0);
  server.close(async () => {
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
    } finally {
      process.exit(0);
    }
  });
  // Force-exit if shutdown hangs for some reason.
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
