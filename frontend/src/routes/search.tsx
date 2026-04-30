import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import AppLayout from "@/components/layout/AppLayout";
import SearchBar from "@/components/common/SearchBar";
import MediCard from "@/components/medicine/MediCard";
import SkeletonCard from "@/components/common/SkeletonCard";
import { searchResultsMock } from "@/data/mockMedicines";
import { useEffect } from "react";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: ({ match }) => ({
    meta: [
      { title: `Search: ${match.search.q || "medicines"} — MediSave` },
      { name: "description", content: "Compare medicine prices across pharmacies in India." },
    ],
  }),
  component: SearchResultsPage,
});

type Filter = "All" | "Nearby" | "Online" | "Jan Aushadhi";
type Sort = "price" | "distance" | "savings";

function SearchResultsPage() {
  const { q } = Route.useSearch();
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("price");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [q]);

  const filtered = searchResultsMock.filter((r) => {
    if (filter === "Nearby") return r.distanceKm !== undefined;
    if (filter === "Online") return r.online;
    if (filter === "Jan Aushadhi") return r.janAushadhi;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "distance") return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    return b.mrp - b.price - (a.mrp - a.price);
  });

  const cheapestId = [...searchResultsMock].sort((a, b) => a.price - b.price)[0]?.id;
  const medicineName = q ? `${q}` : "Atorvastatin 10mg";

  return (
    <AppLayout>
      <div className="sticky top-14 z-20 bg-background px-4 pt-3 pb-2">
        <SearchBar defaultValue={q} variant="plain" />
        <p className="mt-2 text-xs text-mutedfg">
          Results for "{q || "Atorvastatin 10mg"}"
        </p>
      </div>

      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-4 pb-2">
        {(["All", "Nearby", "Online", "Jan Aushadhi"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-primary bg-white text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 pt-1 pb-3 text-xs text-mutedfg">
        <span>Sort by:</span>
        {([
          ["price", "Price ↑"],
          ["distance", "Distance"],
          ["savings", "Savings %"],
        ] as [Sort, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            className={`rounded-full px-2.5 py-1 ${
              sort === k ? "bg-primary-light text-primary font-semibold" : "text-mutedfg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4">
        {loading ? (
          <>
            <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
          </>
        ) : sorted.length === 0 ? (
          <EmptyResults q={q} />
        ) : (
          <AnimatePresence>
            {sorted.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <MediCard result={r} cheapest={r.id === cheapestId} medicineName={medicineName} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && sorted.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed inset-x-0 bottom-16 z-20 mx-auto max-w-2xl px-4"
        >
          <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-white p-4 shadow-lg border-t border-x border-border">
            <div className="text-sm">
              💊 <span className="font-semibold">Generic alternative available</span> — save up to 70%
            </div>
            <Link
              to="/medicine/$id"
              params={{ id: "atorvastatin-10" }}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              View Generics →
            </Link>
          </div>
        </motion.div>
      )}
    </AppLayout>
  );
}

function EmptyResults({ q }: { q: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="text-6xl">🔎</div>
      <h3 className="mt-4 font-bold text-foreground">No results found for "{q}"</h3>
      <p className="mt-2 max-w-xs text-sm text-mutedfg">
        Try searching for the generic name (e.g., "Atorvastatin" instead of "Lipitor").
      </p>
      <Link
        to="/search"
        search={{ q: "Atorvastatin" }}
        className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
      >
        Search generics →
      </Link>
    </div>
  );
}
