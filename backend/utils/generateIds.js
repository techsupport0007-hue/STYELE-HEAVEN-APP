function randomDigits(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function generateOrderId() {
  return `SH-ORD-${randomDigits(5)}`;
}

function generateTrackingId() {
  return `SH-TRK-${randomDigits(5)}`;
}

module.exports = { generateOrderId, generateTrackingId };
