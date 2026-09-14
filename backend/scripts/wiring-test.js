// Wiring smoke test: stub mongoose.connect so config/db.js resolves
// without a real DB, then let server.js boot its own listener and
// hit every route to catch route-wiring bugs (bad requires, bad
// paths, middleware order) without needing a real MongoDB.
process.env.MONGO_URI = 'mongodb://stub';
process.env.JWT_SECRET = 'test-secret-at-least-16-chars';
process.env.PORT = '4999';
process.env.FRONTEND_ORIGIN = 'http://localhost:3000';

const mongoose = require('mongoose');
const http = require('http');

mongoose.connect = async () => ({ connection: { host: 'stub' } });
mongoose.connection.on = () => {};

require(require('path').join(__dirname, '..', 'server.js'));

setTimeout(() => {
  const paths = [
    '/api/health',
    '/api/products',
    '/api/products?page=1&limit=5&category=Men',
    '/api/nonexistent-route',
  ];
  let remaining = paths.length;
  paths.forEach((p) => {
    http.get({ host: 'localhost', port: 4999, path: p }, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        console.log(p, '->', res.statusCode, body.slice(0, 150));
        if (--remaining === 0) process.exit(0);
      });
    }).on('error', (e) => {
      console.log(p, '-> ERROR', e.message);
      if (--remaining === 0) process.exit(0);
    });
  });
}, 600);
