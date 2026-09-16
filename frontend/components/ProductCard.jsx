'use client';

import { useState } from 'react';
import { readCart, writeCart } from '@/lib/useCartCount';
import { useWishlist } from '@/lib/useWishlist';

const FALLBACK_IMAGE = '/placeholder-product.svg';

const BADGE_STYLES = {
  NEW: 'bg-emerald text-white',
  BESTSELLER: 'bg-cta text-ink',
  SALE: 'bg-sale text-white',
};

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(
    product.images?.[0] || FALLBACK_IMAGE
  );
  const [justAdded, setJustAdded] = useState(false);
  const { has, toggle } = useWishlist();

  const id = product._id || product.id;
  const wishlisted = has(id);

  const hasOffer =
    product.offerPrice != null && product.offerPrice < product.price;

  const discountPct =
    product.discountPercentage ??
    (hasOffer
      ? Math.round((1 - product.offerPrice / product.price) * 100)
      : 0);

  function quickAdd(e) {
    e.preventDefault();

    const id = product._id || product.id;
    const size = product.sizes?.[0] || '';
    const cart = readCart();
    const key = `${id}-${size}-`;

    const existing = cart.find((i) => i.key === key);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        key,
        productId: id,
        title: product.title,
        image: imgSrc === FALLBACK_IMAGE ? undefined : imgSrc,
        price: product.price,
        offerPrice: product.offerPrice,
        size,
        color: '',
        qty: 1,
      });
    }

    writeCart(cart);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
      <a
        href={`/product/${product._id || product.id}`}
        className="block"
      >
        {/* Fixed 3:4 image container on a grey backdrop — never
            stretches/squishes regardless of source image size. */}
        <div className="relative aspect-product w-full overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide shadow-sm ${
                  BADGE_STYLES[product.badge] || BADGE_STYLES.NEW
                }`}
              >
                {product.badge}
              </span>
            )}

            {hasOffer && (
              <span className="rounded-full bg-sale px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
                {discountPct}% OFF
              </span>
            )}
          </div>
        </div>
      </a>

      <button
        type="button"
        aria-pressed={wishlisted}
        aria-label={
          wishlisted
            ? 'Remove from wishlist'
            : 'Add to wishlist'
        }
        onClick={(e) => {
          e.preventDefault();
          toggle(id);
        }}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-base shadow-md transition hover:scale-110 ${
          wishlisted
            ? 'bg-sale text-white'
            : 'bg-white/95 text-ink'
        }`}
      >
        {wishlisted ? '♥' : '♡'}
      </button>

      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
          {product.category}
        </p>

        <a
          href={`/product/${product._id || product.id}`}
          className="mt-1 block h-10 overflow-hidden text-sm font-semibold leading-snug text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] hover:text-emerald"
        >
          {product.title}
        </a>

        <div className="mt-1.5 flex items-baseline gap-2">
          {hasOffer ? (
            <>
              <span className="text-base font-bold text-ink">
                ₹{product.offerPrice}
              </span>

              <span className="text-[13px] text-muted line-through">
                ₹{product.price}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-ink">
              ₹{product.price}
            </span>
          )}
        </div>

        <p className="mt-1 text-[11px] text-muted">
          {product.uniqueCode}
        </p>

        <div className="mt-2 border-t border-line pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald">
            {'\u2713'} Free Delivery on All Orders
          </p>
        </div>

        <button
          onClick={quickAdd}
          disabled={!product.stockCount}
          className={`mt-3 h-10 w-full rounded-full text-xs font-bold uppercase tracking-wide transition disabled:opacity-30 ${
            justAdded
              ? 'bg-emerald text-white'
              : 'bg-cta text-ink hover:bg-cta-deep'
          }`}
        >
          {!product.stockCount
            ? 'Out of stock'
            : justAdded
              ? "Added \u2713"
              : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
