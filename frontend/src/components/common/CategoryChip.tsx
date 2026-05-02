import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export default function CategoryChip({
  label,
  emoji,
  q,
}: {
  label: string;
  emoji?: ReactNode;
  q?: string;
}) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      onClick={() => navigate({ to: "/search", search: { q: q ?? label } })}
      className="
        tap-active shrink-0 inline-flex items-center gap-2 rounded-xl border border-border
        bg-surface px-5 py-3 font-sans text-sm font-bold text-foreground
        shadow-sm transition-all
        hover:border-primary/30 hover:bg-primary-light hover:text-primary
      "
    >
      <span className="text-lg leading-none" aria-hidden="true">{emoji}</span>
      <span className="tracking-tight">{label}</span>
    </motion.button>
  );
}
