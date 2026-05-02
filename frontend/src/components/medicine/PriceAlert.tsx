import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, X, TrendingDown, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PriceAlertProps {
  medicineName: string;
  currentPrice: number;
  onClose: () => void;
}

export function PriceAlert({ medicineName, currentPrice, onClose }: PriceAlertProps) {
  const [step, setStep] = React.useState<"initial" | "success">("initial");
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    // In real app, call API here
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 100, scale: 0.95 }}
        className="w-full max-w-md bg-elevation-3 border border-divider rounded-[32px] overflow-hidden shadow-elevation-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === "initial" ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <BellRing className="h-7 w-7" />
                 </div>
                 <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
                   <X className="h-5 w-5" />
                 </button>
              </div>

              <h2 className="text-3xl font-black tracking-tighter mb-2">Price Drop Alert</h2>
              <p className="text-muted-foreground font-medium mb-8">
                We'll notify you when <span className="text-foreground font-bold">{medicineName}</span> falls below ₹{currentPrice}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <Input 
                   label="Email Address" 
                   type="email" 
                   required 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
                 <div className="bg-surface-2 p-4 rounded-2xl border border-divider flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-success shrink-0" />
                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
                       We never spam. You'll only receive price alerts and critical generic availability updates.
                    </p>
                 </div>
                 <Button type="submit" variant="primary" size="xl" fullWidth className="font-black uppercase tracking-widest text-xs">
                    Activate Alert <ArrowRight className="h-4 w-4 ml-2" />
                 </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
               <div className="relative w-24 h-24 mx-auto mb-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-success/10 rounded-full"
                  />
                  <motion.div 
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-success"
                  >
                     <ShieldCheck className="h-12 w-12" />
                  </motion.div>
               </div>
               <h2 className="text-3xl font-black tracking-tighter mb-4">You're all set!</h2>
               <p className="text-muted-foreground font-medium mb-10">
                 Watch your inbox. We've sent a verification link to <span className="text-foreground font-bold">{email}</span>.
               </p>
               <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
                  Got it
               </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
