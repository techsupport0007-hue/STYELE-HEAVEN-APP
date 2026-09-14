const STEPS = ['Customer', 'Address', 'Summary', 'Payment'];

export default function Stepper({ current }) {
  return (
    <ol className="mx-auto flex max-w-2xl items-center justify-center gap-2 px-4 py-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={`grid h-7 w-7 place-items-center border text-xs font-bold ${
                done || active ? 'border-ink bg-ink text-white' : 'border-line text-muted'
              }`}
            >
              {done ? '✓' : stepNum}
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wide ${
                active ? 'text-ink' : done ? 'text-ink' : 'text-muted'
              }`}
            >
              {label}
            </span>
            {stepNum < STEPS.length && <span className="mx-2 h-px w-8 bg-line" />}
          </li>
        );
      })}
    </ol>
  );
}
