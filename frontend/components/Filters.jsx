'use client';

const QUICK_FILTERS = [
  { label: 'All', value: '' },
  { label: 'New Arrivals', value: 'new' },
  { label: 'On Sale', value: 'deals' },
  { label: 'Bestsellers', value: 'bestsellers' },
];

const SORT_OPTIONS = [
  { label: 'Featured', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function Filters({ filter, sort, onFilterChange, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              filter === f.value ? 'border-ink bg-ink text-white' : 'border-line hover:bg-surface'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Sort
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-full border border-line bg-white px-3 py-1.5 text-ink"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
