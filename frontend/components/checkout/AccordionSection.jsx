'use client';

export default function AccordionSection({ index, title, status, open, onToggle, children }) {
  // status: 'locked' | 'active' | 'done'
  const locked = status === 'locked';

  return (
    <div className={`overflow-hidden rounded-2xl border ${open ? 'border-emerald' : 'border-line'} bg-white`}>
      <button
        type="button"
        disabled={locked}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-3">
          <span
            className={`grid h-7 w-7 flex-none place-items-center rounded-full text-xs font-bold ${
              status === 'done'
                ? 'bg-emerald text-white'
                : status === 'active'
                ? 'bg-ink text-white'
                : 'bg-surface text-muted'
            }`}
          >
            {status === 'done' ? '✓' : index}
          </span>
          <span className={`text-sm font-bold uppercase tracking-wide ${locked ? 'text-muted' : 'text-ink'}`}>
            {title}
          </span>
        </span>
        <span className={`text-lg text-muted transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      {open && <div className="border-t border-line px-5 py-6">{children}</div>}
    </div>
  );
}
