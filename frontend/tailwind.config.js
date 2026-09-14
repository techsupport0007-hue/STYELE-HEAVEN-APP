/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // "ink" kept as the class name used across ~20 components,
        // but redefined from near-black to a rich navy — removes
        // the dark/black theme without needing a find-replace of
        // every bg-ink/text-ink/border-ink usage.
        ink: '#16213E',
        'ink-soft': '#2E3A5C',
        paper: '#F9F9FB',
        cream: '#F9F9FB',
        surface: '#F1F1F6',
        line: '#E4E4EC',
        muted: '#6B7280',
        slate: '#64748B',
        emerald: '#0F6650',
        sale: '#E5484D',
        success: '#0F9D66',
        // Warm CTA accent — used only for primary action buttons,
        // never for structural chrome (nav/footer/badges stay navy).
        cta: '#F5A623',
        'cta-deep': '#D98C0F',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        container: '1360px',
      },
      aspectRatio: {
        product: '3 / 4',
      },
      zIndex: {
        nav: '1000',
        drawer: '1100',
        toast: '1200',
      },
    },
  },
  plugins: [],
};
