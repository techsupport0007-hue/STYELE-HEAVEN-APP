// colorSwatch.js — maps the catalog's colour name strings to real hex
// values for rendering swatches.
//
// BUG THIS FIXES: the product detail page was using
//   style={{ backgroundColor: c.toLowerCase() }}
// on the raw colour name string. That only works for names that happen
// to be valid CSS colour keywords (e.g. "Navy", "Maroon", "Beige").
// Several colours actually used in the seed data are NOT valid CSS
// keywords — "Charcoal", "Rust", "Sand", "Forest", "Blush", "IndigoBlue",
// "Floral" — so the browser silently ignores the style and those swatches
// render as blank/invisible circles. This map gives every colour used in
// the catalog (plus common extras) an explicit hex value, with a visible
// fallback for anything not listed so a future new colour degrades
// gracefully instead of disappearing.

const COLOR_HEX = {
  black: '#111111',
  white: '#FFFFFF',
  grey: '#808080',
  gray: '#808080',
  navy: '#1B2A4A',
  charcoal: '#36454F',
  olive: '#708238',
  ivory: '#FFFFF0',
  rust: '#B7410E',
  sand: '#C2B280',
  steelblue: '#4682B4',
  maroon: '#800000',
  forest: '#228B22',
  blush: '#DE5D83',
  beige: '#D8C4A0',
  indigoblue: '#3F51B5',
  skyblue: '#87CEEB',
  red: '#C0392B',
  floral: '#E8B4BC', // pattern, not a solid colour — soft pastel stand-in
};

const FALLBACK = '#C9C9C9';

export function colorToHex(name = '') {
  const key = String(name).toLowerCase().replace(/\s+/g, '');
  return COLOR_HEX[key] || FALLBACK;
}
