import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from "recharts";
import AppLayout from "@/components/layout/AppLayout";
import { useCountUp } from "@/hooks/useCountUp";
import { Switch } from "@/components/ui/switch";
import { monthlySavings, myMedicines } from "@/data/mockMedicines";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Savings Dashboard — MediSave" },
      { name: "description", content: "Track your medicine savings over time and manage refill reminders." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const total = useCountUp(1247);
  const [meds, setMeds] = useState(myMedicines);

  return (
    <AppLayout>
      <div className="px-4 pt-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Good morning, Trikam 👋</h1>
          <p className="text-sm text-mutedfg">April 2026</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm opacity-80">Total Saved This Month</div>
              <div className="mt-1 text-5xl font-bold tabular-nums">
                ₹{total.toLocaleString("en-IN")}
              </div>
              <div className="mt-2 text-xs opacity-80">Across 8 purchases · vs branded prices</div>
            </div>
            <div className="rounded-full bg-white/15 p-2">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-foreground">Monthly Savings (₹)</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySavings} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#7A7974" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                  formatter={(v) => [`₹${v}`, "Saved"]}
                />
                <Bar dataKey="value" fill="#01696F" radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v: number) => `₹${v}`}
                    style={{ fontSize: 10, fill: "#28251D", fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">My Medicines</h2>
          <button className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground active:scale-95">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {meds.map((m) => (
            <div key={m.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💊</div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">
                    {m.name} {m.dosage}
                  </div>
                  <div className="text-xs text-mutedfg">
                    Last bought: {m.lastDate} · ₹{m.lastPrice}
                  </div>
                  <div className="text-xs font-semibold text-success">Saved ₹{m.saved} vs branded</div>
                </div>
                <Switch
                  checked={m.reminder}
                  onCheckedChange={(v) =>
                    setMeds((arr) => arr.map((x) => (x.id === m.id ? { ...x, reminder: v } : x)))
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-gradient-to-r from-warning to-[#964219] p-5 text-white shadow-md"
        >
          <div className="flex items-center gap-2 text-lg font-bold">
            <span>🏛</span> Jan Aushadhi Impact
          </div>
          <p className="mt-1 text-sm opacity-95">2 purchases saved ₹340 vs branded medicines</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/30">
            <div className="h-full rounded-full bg-white" style={{ width: "72%" }} />
          </div>
          <Link
            to="/nearby"
            className="mt-4 inline-block rounded-full border border-white px-4 py-1.5 text-xs font-semibold hover:bg-white hover:text-warning transition"
          >
            Find Jan Aushadhi near you →
          </Link>
        </motion.div>
      </div>
    </AppLayout>
  );
}
