/** Decorative panel — light, no colored fill. */
export function HeroImage() {
  return (
    <div className="relative">
      <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl border border-border bg-slate-50 p-8">
        <div className="relative text-primary">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            YourHomeCare
          </p>
          <p className="mt-3 max-w-xs text-2xl font-semibold leading-snug">
            Compassionate care, delivered at home.
          </p>
        </div>
      </div>
    </div>
  );
}