import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import Fuse from "fuse.js";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  TrendingUp,
  X,
  Clock,
  ChevronRight,
  Filter,
  LayoutGrid,
  ArrowUpLeft,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MediCard from "@/components/medicine/MediCard";
import { searchResultsMock } from "@/data/mockMedicines";
import { usePageTransition } from "./__root";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

function MediCardSkeleton() {
  return (
    <Card padding="md" className="relative overflow-hidden h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton h-8 w-16 rounded-full" />
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>
      <div className="skeleton h-10 w-3/4 mb-2 rounded-[var(--radius-md)]" />
      <div className="skeleton h-5 w-1/2 mb-8 rounded-[var(--radius-md)]" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-4 w-12 rounded-full" />
            <div className="skeleton h-6 flex-1 rounded-full" style={{ maxWidth: `${100 - i * 20}%` }} />
          </div>
        ))}
      </div>
      <div className="skeleton h-14 w-full mt-8 rounded-[var(--radius-xl)]" />
    </Card>
  );
}

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: ({ match }) => ({
    meta: [
      { title: match.search.q ? `Results for "${match.search.q}" — MediSave` : "Search Medicines — MediSave" },
      { name: "description", content: "Compare medicine prices across pharmacies in India." },
    ],
  }),
  component: SearchPage,
});

const suggestionPills = ["Metformin", "Paracetamol", "Atorvastatin", "Cetirizine", "Pantoprazole", "Azithromycin"];
const trendingMedicines = [
  { name: "Metformin 500mg",   category: "Diabetes",       savings: "₹50" },
  { name: "Atorvastatin 10mg", category: "Cholesterol",    savings: "₹42" },
  { name: "Amlodipine 5mg",    category: "Blood Pressure", savings: "₹18" },
  { name: "Pantoprazole 40mg", category: "Gastric",        savings: "₹24" },
];
const recentSearches = ["Metformin", "Atorvastatin", "Dolo 650"];

// ── Reusable section label ──────────────────────────────────────────────────
function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-faint)" }}>
        {text}
      </span>
    </div>
  );
}

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const { startTransition } = usePageTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(q);
  const [isTyping, setIsTyping]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [filter, setFilter]         = useState("All");
  const [barFocused, setBarFocused] = useState(false);

  const fuse = useMemo(() => new Fuse(searchResultsMock, {
    keys: ["medicineName", "pharmacy"],
    threshold: 0.3,
  }), []);

  // Debounce: only rerun Fuse search 300ms after user stops typing
  const debouncedInput = useDebounce(inputValue, 300);

  const suggestions = useMemo(() => {
    if (debouncedInput.length < 2) return [];
    return fuse.search(debouncedInput).slice(0, 5).map(r => r.item);
  }, [debouncedInput, fuse]);


  useEffect(() => {
    setInputValue(q);
    if (q) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(t);
    }
  }, [q]);

  // Virtual viewport / keyboard handling
  useEffect(() => {
    const vp = window.visualViewport;
    if (!vp) return;
    const onResize = () => {
      const kh = window.innerHeight - vp.height;
      document.documentElement.style.setProperty("--keyboard-height", `${kh}px`);
    };
    vp.addEventListener("resize", onResize);
    return () => vp.removeEventListener("resize", onResize);
  }, []);

  const handleSearch = (query: string) => {
    setIsTyping(false);
    navigate({ to: "/search", search: { q: query } });
  };

  // ── Inline styles ──────────────────────────────────────────────────────────
  const barStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 12,
    background: "var(--color-surface)",
    border: `1.5px solid ${barFocused ? "var(--color-primary)" : "var(--color-border)"}`,
    borderRadius: 16, padding: "14px 16px",
    boxShadow: barFocused ? "0 0 0 3px var(--color-primary-glow)" : "var(--shadow-sm)",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
  };

  return (
    <AppLayout>
      <div style={{ minHeight: "100dvh", paddingTop: 64, background: "var(--color-bg)" }}>

        {/* ── Search bar header ─────────────────────────────────────────── */}
        <div style={{
          position: "sticky", top: 64, zIndex: 100,
          background: q ? "rgba(var(--color-bg-rgb, 15,14,12), 0.9)" : "transparent",
          backdropFilter: q ? "blur(20px)" : "none",
          borderBottom: q ? "1px solid var(--color-border)" : "none",
          padding: q ? "12px 20px" : "32px 20px 0",
          transition: "all 300ms ease",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>

            {/* Unified search bar */}
            <div style={barStyle}>
              <Search size={20} style={{ color: "var(--color-text-faint)", flexShrink: 0 }} />

              <input
                ref={inputRef}
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); setIsTyping(e.target.value.length > 0); }}
                onFocus={() => { setBarFocused(true); setIsTyping(inputValue.length > 0); }}
                onBlur={() => setBarFocused(false)}
                onKeyDown={e => e.key === "Enter" && handleSearch(inputValue)}
                placeholder="Type any medicine or salt name…"
                autoFocus={!q}
                style={{
                  flex: 1, border: "none", outline: "none",
                  background: "transparent", fontSize: 16,
                  color: "var(--color-text)", fontFamily: "var(--font-body)",
                }}
              />

              {/* Clear */}
              {inputValue && (
                <button
                  onClick={() => { setInputValue(""); setIsTyping(false); inputRef.current?.focus(); }}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--color-surface-offset)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--color-text-muted)", flexShrink: 0,
                    transition: "background 150ms ease",
                  }}
                >
                  <X size={14} />
                </button>
              )}

              {/* Search submit */}
              <button
                onClick={() => handleSearch(inputValue)}
                style={{
                  height: 38, paddingLeft: 16, paddingRight: 16, borderRadius: 10,
                  background: "var(--color-primary)", color: "#fff", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  boxShadow: "0 2px 8px var(--color-primary-glow)",
                  transition: "background 150ms ease",
                }}
              >
                <Search size={15} />
                Search
              </button>
            </div>

            {/* Instant suggestions dropdown */}
            <AnimatePresence>
              {isTyping && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 200,
                    background: "var(--color-surface-2)", border: "1px solid var(--color-border)",
                    borderRadius: 14, boxShadow: "var(--shadow-lg)", overflow: "hidden",
                  }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={s.id + i}
                      onClick={() => handleSearch(s.medicineName || "")}
                      style={{
                        width: "100%", display: "flex", alignItems: "center",
                        justifyContent: "space-between", padding: "14px 18px",
                        background: "transparent", border: "none",
                        borderBottom: i < suggestions.length - 1 ? "1px solid var(--color-border)" : "none",
                        cursor: "pointer", textAlign: "left",
                        transition: "background 120ms ease",
                        color: "var(--color-text)",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "color-mix(in oklab, var(--color-primary) 6%, var(--color-surface))")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Search size={14} style={{ color: "var(--color-text-faint)" }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{s.medicineName}</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>Generic salt</div>
                        </div>
                      </div>
                      <ChevronRight size={14} style={{ color: "var(--color-text-faint)" }} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Page body ─────────────────────────────────────────────────── */}
        <div style={{
          maxWidth: 840, margin: "0 auto",
          padding: "32px 20px",
          paddingBottom: "calc(var(--keyboard-height, 0px) + 120px)",
        }}>

          {/* ── STATE 1: EMPTY — no query, not typing ──────────────────── */}
          {!q && !isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Suggestion chips */}
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: 12 }}>
                Try searching for…
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
                {suggestionPills.map((p, i) => (
                  <motion.button
                    key={p}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSearch(p)}
                    style={{
                      padding: "8px 18px", borderRadius: 9999, fontSize: 13,
                      fontWeight: 600, letterSpacing: "0.02em",
                      border: "1.5px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text-muted)",
                      cursor: "pointer", whiteSpace: "nowrap",
                      transition: "all 150ms ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--color-primary)";
                      e.currentTarget.style.color = "var(--color-primary)";
                      e.currentTarget.style.background = "color-mix(in oklab, var(--color-primary) 8%, var(--color-surface))";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.background = "var(--color-surface)";
                    }}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>

              {/* Two-column: Recent | Trending */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
                   className="search-bottom-grid">

                {/* Recent searches */}
                <div>
                  <SectionLabel
                    icon={<Clock size={13} style={{ color: "var(--color-text-faint)" }} />}
                    text="Recent Searches"
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {recentSearches.map(s => (
                      <button
                        key={s}
                        onClick={() => handleSearch(s)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "10px 10px",
                          borderRadius: 10, border: "none", background: "transparent",
                          cursor: "pointer", textAlign: "left",
                          color: "var(--color-text)", transition: "background 150ms ease",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <Clock size={14} style={{ color: "var(--color-text-faint)", flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{s}</span>
                        <ArrowUpLeft size={13} style={{ color: "var(--color-text-faint)", flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending today */}
                <div>
                  <SectionLabel
                    icon={<TrendingUp size={13} style={{ color: "var(--color-text-faint)" }} />}
                    text="Trending Today"
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {trendingMedicines.map(m => (
                      <button
                        key={m.name}
                        onClick={() => handleSearch(m.name)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                          background: "var(--color-surface)", border: "1px solid var(--color-border)",
                          textAlign: "left", width: "100%", transition: "all 150ms ease",
                          color: "var(--color-text)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "var(--color-primary)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "var(--color-border)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {/* Category badge */}
                        <span style={{
                          flexShrink: 0, padding: "3px 8px", borderRadius: 9999,
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                          background: "color-mix(in oklab, var(--color-primary) 12%, var(--color-surface))",
                          color: "var(--color-primary)",
                        }}>
                          {m.category}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)", marginTop: 1 }}>Save {m.savings}</div>
                        </div>
                        <TrendingUp size={14} style={{ color: "var(--color-text-faint)", flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ── STATE 2: RESULTS ───────────────────────────────────────── */}
          {q && (
            <div>
              {/* Filter chips */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none", WebkitOverflowScrolling: "touch", marginBottom: 8 } as any}>
                {["All", "Cheapest First", "Generic Available", "In Stock", "Jan Aushadhi"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      flexShrink: 0, padding: "8px 18px", borderRadius: 9999,
                      fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                      border: "1.5px solid",
                      borderColor: filter === f ? "var(--color-primary)" : "var(--color-border)",
                      background: filter === f ? "var(--color-primary)" : "transparent",
                      color: filter === f ? "#fff" : "var(--color-text-muted)",
                      cursor: "pointer", transition: "all 150ms ease",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, marginTop: 8 }}>
                <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
                  Results for <strong style={{ color: "var(--color-text)" }}>"{q}"</strong>
                </p>
                <Button variant="ghost" size="xs" leftIcon={<LayoutGrid className="h-3.5 w-3.5" />}>Grid View</Button>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-grid-default">
                    {[1, 2, 3, 4, 5, 6].map(i => <MediCardSkeleton key={i} />)}
                  </motion.div>
                ) : searchResultsMock.length > 0 ? (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}
                  >
                    {searchResultsMock.map((r, i) => (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <MediCard result={r} medicineName={q || r.medicineName || "Medicine"} cheapest={i === 0} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-32 flex flex-col items-center text-center px-4">
                    <div className="text-8xl mb-10 animate-bounce grayscale">💊</div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight mb-4">Nothing matches "{q}"</h2>
                    <p className="text-muted-foreground max-w-sm mb-12 leading-relaxed">
                      Try checking the spelling or searching for a generic name like "Paracetamol".
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <Button onClick={() => handleSearch("Metformin")}>Try Metformin</Button>
                      <Button variant="secondary" onClick={() => setInputValue("")}>Clear Search</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
