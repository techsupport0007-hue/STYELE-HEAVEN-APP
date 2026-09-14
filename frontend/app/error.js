'use client';

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Something went wrong</p>
      <h1 className="mt-3 font-serif text-3xl text-ink">We hit a snag loading this page.</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Please try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="flex h-11 items-center rounded-full bg-cta px-6 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
        >
          Try again
        </button>
        <a href="/" className="flex h-11 items-center rounded-full border border-ink px-6 text-sm font-bold uppercase tracking-wide text-ink">
          Go home
        </a>
      </div>
    </div>
  );
}
