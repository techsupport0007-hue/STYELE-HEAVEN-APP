const STEPS = ['Cart', 'Checkout', 'Payment'];

export default function ProgressTracker({ current }) {
  // current: 1 (Cart, informational — already passed), 2 (Checkout, this page), 3 (Payment/confirming)
  return (
    <ol className="mx-auto flex max-w-md items-center justify-center gap-2 px-4 pb-8 pt-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold ${
                  done ? 'border-emerald bg-emerald text-white' : active ? 'border-ink bg-ink text-white' : 'border-line text-muted'
                }`}
              >
                {done ? '✓' : stepNum}
              </div>
              <span className={`mt-1.5 text-[11px] font-bold uppercase tracking-wide ${active || done ? 'text-ink' : 'text-muted'}`}>
                {label}
              </span>
            </div>
            {stepNum < STEPS.length && (
              <div className={`mx-2 h-0.5 flex-1 ${stepNum < current ? 'bg-emerald' : 'bg-line'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
