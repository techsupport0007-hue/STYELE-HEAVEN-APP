const MESSAGES = [
  'SEASON EDIT — UP TO 40% OFF',
  'FREE DELIVERY ON ALL ORDERS',
  'NEW ARRIVALS EVERY WEEK',
  'BECOME A STYLE HAVEN MERCHANT PARTNER',
];

export default function Ticker() {
  const items = [...MESSAGES, ...MESSAGES];
  return (
    <div className="w-full overflow-hidden bg-ink text-white" aria-label="Store highlights">
      <div className="ticker-track py-2.5">
        {items.map((m, i) => (
          <span
            key={i}
            className="whitespace-nowrap px-6 text-[11px] font-bold tracking-[0.14em] uppercase after:content-['◆'] after:ml-6 after:text-white/40"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
