export default function SavingsBadge({ amount, pct }: { amount: number; pct: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success">
      ↓ Save ₹{amount} · {pct}% off
    </span>
  );
}
