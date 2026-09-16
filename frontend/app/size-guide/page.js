const TOPWEAR = [
  { size: 'S', chest: '38 in', length: '27 in' },
  { size: 'M', chest: '40 in', length: '28 in' },
  { size: 'L', chest: '42 in', length: '29 in' },
  { size: 'XL', chest: '44 in', length: '30 in' },
];

const FOOTWEAR = [
  { uk: '6', eu: '40', cm: '25.5' },
  { uk: '7', eu: '41', cm: '26.5' },
  { uk: '8', eu: '42', cm: '27.5' },
  { uk: '9', eu: '43', cm: '28.5' },
  { uk: '10', eu: '44', cm: '29.5' },
  { uk: '11', eu: '45', cm: '30.5' },
];

export const metadata = { title: 'Size Guide — Style Haven' };

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Support</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Size Guide</h1>
      <p className="mt-3 text-sm text-muted">
        Every product page also links to its own size guide with fit notes for that item.
      </p>

      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">Topwear (shirts, tees)</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5">Size</th>
                <th className="px-4 py-2.5">Chest</th>
                <th className="px-4 py-2.5">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {TOPWEAR.map((r) => (
                <tr key={r.size}>
                  <td className="px-4 py-2.5 font-semibold text-ink">{r.size}</td>
                  <td className="px-4 py-2.5 text-muted">{r.chest}</td>
                  <td className="px-4 py-2.5 text-muted">{r.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">Footwear</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5">UK</th>
                <th className="px-4 py-2.5">EU</th>
                <th className="px-4 py-2.5">Foot length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {FOOTWEAR.map((r) => (
                <tr key={r.uk}>
                  <td className="px-4 py-2.5 font-semibold text-ink">{r.uk}</td>
                  <td className="px-4 py-2.5 text-muted">{r.eu}</td>
                  <td className="px-4 py-2.5 text-muted">{r.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
