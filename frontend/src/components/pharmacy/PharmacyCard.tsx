import { motion } from "framer-motion";
import { Clock, Navigation, TrendingDown } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { MagneticButton } from "@/components/common/MagneticButton";
import type { Pharmacy } from "@/data/mockPharmacies";

export default function PharmacyCard({ p }: { p: Pharmacy }) {
  const highlight = p.cheapest;
  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia("(hover: none)").matches;
  };

  const cardContent = (
    <div
      className={`relative rounded-xl p-3 shadow-sm border border-border/50 h-full ${
        highlight ? "bg-primary-light/40 border-primary" : "bg-white"
      }`}
    >
      {highlight && (
        <div className="absolute -top-2.5 left-3 z-10 flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lifted">
          <TrendingDown className="h-2.5 w-2.5" /> Best Price
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
        {!isTouchDevice() ? (
          <MagneticButton>
            <a
              href={p.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-light/50 shadow-sm transition-colors"
            >
              <Navigation className="h-3 w-3" /> Directions
            </a>
          </MagneticButton>
        ) : (
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={p.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary active:bg-primary-light/50 shadow-sm"
          >
            <Navigation className="h-3 w-3" /> Directions
          </motion.a>
        )}

      </div>
    </div>
  );

  return !isTouchDevice() ? (
    <TiltCard className="h-full">
      {cardContent}
    </TiltCard>
  ) : (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  );
}
