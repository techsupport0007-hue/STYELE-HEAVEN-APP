export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">About</p>
      <h1 className="mt-2 font-serif text-4xl">Considered style, delivered.</h1>
      <p className="mt-5 text-sm leading-relaxed text-muted">
        Style Heaven is an Indian fashion retail brand built around a simple idea: make it easier
        to find clothes and accessories that look good, feel dependable and fit naturally into
        everyday life.
      </p>

      <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
        <div className="border border-line p-6">
          <h3 className="text-sm font-bold">Fabric first</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            We pay attention to the feel and fall of a fabric before it becomes part of a
            collection.
          </p>
        </div>
        <div className="border border-line p-6">
          <h3 className="text-sm font-bold">Useful design</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Collections shaped around real wardrobes — work, travel, weekends and festive
            dressing.
          </p>
        </div>
        <div className="border border-line p-6">
          <h3 className="text-sm font-bold">Clear shopping</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Product info, Indian sizing, payment choices and support kept straightforward.
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm leading-relaxed text-muted">
        Style Heaven runs a direct-to-consumer (B2C) store. We source our collections through a
        dedicated B2B channel — buying from vetted business partners — and sell the resulting
        curated catalogue to individual customers on this site.
      </p>
    </div>
  );
}
