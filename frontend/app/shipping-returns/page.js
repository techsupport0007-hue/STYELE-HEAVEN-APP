export const metadata = {
  title: 'Shipping & Returns — Style Haven',
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">
        Support
      </p>

      <h1 className="mt-2 font-serif text-4xl text-ink">
        Shipping &amp; Returns
      </h1>

      <div className="mt-8 border border-line p-5">
        <p className="text-sm leading-relaxed text-muted">
          Shipping, returns and exchanges for purchases made through Style
          Haven are provided by{' '}
          <strong className="font-semibold text-ink">
            Style Haven Private Limited
          </strong>
          , operating under the consumer brand Style Haven.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">
          Shipping
        </h2>

        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          <li>
            {'\u2022'} Free delivery on all orders.
          </li>

          <li>
            {'\u2022'} Typical delivery time is 3{'\u2013'}5 business days
            depending on your pincode.
          </li>

          <li>
            {'\u2022'} You can check delivery availability for your
            pincode on any product page.
          </li>

          <li>
            {'\u2022'} Once shipped, your Order ID remains available in
            your order history. Use the same Order ID to track
            your order at any time.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">
          Returns &amp; exchanges
        </h2>

        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          <li>
            {'\u2022'} Most items can be returned within 7 days of
            delivery, unused and with original tags.
          </li>

          <li>
            {'\u2022'} Size exchanges are free {'\u2014'} start a return request
            from your order history.
          </li>

          <li>
            {'\u2022'} Refunds are issued to the original payment method
            within 5{'\u2013'}7 business days of us receiving the item.
          </li>

          <li>
            {'\u2022'} Cash on Delivery refunds are processed via bank
            transfer or store credit.
          </li>
        </ul>
      </section>

      <div className="mt-10 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
        Questions about a specific order?{' '}
        <a
          href="/contact"
          className="font-semibold text-emerald underline"
        >
          Contact customer support
        </a>
        .
      </div>

      <div className="mt-8 border-t border-line pt-6">
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
