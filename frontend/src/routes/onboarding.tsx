import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/hooks/useOnboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to MediSave" },
      { name: "description", content: "Get started with MediSave — compare medicine prices and save up to 70%." },
    ],
  }),
  component: OnboardingPage,
});

const slides = [
  {
    bg: "bg-gradient-to-br from-primary to-primary-dark text-white",
    emoji: "💊",
    titleClass: "text-white",
    title: "Stop Overpaying for Medicines",
    subtitleClass: "text-white/85",
    subtitle:
      "The same medicine can cost 10x more at different pharmacies. MediSave finds you the cheapest option.",
  },
  {
    bg: "bg-white text-foreground",
    emoji: "compare",
    titleClass: "text-primary",
    title: "Compare Prices Instantly",
    subtitleClass: "text-mutedfg",
    subtitle:
      "Search any medicine and see prices at Apollo, MedPlus, Jan Aushadhi and more — all in one place.",
  },
  {
    bg: "bg-white text-foreground",
    emoji: "🏛",
    titleClass: "text-primary",
    title: "Jan Aushadhi — 92% Cheaper",
    subtitleClass: "text-mutedfg",
    subtitle:
      "Government-approved generic medicines at 1/10th the branded price. We'll find the nearest store for you.",
  },
];

function OnboardingPage() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { complete } = useOnboarding();
  const last = i === slides.length - 1;
  const s = slides[i];

  const finish = () => {
    complete();
    navigate({ to: "/" });
  };

  return (
    <div className={`relative flex min-h-screen flex-col overflow-hidden ${s.bg}`}>
      <button
        onClick={finish}
        className={`absolute right-4 top-4 z-10 text-sm font-medium ${
          i === 0 ? "text-white/85" : "text-mutedfg"
        } hover:underline`}
      >
        Skip
      </button>

      <div className="flex flex-1 items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto max-w-md text-center"
          >
            {s.emoji === "compare" ? (
              <div className="mx-auto mb-6 grid w-fit grid-cols-3 gap-2">
                {[
                  { name: "Apollo", price: 89, color: "bg-white border border-border" },
                  { name: "MedPlus", price: 36, color: "bg-primary text-white" },
                  { name: "JanAushadhi", price: 8, color: "bg-warning text-white" },
                ].map((t) => (
                  <div key={t.name} className={`rounded-xl ${t.color} px-3 py-3 shadow-sm`}>
                    <div className="text-[10px] opacity-80">{t.name}</div>
                    <div className="text-xl font-bold tabular-nums">₹{t.price}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 text-7xl">{s.emoji}</div>
            )}
            <h2 className={`text-2xl font-bold leading-tight ${s.titleClass}`}>{s.title}</h2>
            <p className={`mt-3 text-sm leading-relaxed ${s.subtitleClass}`}>{s.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 pt-4">
        <div className="mb-5 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-primary" : "w-2 bg-mutedfg/40"
              } ${i === 0 && idx !== i ? "bg-white/40" : ""} ${i === 0 && idx === i ? "bg-white" : ""}`}
            />
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => (last ? finish() : setI(i + 1))}
          className={`w-full rounded-full py-3 font-semibold transition ${
            i === 0 ? "bg-white text-primary" : "bg-primary text-primary-foreground hover:bg-primary-dark"
          }`}
        >
          {last ? "Get Started →" : "Next"}
        </motion.button>
      </div>
    </div>
  );
}
