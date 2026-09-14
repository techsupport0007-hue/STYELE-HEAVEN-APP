'use client';

import { useEffect, useState } from 'react';
import ProgressTracker from '@/components/checkout/ProgressTracker';
import AddressSelector from '@/components/checkout/AddressSelector';
import OrderSummarySidebar from '@/components/checkout/OrderSummarySidebar';
import OrderSuccess from '@/components/checkout/OrderSuccess';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';
import { readCart, writeCart } from '@/lib/useCartCount';
import { createOrder, api } from '@/lib/api';
import { getToken } from '@/lib/useAuth';

const PAYMENT_METHODS = [
  {
    value: 'stripe',
    title: 'Card / UPI / Net Banking — Stripe (Test Mode)',
    hint: 'Secure test payment. Use card 4242 4242 4242 4242, any future expiry & any CVC.',
  },
  { value: 'cod', title: 'Cash on Delivery', hint: 'Pay in cash when the order arrives.' },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [contact, setContact] = useState({ email: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [promoCodes, setPromoCodes] = useState([]);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [order, setOrder] = useState(null);
  const [pendingClientSecret, setPendingClientSecret] = useState(null); // set once a Stripe order is created but not yet paid
  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    setCart(readCart());
    setCartLoaded(true);

    if (getToken()) {
      api
        .get('/auth/me')
        .then(({ data }) => {
          setContact({ email: data.user.email || '', phone: data.user.phone || '' });
          setAddresses(data.user.addresses || []);
          const def = (data.user.addresses || []).find((a) => a.isDefault) || data.user.addresses?.[0];
          if (def) setSelectedAddress(def);
        })
        .catch(() => {});
    }
  }, []);

  async function handleAddAddress(form) {
    setAddingAddress(true);
    try {
      if (getToken()) {
        const { data } = await api.post('/auth/me/addresses', form);
        setAddresses(data.addresses);
        const added = data.addresses[data.addresses.length - 1];
        setSelectedAddress(added);
      } else {
        // Guest checkout: keep the address local to this order only.
        const guestAddress = { ...form, _id: 'guest-address' };
        setAddresses([guestAddress]);
        setSelectedAddress(guestAddress);
      }
    } finally {
      setAddingAddress(false);
    }
  }

  const canPlaceOrder = Boolean(
    contact.email.trim() && /^[6-9]\d{9}$/.test(contact.phone) && selectedAddress && paymentMethod
  );

  async function placeOrder(total) {
    if (!canPlaceOrder) return;
    setPlacing(true);
    setPlaceError('');
    try {
      const res = await createOrder({
        customer: { email: contact.email, phone: contact.phone },
        shippingAddress: { ...selectedAddress, email: contact.email, phone: contact.phone },
        items: cart.map((i) => ({
          productId: i.productId,
          title: i.title,
          size: i.size,
          color: i.color,
          qty: i.qty,
          price: i.price,
          offerPrice: i.offerPrice,
        })),
        promoCodes: promoCodes.map((p) => p.code),
        paymentMethod,
      });

      if (paymentMethod === 'cod') {
        // No payment to collect — the order is placed immediately.
        setOrder(res.order);
        writeCart([]);
      } else {
        // Card payment: the order now exists (paymentStatus: 'pending') and
        // Stripe has a real PaymentIntent waiting for card details — hand
        // off to StripePaymentForm to actually collect and confirm payment.
        // The cart is only cleared once payment is confirmed below.
        setPendingOrder(res.order);
        setPendingClientSecret(res.clientSecret);
      }
    } catch (err) {
      setPlaceError(err?.response?.data?.error || 'Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  function handleStripeSuccess() {
    writeCart([]);
    setOrder(pendingOrder);
  }

  function handleStripeError(msg) {
    setPlaceError(msg);
  }

  if (order) {
    return (
      <div className="mx-auto max-w-container px-4">
        <ProgressTracker current={3} />
        <OrderSuccess order={order} />
      </div>
    );
  }

  if (!cartLoaded) return null;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-container px-4 py-20 text-center text-muted">
        Your bag is empty. <a href="/products" className="font-semibold text-emerald underline">Continue shopping</a>.
      </div>
    );
  }

  // Card payment in progress: the order exists, now collect and confirm
  // the actual charge before showing the success screen.
  if (pendingOrder && pendingClientSecret) {
    return (
      <div className="mx-auto max-w-lg px-4 pb-16 md:px-8">
        <ProgressTracker current={2} />
        <h1 className="mb-2 text-center font-serif text-3xl text-ink">Enter payment details</h1>
        <p className="mb-6 text-center text-sm text-muted">
          Order {pendingOrder.orderId} — complete payment to confirm it.
        </p>
        {placeError && (
          <p className="mb-4 rounded-xl border border-sale/40 bg-red-50 px-4 py-3 text-center text-sm text-sale">
            {placeError}
          </p>
        )}
        <div className="rounded-xl border border-line p-5">
          <StripePaymentForm
            clientSecret={pendingClientSecret}
            onSuccess={handleStripeSuccess}
            onError={handleStripeError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-8">
      <ProgressTracker current={2} />
      <h1 className="mb-8 text-center font-serif text-3xl text-ink">Checkout</h1>

      {placeError && (
        <p className="mx-auto mb-6 max-w-lg rounded-xl border border-sale/40 bg-red-50 px-4 py-3 text-center text-sm text-sale">
          {placeError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column — main flow */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-ink">Contact Info</h2>
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-line p-5">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  className="input-underline"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  maxLength={10}
                  className="input-underline"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-ink">Delivery Address</h2>
            <AddressSelector
              addresses={addresses}
              selectedId={selectedAddress?._id || selectedAddress?.street}
              onSelect={setSelectedAddress}
              onAddAddress={handleAddAddress}
              adding={addingAddress}
            />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-ink">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`block cursor-pointer rounded-xl border p-4 transition ${
                    paymentMethod === m.value ? 'border-emerald bg-emerald/5' : 'border-line hover:border-ink'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="mt-1 accent-emerald"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{m.title}</p>
                      <p className="mt-1 text-xs text-muted">{m.hint}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right column — sticky order summary */}
        <OrderSummarySidebar
          cart={cart}
          promoCodes={promoCodes}
          onPromoCodesChange={setPromoCodes}
          onPlaceOrder={placeOrder}
          placing={placing}
          canPlaceOrder={canPlaceOrder}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
}
