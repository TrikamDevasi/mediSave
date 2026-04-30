import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PharmacyCard from "@/components/pharmacy/PharmacyCard";
import { pharmacies } from "@/data/mockPharmacies";

export const Route = createFileRoute("/nearby")({
  head: () => ({
    meta: [
      { title: "Pharmacies Near You — MediSave" },
      { name: "description", content: "Find the nearest pharmacies and Jan Aushadhi stores in your city." },
    ],
  }),
  component: NearbyPage,
});

function NearbyPage() {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <AppLayout>
      <section className="relative">
        <div
          className="relative h-[55vh] w-full overflow-hidden bg-primary-light/30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(1,105,111,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(1,105,111,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        >
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Pharmacies near Ahmedabad, Gujarat
          </div>

          {pharmacies.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePin(activePin === p.id ? null : p.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: p.pin.top, left: p.pin.left }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 -z-10 rounded-full ${
                  p.janAushadhi ? "bg-warning/30" : "bg-primary/30"
                }`}
                style={{ width: 28, height: 28, marginLeft: -8, marginTop: -8 }}
              />
              <span
                className={`block h-3 w-3 rounded-full ring-2 ring-white shadow ${
                  p.janAushadhi ? "bg-warning" : "bg-primary"
                }`}
              />
              {activePin === p.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 top-5 z-10 w-44 -translate-x-1/2 rounded-lg bg-white p-2 text-left text-[11px] shadow-lg"
                >
                  <div className="font-semibold text-foreground">{p.name}</div>
                  <div className="text-mutedfg">{p.distanceKm} km away</div>
                  <div className="mt-1 inline-flex rounded-full bg-success/10 px-1.5 py-0.5 font-semibold text-success">
                    Open Now
                  </div>
                </motion.div>
              )}
            </button>
          ))}

          <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] shadow-sm">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" /> Regular
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-warning" /> Jan Aushadhi
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <h2 className="mb-2 text-base font-bold text-foreground">3 pharmacies near you</h2>
        <div className="space-y-3 pt-1">
          {pharmacies.slice(0, 3).map((p) => (
            <PharmacyCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
