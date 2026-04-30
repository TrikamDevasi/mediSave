import { motion } from "framer-motion";
import { Clock, Navigation } from "lucide-react";
import type { Pharmacy } from "@/data/mockPharmacies";

export default function PharmacyCard({ p }: { p: Pharmacy }) {
  const highlight = p.cheapest;
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      className={`relative rounded-xl p-3 shadow-sm transition-shadow hover:shadow-md ${
        highlight ? "bg-primary-light/40 border border-primary" : "bg-white"
      }`}
    >
      {highlight && (
        <div className="absolute -top-2 left-3 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-white shadow">
          ✓ Cheapest for your prescription
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-sm font-bold text-primary">
          {p.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{p.name}</span>
            {p.janAushadhi && (
              <span className="rounded-full bg-warning px-1.5 py-0.5 text-[9px] font-semibold text-white">
                🏛
              </span>
            )}
          </div>
          <div className="text-xs text-mutedfg">
            {p.distanceKm} km · {p.walkMin} min walk
          </div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-success">
            <Clock className="h-3 w-3" /> Open · Closes at {p.closesAt}
          </div>
        </div>
        <button className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light/50">
          <Navigation className="h-3 w-3" /> Directions
        </button>
      </div>
    </motion.div>
  );
}
