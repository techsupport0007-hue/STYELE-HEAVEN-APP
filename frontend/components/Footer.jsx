const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: '📷' },
  { label: 'Facebook', href: 'https://facebook.com', icon: '📘' },
  { label: 'X (Twitter)', href: 'https://twitter.com', icon: '𝕏' },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-container gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="font-serif text-xl">
            STYLE <span className="text-white/60">HEAVEN</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Premium fashion for men, women and kids. Curated fabrics, honest pricing,
            effortlessly modern. Sourced through vetted business partners, sold direct to you.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-sm transition hover:border-cta hover:bg-white/10"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li><a href="/products?cat=Men" className="hover:text-cta hover:underline">Men</a></li>
            <li><a href="/products?cat=Women" className="hover:text-cta hover:underline">Women</a></li>
            <li><a href="/products?cat=Kids" className="hover:text-cta hover:underline">Kids</a></li>
            <li><a href="/products?filter=deals" className="hover:text-cta hover:underline">Deals</a></li>
            <li><a href="/products?filter=new" className="hover:text-cta hover:underline">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Support</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li><a href="/shipping-returns" className="hover:text-cta hover:underline">Shipping &amp; Returns</a></li>
            <li><a href="/size-guide" className="hover:text-cta hover:underline">Size Guide</a></li>
            <li><a href="/track" className="hover:text-cta hover:underline">Track Order</a></li>
            <li><a href="/faq" className="hover:text-cta hover:underline">FAQ</a></li>
            <li><a href="/contact" className="hover:text-cta hover:underline">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li><a href="/about" className="hover:text-cta hover:underline">About</a></li>
            <li><a href="/merchant" className="hover:text-cta hover:underline">Become a Merchant Partner</a></li>
            <li><a href="/terms" className="hover:text-cta hover:underline">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-cta hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40 md:px-8">
        © {new Date().getFullYear()} Style Heaven. All rights reserved.
      </div>
    </footer>
  );
}
