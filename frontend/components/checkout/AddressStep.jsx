'use client';

export default function AddressStep({ data, onChange, onNext }) {
  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  function valid() {
    return (
      data.street?.trim() &&
      /^\d{6}$/.test(data.pincode || '') &&
      data.city?.trim() &&
      data.state?.trim()
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Street address</label>
          <input
            className="input-underline"
            value={data.street || ''}
            onChange={(e) => set('street', e.target.value)}
            placeholder="House / Flat / Building / Street"
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">City</label>
          <input
            className="input-underline"
            value={data.city || ''}
            onChange={(e) => set('city', e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Pincode</label>
          <input
            className="input-underline"
            maxLength={6}
            value={data.pincode || ''}
            onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">State</label>
          <input
            className="input-underline"
            value={data.state || ''}
            onChange={(e) => set('state', e.target.value)}
            required
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">
            Landmark <span className="normal-case text-muted">(optional)</span>
          </label>
          <input
            className="input-underline"
            value={data.landmark || ''}
            onChange={(e) => set('landmark', e.target.value)}
            placeholder="Nearby landmark to help the delivery partner"
          />
        </div>
      </div>
      <button
        disabled={!valid()}
        onClick={onNext}
        className="mt-8 h-12 rounded-full bg-cta px-10 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-30"
      >
        Continue →
      </button>
    </>
  );
}
