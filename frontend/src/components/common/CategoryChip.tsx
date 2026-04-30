import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

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
    <button
      onClick={() => navigate({ to: "/search", search: { q: q ?? label } })}
      className="
        tap-active shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border
        bg-card px-3.5 py-2 font-sans text-sm font-medium text-foreground
        shadow-sm transition-all duration-200
        hover:border-primary/40 hover:bg-primary/5 hover:text-primary
        active:scale-95
      "
    >
      <span className="text-base leading-none" aria-hidden="true">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
