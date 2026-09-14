'use client';

import { useState } from 'react';

export default function AddressSelector({ addresses, selectedId, onSelect, onAddAddress, adding }) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', landmark: '' });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function valid() {
    return form.street.trim() && form.city.trim() && form.state.trim() && /^\d{6}$/.test(form.pincode);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!valid()) return;
    await onAddAddress(form);
    setForm({ label: 'Home', street: '', city: '', state: '', pincode: '', landmark: '' });
    setShowForm(false);
  }

  return (
    <div>
      <div className="space-y-3">
        {addresses.map((a) => (
          <label
            key={a._id || a.street}
            className={`block cursor-pointer rounded-xl border p-4 transition ${
              selectedId === (a._id || a.street) ? 'border-emerald bg-emerald/5' : 'border-line hover:border-ink'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="deliveryAddress"
                checked={selectedId === (a._id || a.street)}
                onChange={() => onSelect(a)}
                className="mt-1 accent-emerald"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">{a.label || 'Address'}</span>
                  {a.isDefault && (
                    <span className="rounded-full bg-cta/20 px-2 py-0.5 text-[10px] font-bold uppercase text-cta-deep">Primary</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {a.street}, {a.city}, {a.state} — {a.pincode}
                  {a.landmark ? ` · Near ${a.landmark}` : ''}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-3 h-11 w-full rounded-xl border border-dashed border-line text-sm font-bold text-ink hover:border-ink"
        >
          + Add New Address
        </button>
      ) : (
        <form onSubmit={handleAdd} className="mt-4 space-y-4 rounded-xl border border-line p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Street address</label>
              <input className="input-underline" value={form.street} onChange={(e) => set('street', e.target.value)} placeholder="House / Flat / Building / Street" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide">City</label>
              <input className="input-underline" value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Pincode</label>
              <input className="input-underline" maxLength={6} value={form.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide">State</label>
              <input className="input-underline" value={form.state} onChange={(e) => set('state', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide">
                Landmark <span className="normal-case text-muted">(optional)</span>
              </label>
              <input className="input-underline" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            {addresses.length > 0 && (
              <button type="button" onClick={() => setShowForm(false)} className="h-10 flex-1 rounded-full border border-line text-xs font-bold uppercase tracking-wide text-muted">
                Cancel
              </button>
            )}
            <button
              disabled={!valid() || adding}
              className="h-10 flex-1 rounded-full bg-ink text-xs font-bold uppercase tracking-wide text-white disabled:opacity-40"
            >
              {adding ? 'Saving…' : 'Save & use this address'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
