'use client';

import { useEffect, useState } from 'react';
import { fetchProductById } from '@/lib/api';
import { readCart, writeCart } from '@/lib/useCartCount';
import { useWishlist } from '@/lib/useWishlist';
import { colorToHex } from '@/lib/colorSwatch';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [eta, setEta] = useState('');
  const [added, setAdded] = useState(false);
  const { has, toggle } = useWishlist();

  useEffect(() => {
    fetchProductById(id)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.[0] || '');
        setColor(p.colors?.[0] || '');
        setActiveImage(0);
      })
      .catch((err) => setError(err?.response?.data?.error || 'Could not load this product.'));
  }, [id]);

  function checkShipping() {
    if (!/^\d{6}$/.test(pincode)) {
      setEta('Enter a valid 6-digit pincode.');
      return;
    }
    // Deterministic placeholder ETA — replace with a real courier API.
    setEta('Usually delivered in 3–5 business days.');
  }

  function addToBag(buyNow) {
    const cart = readCart();
    const key = `${product._id || product.id}-${size}-${color}`;
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.qty += qty;
    else
      cart.push({
        key,
        productId: product._id || product.id,
        title: product.title,
        image: product.images?.[0],
        price: product.price,
        offerPrice: product.offerPrice,
        size,
        color,
        qty,
      });
    writeCart(cart);
    setAdded(true);
    window.clearTimeout(window.__shAddedTimer);
    window.__shAddedTimer = window.setTimeout(() => setAdded(false), 2200);
    if (buyNow) window.location.href = '/checkout';
  }

  if (error) {
    return <div className="mx-auto max-w-container px-4 py-20 text-center text-muted">{error}</div>;
  }
  if (!product) {
    return <div className="mx-auto max-w-container px-4 py-20 text-center text-muted">Loading…</div>;
  }

  const hasOffer = product.offerPrice != null && product.offerPrice < product.price;
  const discountPct =
    product.discountPercentage ??
    (hasOffer ? Math.round((1 - product.offerPrice / product.price) * 100) : 0);
  const images = product.images?.length ? product.images : ['/placeholder-product.svg'];
  const safeActiveImage = Math.min(activeImage, images.length - 1);

  return (
    <div className="mx-auto max-w-container px-4 py-10 md:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative aspect-product w-full max-h-[70vh] overflow-hidden rounded-2xl bg-gray-100 md:max-h-[500px]">
            <img
              src={images[safeActiveImage]}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden bg-gray-100 ${
                    i === activeImage ? 'ring-2 ring-ink' : ''
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold text-muted">{product.uniqueCode}</p>
          <h1 className="mt-2 font-serif text-3xl">{product.title}</h1>

          {product.rating != null && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-amber-500">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className="text-muted">
                {product.rating} · {product.reviewCount || 0} reviews
              </span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            {hasOffer ? (
              <>
                <span className="text-2xl font-bold">₹{product.offerPrice}</span>
                <span className="text-lg text-muted line-through">₹{product.price}</span>
                <span className="text-sm font-bold text-sale">{discountPct}% OFF</span>
              </>
            ) : (
              <span className="text-2xl font-bold">₹{product.price}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-success">Inclusive of all taxes</p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide">Select Size</span>
                <a href="#size-guide" className="text-xs underline text-muted">Size Guide</a>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-10 min-w-[42px] border px-3 text-sm font-semibold ${
                      size === s ? 'border-ink bg-ink text-white' : 'border-line hover:bg-surface'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide">Colour</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-pressed={color === c}
                    title={c}
                    className={`h-8 w-8 rounded-full border-2 ${
                      color === c ? 'border-ink' : 'border-line'
                    }`}
                    style={{ backgroundColor: colorToHex(c) }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide">Qty</span>
            <div className="flex h-11 w-32 items-center justify-between border border-line">
              <button
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="h-full flex-1 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((n) => Math.min(product.stockCount ?? 10, n + 1))}
                className="h-full flex-1 text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              {product.stockCount > 0 ? `In stock (${product.stockCount} left)` : 'Out of stock'}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              disabled={!product.stockCount}
              onClick={() => addToBag(false)}
              className="h-12 flex-1 rounded-full bg-cta text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
            >
              Add to Bag
            </button>
            <button
              disabled={!product.stockCount}
              onClick={() => addToBag(true)}
              className="h-12 flex-1 rounded-full border border-ink text-sm font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white disabled:opacity-40"
            >
              Buy Now
            </button>
            <button
              aria-label={has(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => toggle(product._id || product.id)}
              className={`grid h-12 w-12 place-items-center rounded-full border transition ${
                has(product._id || product.id) ? 'border-sale bg-sale text-white' : 'border-line text-ink hover:border-ink'
              }`}
            >
              {has(product._id || product.id) ? '♥' : '♡'}
            </button>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <div className="mb-4 inline-flex items-center border border-ink px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                Free Delivery on All Orders
              </span>
            </div>

            <span className="mb-2 block text-xs font-bold uppercase tracking-wide">
              Check delivery
            </span>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter pincode"
                className="input-underline max-w-[160px]"
              />
              <button onClick={checkShipping} className="text-xs font-bold underline">
                Check
              </button>
            </div>
            {eta && <p className="mt-2 text-xs text-muted">{eta}</p>}
          </div>

          <div className="mt-8 border-t border-line pt-6" id="size-guide">
            <h2 className="text-sm font-bold uppercase tracking-wide">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.description}</p>
            {product.fabric && (
              <p className="mt-3 text-sm text-muted">
                <strong className="text-ink">Fabric:</strong> {product.fabric}
              </p>
            )}
            {product.sizeGuide && (
              <div className="mt-4 text-sm">
                <strong className="text-ink">Size guide</strong>
                <div className="mt-2 divide-y divide-line border border-line text-xs">
                  {Object.entries(product.sizeGuide).map(([k, v]) => (
                    <div key={k} className="flex justify-between px-3 py-2">
                      <span className="font-semibold">{k}</span>
                      <span className="text-muted">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {added && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-toast -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Added to bag ✓
        </div>
      )}
    </div>
  );
}
