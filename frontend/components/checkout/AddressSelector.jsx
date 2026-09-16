'use client';

import { useState } from 'react';

const EMPTY_FORM = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
};

export default function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddAddress,
  adding,
}) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [form, setForm] = useState(EMPTY_FORM);

  function set(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function valid() {
    return (
      form.street.trim() &&
      form.city.trim() &&
      form.state.trim() &&
      /^\d{6}$/.test(form.pincode)
    );
  }

  async function handleAdd(e) {
    e.preventDefault();

    if (!valid()) {
      return;
    }

    await onAddAddress({
      ...form,
      pincode: form.pincode.trim(),
    });

    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  return (
    <div>
      {/* Saved Addresses */}
      <div className="space-y-3">
        {addresses.map((address) => (
          <label
            key={address._id || address.street}
            className={`block cursor-pointer rounded-xl border p-4 ${
              selectedId === address._id
                ? 'border-ink'
                : 'border-line'
            }`}
          >
            <div className="flex gap-3">
              <input
                type="radio"
                name="deliveryAddress"
                checked={selectedId === address._id}
                onChange={() => onSelect(address)}
                className="mt-1"
              />

              <div>
                <p className="text-sm font-semibold text-ink">
                  {address.label || 'Address'}
                </p>

                <p className="mt-1 text-sm text-muted">
                  {address.street}, {address.city},{' '}
                  {address.state} — {address.pincode}
                  {address.landmark
                    ? ` · Near ${address.landmark}`
                    : ''}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Add Address */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 text-sm font-bold text-ink underline"
        >
          + Add New Address
        </button>
      ) : (
        <form
          onSubmit={handleAdd}
          className="mt-4 rounded-xl border border-line p-5"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Street */}
            <div className="col-span-2">
              <label className="text-sm font-semibold text-ink">
                Street Address{' '}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={form.street}
                onChange={(e) =>
                  set('street', e.target.value)
                }
                required
                autoComplete="street-address"
                className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                placeholder="House / Flat / Street / Area"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-ink">
                City{' '}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={form.city}
                onChange={(e) =>
                  set('city', e.target.value)
                }
                required
                autoComplete="address-level2"
                className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                placeholder="City"
              />
            </div>

            {/* PIN */}
            <div>
              <label className="text-sm font-semibold text-ink">
                PIN Code{' '}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={form.pincode}
                onChange={(e) =>
                  set(
                    'pincode',
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                autoComplete="postal-code"
                className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                placeholder="6-digit PIN"
              />
            </div>

            {/* State */}
            <div className="col-span-2">
              <label className="text-sm font-semibold text-ink">
                State{' '}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                value={form.state}
                onChange={(e) =>
                  set('state', e.target.value)
                }
                required
                autoComplete="address-level1"
                className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                placeholder="State"
              />
            </div>

            {/* Landmark */}
            <div className="col-span-2">
              <label className="text-sm font-semibold text-ink">
                Landmark{' '}
                <span className="font-normal text-muted">
                  (optional)
                </span>
              </label>

              <input
                type="text"
                value={form.landmark}
                onChange={(e) =>
                  set('landmark', e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-ink"
                placeholder="Nearby landmark"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={adding || !valid()}
              className="h-11 rounded-full bg-cta px-6 text-sm font-bold uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adding ? 'Saving…' : 'Save Address'}
            </button>

            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                }}
                className="h-11 rounded-full border border-ink px-6 text-sm font-bold uppercase tracking-wide text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}