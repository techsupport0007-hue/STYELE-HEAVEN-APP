export const metadata = { title: 'Privacy Policy — Style Haven' };

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'Account details (name, email, phone), shipping addresses, order history and, if you contact us, the details of your message. We do not collect more than we need to run your account and fulfil your orders.',
  },
  {
    title: 'How we use it',
    body: 'To process and deliver orders, provide order tracking, respond to support and merchant enquiries, and improve the site. We do not sell your personal data to third parties.',
  },
  {
    title: 'Payments',
    body: 'Card and UPI payments are processed by Stripe; we do not store your full card details on our servers.',
  },
  {
    title: 'Cookies and local storage',
    body: 'We use browser storage to keep your cart and session working across pages. This is functional, not for third-party advertising tracking.',
  },
  {
    title: 'Your choices',
    body: 'You can review and update your account details at any time, and can request deletion of your account by contacting customer support.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">
        Legal
      </p>

      <h1 className="mt-2 font-serif text-4xl text-ink">
        Privacy Policy
      </h1>

      <p className="mt-3 text-sm text-muted">
        Last updated:{' '}
        {new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
        })}
      </p>

      <div className="mt-8 border border-line p-5">
        <p className="text-sm leading-relaxed text-muted">
          This Privacy Policy explains how{' '}
          <strong className="font-semibold text-ink">
            Style Haven Private Limited
          </strong>{' '}
          collects, uses and protects information when you use the Style Haven
          website and related services.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          In this policy, “Style Haven”, “we”, “us” and “our” refer to Style
          Haven Private Limited, operating under the consumer-facing brand
          Style Haven.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-bold text-ink">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {s.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <p className="text-xs leading-relaxed text-muted">
          Style Haven Private Limited
          <br />
          Operating under the brand name Style Haven
          <br />
          Customer Support: support@styleheaven.in
        </p>
      </div>
    </div>
  );
}