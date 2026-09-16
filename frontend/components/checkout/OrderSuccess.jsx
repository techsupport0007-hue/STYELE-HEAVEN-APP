export default function OrderSuccess({ order }) {
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald/10 text-3xl text-emerald">
        {'\u2713'}
      </div>

      <h1 className="mt-6 font-serif text-3xl text-ink">
        Order placed successfully
      </h1>

      <p className="mt-2 text-sm text-muted">
        Thank you {'\u2014'} a confirmation has been sent to your email.
      </p>

      <div className="mt-6 space-y-3 rounded-2xl border border-line p-6 text-left text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted">Order ID</span>
          <span className="font-mono font-semibold text-ink">
            {order.orderId}
          </span>
        </div>

        {order.promoCodes?.length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted">Promo codes used</span>
            <span className="font-semibold text-ink">
              {order.promoCodes.join(', ')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted">Amount</span>
          <span className="font-semibold text-ink">
            {'\u20B9'}{order.pricing?.total}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={`/track/${order.orderId}`}
          className="flex h-12 items-center justify-center rounded-full bg-cta px-6 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
        >
          View / Track Order
        </a>

        <a
          href="/orders"
          className="flex h-12 items-center justify-center rounded-full border border-ink px-6 text-sm font-bold uppercase tracking-wide text-ink"
        >
          My Orders
        </a>

        <a
          href="/products"
          className="flex h-12 items-center justify-center rounded-full border border-ink px-6 text-sm font-bold uppercase tracking-wide text-ink"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}