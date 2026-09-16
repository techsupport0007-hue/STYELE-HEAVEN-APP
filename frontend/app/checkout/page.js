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
    hint:
      'Secure test payment. Use card 4242 4242 4242 4242, any future expiry & any CVC.',
  },
  {
    value: 'cod',
    title: 'Cash on Delivery',
    hint: 'Pay in cash when the order arrives.',
  },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [promoCodes, setPromoCodes] = useState([]);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  const [order, setOrder] = useState(null);
  const [pendingClientSecret, setPendingClientSecret] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);

  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * ---------------------------------------------------------
   * Load cart + authenticated customer
   * ---------------------------------------------------------
   */
  useEffect(() => {
    setCart(readCart());
    setCartLoaded(true);

    const token = getToken();

    if (!token) {
      setIsAuthenticated(false);
      setAuthChecking(false);
      return;
    }

    api
      .get('/auth/me')
      .then(({ data }) => {
        const user = data.user;

        setIsAuthenticated(true);

        setContact({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        });

        const userAddresses = user.addresses || [];

        setAddresses(userAddresses);

        const defaultAddress =
          userAddresses.find((address) => address.isDefault) ||
          userAddresses[0];

        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  /**
   * ---------------------------------------------------------
   * Add authenticated customer's address
   * ---------------------------------------------------------
   */
  async function handleAddAddress(form) {
    setAddingAddress(true);

    try {
      const { data } = await api.post('/auth/me/addresses', form);

      setAddresses(data.addresses);

      const added =
        data.addresses[data.addresses.length - 1];

      setSelectedAddress(added);
    } finally {
      setAddingAddress(false);
    }
  }

  /**
   * ---------------------------------------------------------
   * Checkout validation
   * ---------------------------------------------------------
   */
  const validName = contact.name.trim().length >= 2;

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      contact.email.trim()
    );

  const validPhone =
    /^[6-9]\d{9}$/.test(contact.phone.trim());

  const validAddress = Boolean(
    selectedAddress &&
      selectedAddress.street?.trim() &&
      selectedAddress.city?.trim() &&
      selectedAddress.state?.trim() &&
      /^\d{6}$/.test(
        String(selectedAddress.pincode || '').trim()
      )
  );

  const canPlaceOrder =
    isAuthenticated &&
    validName &&
    validEmail &&
    validPhone &&
    validAddress &&
    Boolean(paymentMethod);

  /**
   * ---------------------------------------------------------
   * Place order
   * ---------------------------------------------------------
   */
  async function placeOrder() {
    if (!canPlaceOrder) {
      setPlaceError(
        'Please complete all required checkout details.'
      );
      return;
    }

    setPlacing(true);
    setPlaceError('');

    try {
      const res = await createOrder({
        customer: {
          fullName: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
        },

        shippingAddress: {
          ...selectedAddress,
          fullName: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
        },

        items: cart.map((item) => ({
          productId: item.productId,
          title: item.title,
          size: item.size,
          color: item.color,
          qty: item.qty,
          price: item.price,
          offerPrice: item.offerPrice,
        })),

        promoCodes: promoCodes.map(
          (promo) => promo.code
        ),

        paymentMethod,
      });

      /**
       * COD:
       * Order is immediately successful.
       */
      if (paymentMethod === 'cod') {
        setOrder(res.order);
        writeCart([]);
        return;
      }

      /**
       * Stripe:
       * Keep order pending until payment succeeds.
       */
      setPendingOrder(res.order);
      setPendingClientSecret(res.clientSecret);
    } catch (err) {
      setPlaceError(
        err?.response?.data?.error ||
          'Could not place your order. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  }

  /**
   * ---------------------------------------------------------
   * Stripe success
   * ---------------------------------------------------------
   */
  function handleStripeSuccess() {
    writeCart([]);
    setOrder(pendingOrder);
  }

  /**
   * ---------------------------------------------------------
   * Stripe error
   * ---------------------------------------------------------
   */
  function handleStripeError(message) {
    setPlaceError(message);
  }

  /**
   * ---------------------------------------------------------
   * Authentication loading
   * ---------------------------------------------------------
   */
  if (authChecking) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-sm text-muted">
        Checking your account…
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * Login required
   * ---------------------------------------------------------
   */
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center md:px-8">
        <h1 className="font-serif text-3xl text-ink">
          Login required
        </h1>

        <p className="mt-3 text-sm text-muted">
          Please login to your Style Haven account before
          placing an order.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/login?redirect=/checkout"
            className="flex h-12 items-center justify-center rounded-full bg-cta px-7 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
          >
            Login
          </a>

          <a
            href="/signup?redirect=/checkout"
            className="flex h-12 items-center justify-center rounded-full border border-ink px-7 text-sm font-bold uppercase tracking-wide text-ink"
          >
            Create Account
          </a>
        </div>
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * Order success
   * ---------------------------------------------------------
   */
  if (order) {
    return (
      <OrderSuccess order={order} />
    );
  }

  /**
   * ---------------------------------------------------------
   * Cart loading
   * ---------------------------------------------------------
   */
  if (!cartLoaded) {
    return null;
  }

  /**
   * ---------------------------------------------------------
   * Empty cart
   * ---------------------------------------------------------
   */
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-ink">
          Your cart is empty
        </h1>

        <a
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-cta px-7 text-sm font-bold uppercase tracking-wide text-ink"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * Stripe payment step
   * ---------------------------------------------------------
   */
  if (pendingOrder && pendingClientSecret) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 md:px-8">
        <h1 className="font-serif text-3xl text-ink">
          Complete Payment
        </h1>

        <p className="mt-2 text-sm text-muted">
          Order ID:{' '}
          <span className="font-mono font-semibold text-ink">
            {pendingOrder.orderId}
          </span>
        </p>

        <div className="mt-8">
          <StripePaymentForm
            clientSecret={pendingClientSecret}
            order={pendingOrder}
            onSuccess={handleStripeSuccess}
            onError={handleStripeError}
          />
        </div>

        {placeError && (
          <p className="mt-4 text-sm font-semibold text-sale">
            {placeError}
          </p>
        )}
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * Main checkout
   * ---------------------------------------------------------
   */
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <ProgressTracker currentStep="CHECKOUT" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Customer Information */}
          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-serif text-2xl text-ink">
              Customer Information
            </h2>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-sm font-semibold text-ink">
                  Full Name{' '}
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) =>
                    setContact((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-ink">
                  Email{' '}
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-ink">
                  Mobile Number{' '}
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact((current) => ({
                      ...current,
                      phone: e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 10),
                    }))
                  }
                  required
                  inputMode="numeric"
                  maxLength={10}
                  className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-serif text-2xl text-ink">
              Delivery Address
            </h2>

            <div className="mt-6">
              <AddressSelector
                addresses={addresses}
                selectedId={selectedAddress?._id}
                onSelect={(address) =>
                  setSelectedAddress(address)
                }
                onAddAddress={handleAddAddress}
                adding={addingAddress}
              />
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-2xl border border-line p-6">
            <h2 className="font-serif text-2xl text-ink">
              Payment Method
            </h2>

            <div className="mt-6 space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`block cursor-pointer rounded-xl border p-4 ${
                    paymentMethod === method.value
                      ? 'border-ink'
                      : 'border-line'
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={
                        paymentMethod === method.value
                      }
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                    />

                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {method.title}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {method.hint}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {placeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {placeError}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside>
          <OrderSummarySidebar
            cart={cart}
            promoCodes={promoCodes}
            setPromoCodes={setPromoCodes}
            onPlaceOrder={placeOrder}
            placing={placing}
            canPlaceOrder={canPlaceOrder}
          />
        </aside>
      </div>
    </div>
  );
}