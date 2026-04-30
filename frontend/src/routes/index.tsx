/*
  Art direction: MediSave (India medicine price comparison) → Clinical trust meets warm accessibility
  Palette: Warm sand neutrals + deep teal accent (OKLCH) — clarity, not cold pharma
  Typography: Zodiak (display) + Satoshi (body) — authority + approachability
  Density: Balanced — generous hero, varied section rhythm
*/

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Search, BarChart3, PiggyBank, ShieldCheck, MapPin, TrendingDown, Clock } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import SearchBar from "@/components/common/SearchBar";
import CategoryChip from "@/components/common/CategoryChip";
import SavingsBadge from "@/components/common/SavingsBadge";
import { recentlySearched } from "@/data/mockMedicines";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediSave — Save up to 70% on medicines" },
      {
        name: "description",
        content: "Compare medicine prices, find generic alternatives & locate Jan Aushadhi stores near you in India.",
      },
      { property: "og:title", content: "MediSave — Save up to 70% on medicines" },
      { property: "og:description", content: "Compare prices across Apollo, MedPlus, Netmeds, Jan Aushadhi & more." },
    ],
  }),
  component: HomePage,
});

const categories = [
  { emoji: "💊", label: "Antibiotics" },
  { emoji: "🩸", label: "Diabetes" },
  { emoji: "❤️", label: "Cardiac" },
  { emoji: "🧴", label: "Vitamins" },
  { emoji: "💉", label: "Generics" },
  { emoji: "🦴", label: "Ortho" },
  { emoji: "🧠", label: "Neuro" },
];

const stats = [
  { icon: TrendingDown, value: "₹12,000",  label: "Avg. annual savings per family" },
  { icon: MapPin,       value: "10,000+",  label: "Jan Aushadhi stores across India" },
  { icon: ShieldCheck,  value: "1,759",    label: "Generic medicines listed" },
  { icon: Clock,        value: "63%",      label: "Avg. savings on generic vs brand" },
];

function HomePage() {
  return (
    <AppLayout>

      {/* ─── HERO — Full-bleed, clean, editorial ─────────────────── */}
      <motion.section
        id="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-primary px-4 pb-12 pt-10 text-primary-foreground sm:pb-16 sm:pt-14"
      >
        <div className="mx-auto max-w-3xl">
          {/* Eyebrow — left-aligned */}
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">
            🇮🇳 Trusted across India
          </p>

          {/* Headline — display font, editorial */}
          <h1 className="font-display mt-3 text-[clamp(2rem,4vw+0.5rem,3.25rem)] font-bold leading-[1.12] tracking-tight text-primary-foreground">
            Save up to <em className="not-italic text-yellow-300">70%</em><br />
            on every medicine
          </h1>

          {/* Subtext — left aligned, prose max */}
          <p className="prose-max mt-4 font-sans text-[clamp(0.9rem,1vw+0.5rem,1.0625rem)] leading-relaxed text-primary-foreground/75">
            Compare prices across Apollo, MedPlus & more. Find generic
            alternatives. Locate Jan Aushadhi stores near you — all in one place.
          </p>

          {/* Search bar */}
          <div className="mt-7 max-w-xl">
            <SearchBar variant="hero" />
          </div>

          {/* Quick trust line */}
          <p className="mt-4 font-sans text-xs text-primary-foreground/50">
            Free · No login required · Updated daily
          </p>
        </div>
      </motion.section>

      {/* ─── CONTENT AREA ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* ── Categories ──────────────────────────────────── */}
        <section className="pt-8 fade-in" aria-label="Browse by category">
          <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-mutedfg">
            Browse by category
          </h2>
          <div className="no-scrollbar scroll-hint -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
            {categories.map((c) => (
              <CategoryChip key={c.label} emoji={c.emoji} label={c.label} />
            ))}
          </div>
        </section>

        {/* ── How it works — ASYMMETRIC layout ───────────── */}
        <section className="pt-12 fade-in" aria-labelledby="how-it-works-heading">
          <h2
            id="how-it-works-heading"
            className="font-display text-[clamp(1.25rem,2vw+0.5rem,1.625rem)] font-semibold text-foreground"
          >
            How MediSave works
          </h2>
          <p className="prose-max mt-1 font-sans text-sm text-mutedfg">
            From search to savings in under a minute.
          </p>

          {/*
            Asymmetric 2+1 layout:
            - Left: two stacked cards (Search + Compare)
            - Right: one tall card (Save & track)
          */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5">

            {/* Left column — 2 stacked */}
            <div className="flex flex-col gap-3 sm:col-span-3">
              {[
                {
                  step: "01",
                  Icon: Search,
                  title: "Search or scan",
                  desc: "Type any brand or generic name, or scan your prescription directly from the camera.",
                },
                {
                  step: "02",
                  Icon: BarChart3,
                  title: "Compare prices",
                  desc: "See live prices from Apollo, MedPlus, Netmeds, 1mg and Jan Aushadhi — side by side.",
                },
              ].map(({ step, Icon, title, desc }) => (
                <div
                  key={title}
                  className="card-spring shadow-elevated group flex gap-4 rounded-xl border border-border bg-card p-5 tap-active"
                >
                  <div className="shrink-0">
                    <span className="font-display text-3xl font-bold text-primary/12 select-none">{step}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                      <span className="font-sans font-semibold text-foreground">{title}</span>
                    </div>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-mutedfg">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column — 1 tall featured card */}
            <div className="card-spring shadow-elevated sm:col-span-2">
              <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-5">
                <div>
                  <span className="font-display text-3xl font-bold text-primary/12 select-none">03</span>
                  <div className="mt-3 flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-primary" strokeWidth={2} />
                    <span className="font-sans font-semibold text-foreground">Save &amp; track</span>
                  </div>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-mutedfg">
                    Buy at the cheapest pharmacy near you. Track your total savings over time and share
                    your report with family members.
                  </p>
                </div>
                <div className="mt-6 rounded-lg bg-primary/8 px-4 py-3">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-primary">
                    Avg. family saves
                  </p>
                  <p className="font-display mt-0.5 text-2xl font-bold tabular-nums text-primary">
                    ₹12,000 / yr
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Recently searched ────────────────────────── */}
        {recentlySearched.length > 0 && (
          <section className="pt-12 fade-in" aria-labelledby="recent-heading">
            <div className="flex items-baseline justify-between">
              <h2
                id="recent-heading"
                className="font-display text-[clamp(1.125rem,2vw+0.4rem,1.5rem)] font-semibold text-foreground"
              >
                Recently searched
              </h2>
              <Link
                to="/search"
                className="font-sans text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                View all →
              </Link>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {recentlySearched.map((m) => (
                <Link
                  key={m.id}
                  to="/medicine/$id"
                  params={{ id: m.id }}
                  className="card-spring shadow-elevated tap-active group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <div className="min-w-0">
                    <p className="font-sans font-semibold text-foreground">
                      {m.name}{" "}
                      <span className="font-normal text-mutedfg">{m.dosage}</span>
                    </p>
                    <p className="mt-0.5 font-sans text-sm">
                      <span className="font-semibold text-primary">₹{m.cheapest}</span>{" "}
                      <span className="text-mutedfg">at {m.cheapestAt}</span>
                    </p>
                    <div className="mt-2">
                      <SavingsBadge amount={m.savings} pct={m.savingsPct} />
                    </div>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-mutedfg transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    strokeWidth={2}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Stats — BENTO GRID ───────────────────────── */}
        <section className="pt-12 pb-2 fade-in" aria-label="Impact statistics">
          <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-mutedfg">
            India's medicine savings
          </h2>

          {/* Bento: 1 wide + 3 equal in asymmetric arrangement */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {/* Wide card */}
            <div className="shadow-elevated col-span-2 rounded-xl border border-border bg-card p-5 md:col-span-1">
              <TrendingDown className="h-5 w-5 text-primary" strokeWidth={2} />
              <p className="font-display mt-2 text-3xl font-bold tabular-nums text-foreground">₹12,000</p>
              <p className="mt-1 font-sans text-xs leading-snug text-mutedfg">Avg. annual savings per family</p>
            </div>

            {stats.slice(1).map(({ icon: Icon, value, label }) => (
              <div key={label} className="shadow-elevated rounded-xl border border-border bg-card p-4">
                <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                <p className="font-display mt-2 text-2xl font-bold tabular-nums text-foreground">{value}</p>
                <p className="mt-1 font-sans text-xs leading-snug text-mutedfg">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer links ─────────────────────────────── */}
        <footer className="mt-10 mb-6 border-t border-border pt-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/about" className="font-sans text-sm text-mutedfg transition-colors hover:text-foreground">
              About MediSave
            </Link>
            <Link to="/contact" className="font-sans text-sm text-mutedfg transition-colors hover:text-foreground">
              Contact us
            </Link>
            <span className="ml-auto font-sans text-xs text-mutedfg/60">
              Prices updated daily · Not medical advice
            </span>
          </div>
        </footer>

      </div>
    </AppLayout>
  );
}
