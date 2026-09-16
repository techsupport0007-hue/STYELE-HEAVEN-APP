'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/useAuth';

const STATUS_COLORS = {
  Processing: 'bg-cta/20 text-cta-deep',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald/10 text-emerald',
  Cancelled: 'bg-sale/10 text-sale',
};

export default function OrdersPage() {
  const [state, setState] = useState({
    orders: [],
    loading: true,
    needsLogin: false,
    error: '',
  });

  useEffect(() => {
    if (!getToken()) {
      setState({
        orders: [],
        loading: false,
        needsLogin: true,
        error: '',
      });
      return;
    }

    api
      .get('/orders/mine')
      .then(({ data }) =>
        setState({
          orders: data.orders,
          loading: false,
          needsLogin: false,
          error: '',
        })
      )
      .catch((err) =>
        setState({
          orders: [],
          loading: false,
          needsLogin: err?.response?.status === 401,
          error:
            err?.response?.data?.error ||
            'Could not load your orders.',
        })
      );
  }, []);

  if (state.needsLogin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">
          Log in to see your orders
        </h1>

        <a
          href="/login"
          className="mt-6 inline-block h-11 rounded-full bg-cta px-6 leading-[44px] text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep"
        >
          Log in
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 md:px-8">
      <h1 className="font-serif text-3xl text-ink">
        My Orders
      </h1>

      {state.loading && (
        <p className="mt-8 text-sm text-muted">
          Loading...
        </p>
      )}

      {state.error && (
        <p className="mt-8 text-sm text-sale">
          {state.error}
        </p>
      )}

      {!state.loading &&
        !state.error &&
        state.orders.length === 0 && (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center text-sm text-muted">
            No orders yet.{' '}
            <a
              href="/products"
              className="font-semibold text-emerald underline"
            >
              Start shopping
            </a>
            .
          </div>
        )}

      <div className="mt-8 space-y-4">
        {state.orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-line p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-ink">
                  {order.orderId}
                </p>

                <p className="text-xs text-muted">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  STATUS_COLORS[order.orderStatus] ||
                  'bg-surface text-muted'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted">
              {order.items?.length || 0}{' '}
              item{order.items?.length === 1 ? '' : 's'}{' '}
              · ₹{order.pricing?.total}
            </p>

            <a
              href={`/track/${order.orderId}`}
              className="mt-3 inline-block text-xs font-bold text-emerald underline"
            >
              View / Track Order →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}