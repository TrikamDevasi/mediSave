import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, TrendingDown, Info, Navigation, Bookmark, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import SavingsBadge from "@/components/common/SavingsBadge";
import JanAushadhiBadge from "@/components/common/JanAushadhiBadge";
import CheapestBadge from "@/components/common/CheapestBadge";
import { PharmacyBadge } from "@/components/common/PharmacyBadge";
import { ParticleBurst } from "@/components/common/ParticleBurst";
import { SavingsToast } from "@/components/common/SavingsToast";
import { MagneticButton } from "@/components/common/MagneticButton";
import { TiltCard } from "@/components/common/TiltCard";
import { BottomSheet } from "@/components/common/BottomSheet";
import type { SearchResult } from "@/data/mockMedicines";

// ─── Pharmacy price comparison data (derived semantically) ──────────────────
const pharmacyPrices = [
  { name: "Apollo",       price: 68 },
  { name: "MedPlus",      price: 52 },
  { name: "Netmeds",      price: 48 },
  { name: "1mg",          price: 45 },
  { name: "Jan Aushadhi", price: 18 },
];

const minPrice = Math.min(...pharmacyPrices.map(p => p.price));
const maxPrice = Math.max(...pharmacyPrices.map(p => p.price));

function getBarColor(price: number): string {
  if (price === minPrice) return "var(--color-success, #16a34a)";
  if (price === maxPrice) return "#ef4444";
  return "var(--color-primary)";
}

function getPriceColor(price: number): string {
  if (price === minPrice) return "var(--color-success, #16a34a)";
  if (price === maxPrice) return "#ef4444";
  return "var(--color-text)";
}

// ─── Component ───────────────────────────────────────────────────────────────
function MediCard({
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
  const [burst, setBurst] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inView, setInView] = useState(false);

  const barSavings = maxPrice - minPrice; // savings vs most expensive
  const cardSavings = result.mrp - result.price;
  const cardPct = Math.round((cardSavings / result.mrp) * 100);

  const isTouchDevice = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBurst(true);
    setSaved(v => !v);
    setTimeout(() => setBurst(false), 600);
    if (!saved) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const cardContent = (
    <div
      className="holo-card relative overflow-visible rounded-[var(--radius-xl)] bg-surface shadow-sm border border-divider h-full group"
      style={{ padding: "20px 20px 16px" }}
      onClick={() => setIsSheetOpen(true)}
    >
      <SavingsToast amount={cardSavings} show={showToast} />

      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />

      {/* ── CHEAPEST badge — hangs from top border ── */}
      {cheapest && (
        <div style={{
          position: "absolute", top: -1, right: 20,
          background: "var(--color-success, #16a34a)", color: "#fff",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          padding: "4px 12px", borderRadius: "0 0 8px 8px",
          zIndex: 2, textTransform: "uppercase",
        }}>
          ✓ Cheapest
        </div>
      )}

      {/* ── Header row: pharmacy badge + distance + stock + heart ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <PharmacyBadge name={result.pharmacy} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Distance / Online tag */}
          {result.distanceKm !== undefined ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>
              <MapPin size={11} />
              {result.distanceKm} km away
            </div>
          ) : result.online ? (
            <span style={{
              display: "inline-block", padding: "2px 8px", borderRadius: 9999,
              fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
              background: "color-mix(in oklab, var(--color-primary) 12%, var(--color-surface))",
              color: "var(--color-primary)",
            }}>
              Online
            </span>
          ) : null}
        </div>

        {/* Stock indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700,
          color: result.inStock ? "var(--color-success, #16a34a)" : "#ef4444", flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%",
            background: result.inStock ? "var(--color-success, #16a34a)" : "#ef4444",
            animation: result.inStock ? "pulse-dot 2s infinite" : "none" }} />
          {result.inStock ? "In Stock" : "Out of Stock"}
        </div>

        {/* Heart / save */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <ParticleBurst trigger={burst} />
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleSave}
            style={{ padding: 8, borderRadius: "50%", border: "1px solid var(--color-border)",
              background: "transparent", cursor: "pointer", color: saved ? "#ef4444" : "var(--color-text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Save medicine"
          >
            <Heart size={15} className={saved ? "fill-red-500" : ""} />
          </motion.button>
        </div>
      </div>

      {/* ── Medicine name + sub ── */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "var(--color-text)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {medicineName}
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
          Sold by {result.pharmacy}
          {result.janAushadhi && <JanAushadhiBadge />}
        </div>
      </div>

      {/* ── "You save" callout ── */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "color-mix(in oklab, var(--color-success, #16a34a) 10%, var(--color-surface))",
        border: "1px solid color-mix(in oklab, var(--color-success, #16a34a) 22%, transparent)",
        borderRadius: 8, padding: "5px 12px", marginTop: 8, marginBottom: 16,
      }}>
        <TrendingDown size={13} style={{ color: "var(--color-success, #16a34a)", flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-success, #16a34a)" }}>
          Save ₹{barSavings} vs. most expensive option
        </span>
      </div>

      {/* ── Price comparison bars ── */}
      <motion.div
        onViewportEnter={() => setInView(true)}
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 4 }}
      >
        {pharmacyPrices.map((p, i) => {
          const barWidth = `${Math.round((p.price / maxPrice) * 100)}%`;
          const barColor = getBarColor(p.price);
          const priceColor = getPriceColor(p.price);

          return (
            <div key={p.name} style={{ display: "grid", gridTemplateColumns: "76px 1fr 46px", alignItems: "center", gap: 10, marginBottom: 8 }}>
              {/* Pharmacy name */}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                color: "var(--color-text-muted)", textAlign: "right", opacity: 0.8 }}>
                {p.name}
              </span>

              {/* Bar track */}
              <div style={{ height: 8, borderRadius: 9999, background: "var(--color-surface-offset)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", borderRadius: 9999, background: barColor + "dd" }}
                  initial={{ width: 0 }}
                  animate={{ width: inView ? barWidth : 0 }}
                  transition={{ duration: 0.7, delay: inView ? i * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Price */}
              <span style={{ fontSize: 13, fontWeight: 800, color: priceColor, textAlign: "right", tabularNums: true } as any}>
                ₹{p.price}
              </span>
            </div>
          );
        })}

        {/* Jan Aushadhi savings callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.6, type: "spring", stiffness: 380, damping: 22 }}
          style={{
            marginTop: 10, textAlign: "center",
            background: "color-mix(in oklab, var(--color-success, #16a34a) 10%, var(--color-surface))",
            color: "var(--color-success, #16a34a)", fontWeight: 800,
            borderRadius: "var(--radius-md)", padding: "8px 12px", fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.06em",
            border: "1px solid color-mix(in oklab, var(--color-success, #16a34a) 20%, transparent)",
          }}
        >
          💰 Save ₹50 (73%) with Jan Aushadhi
        </motion.div>
      </motion.div>

      {/* ── Bottom action row ── */}
      <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--color-border)" }}>
        {/* Price + savings */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--color-primary)", fontVariantNumeric: "tabular-nums" }}>
              ₹{result.price.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)", textDecoration: "line-through" }}>
              ₹{result.mrp}
            </span>
          </div>
          <SavingsBadge amount={cardSavings} pct={cardPct} />
        </div>

        {/* Directions */}
        <button
          onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.pharmacy)}`); }}
          style={{ padding: "0 14px", height: 40, borderRadius: 10, background: "var(--color-surface-offset)",
            color: "var(--color-text-muted)", fontSize: 12, fontWeight: 600,
            border: "1px solid var(--color-border)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0, transition: "all 150ms ease" }}
        >
          <Navigation size={13} />
          Directions
        </button>

        {/* Save bookmark */}
        <button
          onClick={handleSave}
          style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: saved ? "color-mix(in oklab, #ef4444 12%, var(--color-surface))" : "var(--color-surface-offset)",
            border: `1px solid ${saved ? "color-mix(in oklab, #ef4444 30%, transparent)" : "var(--color-border)"}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: saved ? "#ef4444" : "var(--color-text-muted)", transition: "all 150ms ease" }}
        >
          <Bookmark size={14} className={saved ? "fill-red-400" : ""} />
        </button>

        {/* View details */}
        <MagneticButton>
          <div
            onClick={e => { e.stopPropagation(); setIsSheetOpen(true); }}
            style={{ display: "flex", alignItems: "center", gap: 6,
              borderRadius: 10, background: "var(--color-primary)",
              padding: "0 16px", height: 40, fontSize: 12, fontWeight: 800,
              color: "#fff", cursor: "pointer", flexShrink: 0,
              boxShadow: "0 2px 8px var(--color-primary-glow)",
              textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            Details <Info size={13} />
          </div>
        </MagneticButton>
      </div>

      {/* ── Bottom sheet detail view ── */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title={medicineName}>
        <div style={{ padding: "0 4px" }} className="space-y-6">
          {/* Savings summary */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: 16, background: "color-mix(in oklab, var(--color-primary) 6%, var(--color-surface))",
            borderRadius: "var(--radius-xl)", border: "1px solid color-mix(in oklab, var(--color-primary) 14%, transparent)" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-primary)", marginBottom: 4 }}>
                Your Savings
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--color-text)" }}>
                ₹{cardSavings.toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: "50%",
              background: "color-mix(in oklab, var(--color-success, #16a34a) 18%, var(--color-surface))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-success, #16a34a)" }}>
              <TrendingDown size={22} />
            </div>
          </div>

          {/* Price table */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
              color: "var(--color-text-muted)", marginBottom: 10 }}>
              Pricing Across Pharmacies
            </h4>
            {pharmacyPrices.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px", borderRadius: 12, border: "1px solid var(--color-border)",
                marginBottom: 6, background: p.price === minPrice ? "color-mix(in oklab, var(--color-success, #16a34a) 6%, var(--color-surface))" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: getBarColor(p.price) }} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                  {p.price === minPrice && (
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 9999,
                      background: "var(--color-success, #16a34a)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Best
                    </span>
                  )}
                </div>
                <span style={{ fontWeight: 900, fontSize: 15, color: getPriceColor(p.price), fontVariantNumeric: "tabular-nums" }}>
                  ₹{p.price}
                </span>
              </div>
            ))}
          </div>

          <Link to="/medicine/$id" params={{ id: medicineId }} className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: "100%", background: "var(--color-primary)", color: "#fff",
                fontWeight: 900, padding: "14px", borderRadius: "var(--radius-xl)",
                boxShadow: "0 6px 20px var(--color-primary-glow)", border: "none",
                cursor: "pointer", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em",
                marginTop: 8 }}
            >
              Order from {result.pharmacy} →
            </motion.button>
          </Link>
        </div>
      </BottomSheet>
    </div>
  );

  return !isTouchDevice() ? (
    <TiltCard className="h-full">{cardContent}</TiltCard>
  ) : (
    <motion.div whileTap={{ scale: 0.98 }} className="h-full">
      {cardContent}
    </motion.div>
  );
}

// memo: skip re-render when parent re-renders but our props haven't changed
export default memo(MediCard);
