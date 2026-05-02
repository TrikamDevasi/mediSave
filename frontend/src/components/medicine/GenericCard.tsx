import { motion } from "framer-motion";
import { Check, Zap, TrendingUp } from "lucide-react";
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
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="holo-card premium-card relative overflow-hidden rounded-[24px] bg-surface p-6 shadow-sm border border-divider group"
    >
      {/* Corner Accent Glow */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-success/10 blur-2xl group-hover:bg-success/20 transition-all pointer-events-none" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {recommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-success/20">
                <Check className="h-3 w-3" strokeWidth={4} /> Best Value
              </span>
            )}
            {janAushadhi && <JanAushadhiBadge />}
          </div>
          
          <div className="text-xl font-black text-foreground leading-tight tracking-tight">
            {janAushadhi && "🏛 "}
            {name}
          </div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <span>{manufacturer}</span>
            <span className="h-1 w-1 rounded-full bg-divider" />
            <span className="text-primary">80% Cheaper</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-black tabular-nums text-primary">₹{price}</div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-60">/ strip</div>
        </div>
      </div>

      {/* Visual Savings Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-success">
          <span>Generic Savings</span>
          <span>{savingsPct}% OFF</span>
        </div>
        <div className="h-2 w-full bg-divider/30 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${savingsPct}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-success to-teal-400 rounded-full"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-divider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Quality</span>
        </div>
        <div className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
          View Bio-Equivalent
        </div>
      </div>
    </motion.div>
  );
}
