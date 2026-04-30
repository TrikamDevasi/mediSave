import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import SavingsBadge from "@/components/common/SavingsBadge";
import JanAushadhiBadge from "@/components/common/JanAushadhiBadge";
import CheapestBadge from "@/components/common/CheapestBadge";
import type { SearchResult } from "@/data/mockMedicines";

export default function MediCard({
  result,
  cheapest = false,
  medicineName,
  medicineId = "atorvastatin-10",
}: {
  result: SearchResult;
  cheapest?: boolean;
  medicineName: string;
  medicineId?: string;
}) {
  const savings = result.mrp - result.price;
  const pct = Math.round((savings / result.mrp) * 100);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {cheapest && <CheapestBadge />}
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-background text-sm font-bold text-primary">
          {result.pharmacy.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-foreground">{result.pharmacy}</span>
            {result.online && (
              <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary">
                Online
              </span>
            )}
            {result.janAushadhi && <JanAushadhiBadge />}
          </div>
          {result.distanceKm !== undefined && (
            <div className="text-xs text-mutedfg">{result.distanceKm} km away</div>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm font-semibold text-foreground">{medicineName}</div>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold tabular-nums text-primary">₹{result.price}</span>
        <span className="pb-0.5 text-sm text-mutedfg line-through">₹{result.mrp}</span>
        {savings > 0 && (
          <span className="pb-0.5">
            <SavingsBadge amount={savings} pct={pct} />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {result.inStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-warning">
            <span className="h-2 w-2 rounded-full bg-warning" /> Check Availability
          </span>
        )}
        <Link
          to="/medicine/$id"
          params={{ id: medicineId }}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-dark"
        >
          Buy Here <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
