export default function HomePage() {
  return (
    <div className="relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200 sm:aspect-[16/10] lg:aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/4541910/pexels-photo-4541910.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Style Haven — winter edit"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-container px-4 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              The Winter Edit
            </p>

            <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[1.05] text-white md:text-6xl">
              Considered Style, Delivered.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85">
              Discover premium fashion for men, women and kids. Curated fabrics, honest pricing,
              effortlessly modern.
            </p>

            <div className="mt-6 inline-flex items-center border border-white/70 bg-black/20 px-3 py-2 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Free Delivery on All Orders
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/products"
                className="flex h-12 items-center rounded-full bg-cta px-7 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
              >
                Shop the collection
              </a>

              <a
                href="/products?filter=deals"
                className="flex h-12 items-center border border-white px-7 text-sm font-bold uppercase tracking-wide text-white"
              >
                Deals up to 40% off
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
