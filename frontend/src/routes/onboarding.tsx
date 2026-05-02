import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Pill, 
  Zap, 
  Sparkles, 
  HeartPulse,
  TrendingUp,
  X
} from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to MediSave" },
      { name: "description", content: "Get started with MediSave — compare medicine prices and save up to 70%." },
    ],
  }),
  component: OnboardingPage,
});

const categories = [
  { name: "Diabetes", icon: "🍬" },
  { name: "Blood Pressure", icon: "🫀" },
  { name: "Heart", icon: "❤️" },
  { name: "Thyroid", icon: "⚖️" },
  { name: "Pain Relief", icon: "🩹" },
  { name: "Vitamins", icon: "🧬" }
];

const medicineDemo = [
  { name: "Metformin", price: 68, janPrice: 18, savings: 50 },
  { name: "Atorvastatin", price: 92, janPrice: 24, savings: 68 },
  { name: "Paracetamol", price: 12, janPrice: 2, savings: 10 },
];

function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedMed, setSelectedMed] = useState<number | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const navigate = useNavigate();
  const { complete } = useOnboarding();

  const finish = () => {
    complete();
    navigate({ to: "/" });
  };

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const toggleCat = (cat: string) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-[#016a6f] text-white overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="px-6 pt-12 flex items-center justify-between z-10">
         {step > 0 && (
           <button onClick={back} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="h-6 w-6" />
           </button>
         )}
         <div className="flex-1" />
         {step < 4 && (
           <button onClick={finish} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white">
             Skip
           </button>
         )}
      </div>

      {/* Progress Dots */}
      <div className="px-6 pt-8 flex justify-center gap-1.5 z-10">
         {[0, 1, 2, 3].map(i => (
           <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
         ))}
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 0: TRUST FIRST */}
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="text-center max-w-sm"
            >
               <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl">
                  <ShieldCheck className="h-12 w-12 text-white" />
               </div>
               <h1 className="text-4xl font-black tracking-tighter mb-4">Before we start...</h1>
               <div className="space-y-4 text-left mb-12">
                  {[
                    "We never sell your data",
                    "No spam calls or SMS",
                    "DPDP Act 2023 compliant",
                    "Free, no hidden charges"
                  ].map(t => (
                    <div key={t} className="flex items-center gap-3">
                       <Zap className="h-4 w-4 text-white/40" />
                       <span className="font-bold text-white/80">{t}</span>
                    </div>
                  ))}
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-8">Used by 1,00,000+ families across India</p>
               <Button variant="secondary" size="xl" fullWidth onClick={next} className="bg-white text-[#016a6f] border-transparent font-black uppercase tracking-widest text-xs">
                 I understand, let's save money →
               </Button>
            </motion.div>
          )}

          {/* SCREEN 1: VALUE DEMONSTRATION */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="text-center w-full max-w-sm"
            >
               <h2 className="text-3xl font-black tracking-tighter mb-8">Pick your most common medicine</h2>
               <div className="grid grid-cols-2 gap-3 mb-10">
                  {medicineDemo.map((m, i) => (
                    <button 
                      key={m.name}
                      onClick={() => setSelectedMed(i)}
                      className={`p-4 rounded-2xl border transition-all ${selectedMed === i ? 'bg-white text-[#016a6f] border-white shadow-xl scale-105' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      <div className="font-bold">{m.name}</div>
                    </button>
                  ))}
               </div>

               <AnimatePresence>
                  {selectedMed !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-left mb-10"
                    >
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Typical Price</span>
                          <span className="text-xl font-bold">₹{medicineDemo[selectedMed].price}</span>
                       </div>
                       <div className="flex justify-between items-center mb-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary-light">Jan Aushadhi</span>
                          <span className="text-3xl font-black text-white">₹{medicineDemo[selectedMed].janPrice}</span>
                       </div>
                       <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                             <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-black text-lg">You just saved ₹{medicineDemo[selectedMed].savings} 🎉</span>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               <Button variant="secondary" size="xl" fullWidth onClick={next} disabled={selectedMed === null} className="bg-white text-[#016a6f] border-transparent font-black uppercase tracking-widest text-xs disabled:opacity-30">
                 That's impressive, next →
               </Button>
            </motion.div>
          )}

          {/* SCREEN 2: LOCATION PERMISSION */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="text-center max-w-sm"
            >
               <div className="relative w-48 h-48 mx-auto mb-10">
                  <div className="absolute inset-0 bg-white/5 rounded-full animate-ping" />
                  <div className="absolute inset-4 bg-white/10 rounded-full animate-pulse" />
                  <div className="absolute inset-12 bg-white flex items-center justify-center rounded-full shadow-2xl">
                     <MapPin className="h-10 w-10 text-[#016a6f]" />
                  </div>
               </div>
               <h2 className="text-4xl font-black tracking-tighter mb-4">Find pharmacies near you</h2>
               <p className="text-white/60 font-medium leading-relaxed mb-12">
                 We need your location to show prices at pharmacies within 2km. Your data stays on your device.
               </p>
               
               <div className="space-y-4">
                  <Button variant="secondary" size="xl" fullWidth onClick={next} className="bg-white text-[#016a6f] border-transparent font-black uppercase tracking-widest text-xs">
                    Allow location
                  </Button>
                  <Button variant="ghost" size="lg" fullWidth onClick={next} className="text-white/60 hover:text-white">
                    Enter pincode instead
                  </Button>
               </div>
               
               <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/30">Location is never stored on our servers</p>
            </motion.div>
          )}

          {/* SCREEN 3: PERSONALIZATION */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="text-center w-full max-w-sm"
            >
               <h2 className="text-3xl font-black tracking-tighter mb-4">What medicines do you take regularly?</h2>
               <p className="text-white/60 text-sm mb-8">We'll alert you when prices drop for these categories.</p>
               
               <div className="grid grid-cols-2 gap-3 mb-12">
                  {categories.map((c) => (
                    <button 
                      key={c.name}
                      onClick={() => toggleCat(c.name)}
                      className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${selectedCats.includes(c.name) ? 'bg-white text-[#016a6f] border-white shadow-xl' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      <span className="text-2xl">{c.icon}</span>
                      <span className="font-bold text-sm leading-tight">{c.name}</span>
                    </button>
                  ))}
               </div>

               <Button variant="secondary" size="xl" fullWidth onClick={finish} className="bg-white text-[#016a6f] border-transparent font-black uppercase tracking-widest text-xs">
                 Finalize Setup →
               </Button>
               
               <p className="mt-8 text-white/30 text-xs font-medium">You can change this anytime in settings</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
