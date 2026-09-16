const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'X (Twitter)', href: 'https://twitter.com' },
];

function ReturnIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M9 7H5a4 4 0 0 0 0 8h2" />
      <path d="m6 12 3-3m-3 3 3 3" />
      <path d="M13 7h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z" />
      <rect x="8" y="8" width="8" height="5" rx="1" />
      <path d="M10 15h4" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M7.5 13.5v-2a4.5 4.5 0 0 1 9 0v2" />
      <path d="M7.5 13.5H6a1.5 1.5 0 0 0 0 3h1.5v-3Zm9 0H18a1.5 1.5 0 0 1 0 3h-1.5v-3Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C11.3 19 5 12.7 5 5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">

      {/* Service highlights */}
      <div className="mx-auto max-w-container px-4 pt-6 md:px-8 md:pt-8">
        <div className="grid overflow-hidden rounded-sm border border-white/10 sm:grid-cols-3">

          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r">
            <span className="shrink-0 text-cta">
              <ReturnIcon />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest">
                7 Days Return
              </p>
              <p className="mt-1 text-xs text-white/55">
                Simple return within 7 days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r">
            <span className="shrink-0 text-cta">
              <PaymentIcon />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest">
                Secure Payments
              </p>
              <p className="mt-1 text-xs text-white/55">
                Safe and trusted checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-5">
            <span className="shrink-0 text-cta">
              <SupportIcon />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest">
                Customer Support
              </p>
              <p className="mt-1 text-xs text-white/55">
                We're here to help with your orders
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-container gap-10 px-4 py-12 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-12">

        {/* Company information */}
        <div>
          <a href="/" className="inline-block">
            <span className="font-serif text-2xl tracking-wide">
              STYLE <span className="text-white/55">HAVEN</span>
            </span>
          </a>

          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
            Premium fashion for men, women and kids. Curated fabrics, honest pricing,
            effortlessly modern. Sourced through vetted business partners, sold direct to you.
          </p>

          {/* Legal company identity */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-white">
              Style Haven Private Limited
            </p>
            <p className="mt-1 text-xs text-white/50">
              Operating under the consumer brand Style Haven
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm text-white/70">

            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-cta">
                <LocationIcon />
              </span>
              <span>
                FF-61, Plot No-77, K-Block,
                <br />
                Ansal Fortune Arcade, Sector 18,
                <br />
                Noida, Uttar Pradesh - 201301
              </span>
            </div>

            <a
              href="mailto:support@styleheaven.in"
              className="flex items-center gap-3 hover:text-cta"
            >
              <span className="shrink-0 text-cta">
                <MailIcon />
              </span>
              support@styleheaven.in
            </a>

            <a
              href="tel:+918527879317"
              className="flex items-center gap-3 hover:text-cta"
            >
              <span className="shrink-0 text-cta">
                <PhoneIcon />
              </span>
              +91 85278 79317
            </a>

          </div>

          {/* Social */}
          <div className="mt-6 flex gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-[11px] font-bold text-white/70 transition hover:border-cta hover:bg-white/10 hover:text-cta"
              >
                {social.label === 'Instagram' && 'IG'}
                {social.label === 'Facebook' && 'FB'}
                {social.label === 'X (Twitter)' && 'X'}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
            Shop
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li>
              <a href="/products?cat=Men" className="transition hover:text-cta">
                Men
              </a>
            </li>
            <li>
              <a href="/products?cat=Women" className="transition hover:text-cta">
                Women
              </a>
            </li>
            <li>
              <a href="/products?cat=Kids" className="transition hover:text-cta">
                Kids
              </a>
            </li>
            <li>
              <a href="/products?filter=deals" className="transition hover:text-cta">
                Deals
              </a>
            </li>
            <li>
              <a href="/products?filter=new" className="transition hover:text-cta">
                New Arrivals
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
            Support
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li>
              <a href="/shipping-returns" className="transition hover:text-cta">
                Shipping &amp; Returns
              </a>
            </li>
            <li>
              <a href="/size-guide" className="transition hover:text-cta">
                Size Guide
              </a>
            </li>
            <li>
              <a href="/track" className="transition hover:text-cta">
                Track Order
              </a>
            </li>
            <li>
              <a href="/faq" className="transition hover:text-cta">
                FAQ
              </a>
            </li>
            <li>
              <a href="/contact" className="transition hover:text-cta">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
            Company
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li>
              <a href="/about" className="transition hover:text-cta">
                About Us
              </a>
            </li>
            <li>
              <a href="/merchant" className="transition hover:text-cta">
                Become a Merchant Partner
              </a>
            </li>
            <li>
              <a href="/terms" className="transition hover:text-cta">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="transition hover:text-cta">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/40 md:flex-row md:px-8 md:text-left">
          <p>
            © {new Date().getFullYear()} Style Haven Private Limited. All rights reserved.
          </p>

          <p>
            Premium fashion. Honest pricing. Modern style.
          </p>
        </div>
      </div>

    </footer>
  );
}