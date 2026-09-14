export const metadata = { title: 'Terms of Service — Style Heaven' };

const SECTIONS = [
  {
    title: 'Using this site',
    body: 'By placing an order on Style Heaven you confirm the information you provide — contact details, shipping address and payment details — is accurate and belongs to you or someone who has authorised you to use it.',
  },
  {
    title: 'Pricing and offers',
    body: 'Prices are shown in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. MRP and offer pricing shown at checkout is final at the time of order confirmation; prices may change between visits.',
  },
  {
    title: 'Orders and payment',
    body: 'Orders are confirmed once payment is authorised (card/UPI/wallet) or once a Cash on Delivery order is placed. We reserve the right to cancel an order if an item goes out of stock before dispatch, with a full refund where payment was already collected.',
  },
  {
    title: 'Cancellations',
    body: 'Orders can be cancelled from your account before the item is shipped. Once shipped, please refer to our Shipping & Returns policy.',
  },
  {
    title: 'Account responsibility',
    body: 'You are responsible for keeping your account credentials confidential and for all activity under your account.',
  },
  {
    title: 'Changes to these terms',
    body: 'We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.',
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Legal</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-bold text-ink">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
