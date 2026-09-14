export const metadata = { title: 'Shipping & Returns — Style Heaven' };

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Support</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Shipping &amp; Returns</h1>

      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">Shipping</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          <li>• Free delivery on orders above ₹1999; a flat ₹100 delivery fee applies below that.</li>
          <li>• Typical delivery time is 3–5 business days depending on your pincode.</li>
          <li>• You can check delivery availability for your pincode on any product page.</li>
          <li>• Once shipped, you&apos;ll get an order ID and tracking ID — track your order any time.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">Returns &amp; exchanges</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          <li>• Most items can be returned within 7 days of delivery, unused and with original tags.</li>
          <li>• Size exchanges are free — start a return request from your order history.</li>
          <li>• Refunds are issued to the original payment method within 5–7 business days of us receiving the item.</li>
          <li>• Cash on Delivery refunds are processed via bank transfer or store credit.</li>
        </ul>
      </section>

      <div className="mt-10 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
        Questions about a specific order? <a href="/contact" className="font-semibold text-emerald underline">Contact customer support</a>.
      </div>
    </div>
  );
}
