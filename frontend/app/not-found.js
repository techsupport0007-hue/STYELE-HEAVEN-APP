export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Error 404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">This page doesn&apos;t exist.</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        The page you&apos;re looking for may have moved or the link may be out of date.
        Here are some places to go instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="/" className="flex h-11 items-center rounded-full bg-cta px-6 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep">
          Go home
        </a>
        <a href="/products" className="flex h-11 items-center rounded-full border border-ink px-6 text-sm font-bold uppercase tracking-wide text-ink">
          Shop the collection
        </a>
        <a href="/contact" className="flex h-11 items-center rounded-full border border-ink px-6 text-sm font-bold uppercase tracking-wide text-ink">
          Contact support
        </a>
      </div>
    </div>
  );
}
