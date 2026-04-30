import { Search, ScanLine } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useId, type FormEvent } from "react";

export default function SearchBar({
  defaultValue = "",
  variant = "hero",
}: {
  defaultValue?: string;
  variant?: "hero" | "plain";
}) {
  const [q, setQ] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const inputId = useId();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q: q.trim() } });
  };

  const isHero = variant === "hero";
  const hasValue = q.length > 0;
  const labelRaised = focused || hasValue;

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`
        group relative flex items-center rounded-xl bg-surface transition-shadow
        ${isHero
          ? "shadow-elevated hover:shadow-lifted focus-within:shadow-lifted"
          : "border border-border focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20"}
      `}
    >
      {/* Search icon */}
      <Search
        className="ml-4 h-[18px] w-[18px] shrink-0 text-mutedfg transition-colors group-focus-within:text-primary"
        strokeWidth={2}
      />

      {/* Floating label + input */}
      <div className="relative flex-1 px-3">
        <label
          htmlFor={inputId}
          className={`
            pointer-events-none absolute left-3 font-sans text-mutedfg transition-all duration-200
            ${labelRaised
              ? "top-1 text-[10px] font-medium text-primary"
              : "top-1/2 -translate-y-1/2 text-sm"}
          `}
        >
          Search medicine name
        </label>
        <input
          id={inputId}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="text"
          inputMode="search"
          aria-label="Search medicine name"
          className={`
            w-full min-w-0 bg-transparent font-sans text-sm text-foreground outline-none
            ${labelRaised ? "pt-4 pb-1.5" : "py-3.5"}
          `}
        />
      </div>

      {/* Scan button — solid accent, no gradient */}
      <button
        type="button"
        aria-label="Scan prescription"
        onClick={() => navigate({ to: "/scan" })}
        className="tap-active mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary-dark active:scale-95"
      >
        <ScanLine className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
  );
}
