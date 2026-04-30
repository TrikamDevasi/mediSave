import { motion } from "framer-motion";
import { Check } from "lucide-react";
import JanAushadhiBadge from "@/components/common/JanAushadhiBadge";

export default function GenericCard({
  name,
  manufacturer,
  price,
  savingsPct,
  recommended,
  janAushadhi,
}: {
  name: string;
  manufacturer: string;
  price: number;
  savingsPct: number;
  recommended?: boolean;
  janAushadhi?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-foreground">
            {janAushadhi && "🏛 "}
            {name}
          </div>
          <div className="text-xs text-mutedfg">{manufacturer}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {recommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[11px] font-semibold text-white">
                <Check className="h-3 w-3" /> Recommended
              </span>
            )}
            {janAushadhi && <JanAushadhiBadge />}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold tabular-nums text-primary">₹{price}</div>
          <div className="text-[11px] text-mutedfg">/strip</div>
          <div className="mt-1 inline-flex rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
            {savingsPct}% cheaper
          </div>
        </div>
      </div>
    </motion.div>
  );
}
