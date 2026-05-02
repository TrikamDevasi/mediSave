import { Search, ScanLine, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useId, useRef, useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SearchBar({
  defaultValue = "",
  variant = "hero",
}: {
  defaultValue?: string;
  variant?: "hero" | "plain";
}) {
  const [q, setQ] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();
  const inputId = useId();
  const containerRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q: q.trim() } });
    setFocused(false);
  };

  // Update dropdown position on focus or resize
  useEffect(() => {
    if (focused && containerRef.current) {
      const updatePos = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setDropdownPos({
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width
          });
        }
      };
      updatePos();
      window.addEventListener('resize', updatePos);
      window.addEventListener('scroll', updatePos, true);
      return () => {
        window.removeEventListener('resize', updatePos);
        window.removeEventListener('scroll', updatePos, true);
      };
    }
  }, [focused]);

  const isHero = variant === "hero";
  const hasValue = q.length > 0;
  const labelRaised = focused || hasValue;

  const suggestions = [
    { name: "Metformin 500mg", type: "Diabetes" },
    { name: "Atorvastatin 10mg", type: "Cardiac" },
    { name: "Pantoprazole 40mg", type: "Gastric" }
  ].filter(s => s.name.toLowerCase().includes(q.toLowerCase()));

  const showSuggestions = focused && q.length > 0 && suggestions.length > 0;

  const portalRoot = typeof document !== "undefined" ? document.getElementById("portal-root") : null;

  return (
    <>
      <motion.form
        ref={containerRef}
        onSubmit={onSubmit}
        role="search"
        animate={{ 
          boxShadow: focused 
            ? "0 0 0 3px var(--color-primary-glow), var(--shadow-elevation-2)" 
            : "var(--shadow-elevation-1)",
          scale: focused ? 1.01 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "group relative flex items-center rounded-[var(--radius-xl)] bg-surface-2 transition-all duration-200",
          !isHero && "border border-divider"
        )}
      >
        <Search
          className="ml-4 h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary"
          strokeWidth={2}
        />

        <div className="relative flex-1 px-3">
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-3 font-sans text-muted-foreground transition-all duration-200",
              labelRaised
                ? "top-1 text-[10px] font-black uppercase tracking-wider text-primary"
                : "top-1/2 -translate-y-1/2 text-sm"
            )}
          >
            Search medicine name
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            type="text"
            autoComplete="off"
            inputMode="search"
            aria-label="Search medicine name"
            className={cn(
              "w-full min-w-0 bg-transparent font-sans text-base text-foreground outline-none font-bold placeholder:opacity-0",
              labelRaised ? "pt-4 pb-1.5" : "py-3.5"
            )}
          />
        </div>

        {hasValue && (
           <button 
             type="button" 
             onClick={() => setQ("")}
             className="p-1 hover:bg-surface-3 rounded-full mr-1 opacity-40 hover:opacity-100 transition-opacity"
           >
             <X className="h-4 w-4" />
           </button>
        )}

        <motion.button
          type="button"
          aria-label="Scan prescription"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate({ to: "/scan" })}
          className="tap-active mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary text-white transition-colors hover:bg-primary-hover shadow-sm"
        >
          <ScanLine className="h-4 w-4" strokeWidth={2} />
        </motion.button>
      </motion.form>

      {/* Fix 2.4: Dropdown rendered via portal */}
      {portalRoot && createPortal(
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="bg-surface-2 border border-divider rounded-[var(--radius-xl)] shadow-elevation-4 overflow-hidden"
              style={{
                position: 'fixed',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                zIndex: 'var(--z-dropdown)'
              }}
            >
              <div className="py-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQ(s.name);
                      navigate({ to: "/search", search: { q: s.name } });
                      setFocused(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-primary/5 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-bold text-sm">{s.name}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{s.type}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalRoot
      )}
    </>
  );
}
