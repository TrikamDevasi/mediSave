import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pill } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import GenericCard from "@/components/medicine/GenericCard";
import PriceSparkline from "@/components/medicine/PriceSparkline";
import { generics, priceTrend7d } from "@/data/mockMedicines";

export const Route = createFileRoute("/medicine/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Compare prices & generics | MediSave` },
      { name: "description", content: "Compare branded and generic medicine prices, see 7-day trends, and find Jan Aushadhi alternatives." },
    ],
  }),
  component: MedicineDetailPage,
});

function MedicineDetailPage() {
  const navigate = useNavigate();
  const branded = [
    { name: "Apollo Pharmacy", price: 89 },
    { name: "MedPlus", price: 76, best: true },
    { name: "Netmeds", price: 76 },
  ];

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: "/search", search: { q: "Atorvastatin" } })}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Atorvastatin 10mg</h1>
        </div>

        {/* Branded section */}
        <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-mutedfg">Branded</h2>
            <span className="rounded-full border border-border px-2 py-0.5 text-xs">
              MRP: ₹98/strip
            </span>
          </div>
          <div className="mt-1 text-base font-semibold text-foreground">Lipitor 10mg by Pfizer</div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {branded.map((b, i) => (
                  <tr
                    key={b.name + i}
                    className={`border-b border-border last:border-b-0 ${
                      b.best ? "bg-background" : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 text-foreground">{b.name}</td>
                    <td className="px-3 py-2.5 font-bold tabular-nums text-primary">₹{b.price}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground active:scale-95">
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-foreground">7-day price trend</h3>
            <PriceSparkline data={priceTrend7d} />
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="text-xs font-bold uppercase tracking-wider text-mutedfg">
            Generic Alternatives (Same Salt)
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="-mt-3 mb-4 text-center text-xs text-mutedfg leading-relaxed">
          Same active ingredient · CDSCO Approved · Safe to substitute with doctor's confirmation
        </p>

        <div className="space-y-3">
          {generics.map((g) => (
            <GenericCard key={g.name} {...g} />
          ))}
        </div>

        {/* AI info box */}
        <div className="mt-5 rounded-xl bg-primary-light/40 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-primary-dark">Why is generic safe?</h4>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                Atorfit 10mg contains the same active salt — Atorvastatin Calcium — as Lipitor 10mg.
                It is approved by CDSCO (Central Drugs Standard Control Organisation). Safe to use
                after consulting your doctor.
              </p>
              <Link to="/about" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
                Learn more about generics →
              </Link>
            </div>
          </div>
        </div>

        <Link
          to="/nearby"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary-dark active:scale-[0.98] transition"
        >
          Find Nearest Pharmacy <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </AppLayout>
  );
}
