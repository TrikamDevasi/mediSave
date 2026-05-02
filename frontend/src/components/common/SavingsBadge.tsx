export default function SavingsBadge({ amount, pct }: { amount: number; pct: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-0.5 text-[10px] font-bold text-success border border-success/20 uppercase tracking-tight">
      ↓ Save ₹{amount} · {pct}% off
    </span>
  );
}
