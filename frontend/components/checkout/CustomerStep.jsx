'use client';

export default function CustomerStep({ data, onChange, onNext }) {
  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  function valid() {
    return (
      data.email?.includes('@') &&
      /^[6-9]\d{9}$/.test(data.phone || '') &&
      data.firstName?.trim() &&
      data.lastName?.trim()
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">First name</label>
          <input
            className="input-underline"
            value={data.firstName || ''}
            onChange={(e) => set('firstName', e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Last name</label>
          <input
            className="input-underline"
            value={data.lastName || ''}
            onChange={(e) => set('lastName', e.target.value)}
            required
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Email</label>
          <input
            type="email"
            className="input-underline"
            value={data.email || ''}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide">Phone</label>
          <input
            type="tel"
            maxLength={10}
            className="input-underline"
            value={data.phone || ''}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            required
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
