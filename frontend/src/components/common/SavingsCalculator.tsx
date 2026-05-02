"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Sparkles } from "lucide-react"

export function SavingsCalculator() {
  const [medCount, setMedCount] = useState(3)
  const avgSavingPerMed = 45
  const annualSaving = medCount * avgSavingPerMed * 12

  return (
    <div className="holo-card bento-cell bg-gradient-to-br from-primary to-primary-active text-white p-8 flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> Custom Estimate
        </div>
        <p className="text-sm font-medium opacity-80">Your annual savings</p>
        
        <div className="relative mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={annualSaving}
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-5xl font-black tracking-tighter"
            >
              ₹{annualSaving.toLocaleString("en-IN")}
            </motion.div>
          </AnimatePresence>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.5 }}
            key={`pulse-${annualSaving}`}
            className="absolute inset-0 bg-white/20 blur-2xl rounded-full"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm font-bold opacity-90 mb-4">
          <span className="flex items-center gap-2">
            Medicines / month
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-accent">{medCount}</span>
        </div>
        
        <div className="relative h-6 flex items-center">
          <input
            type="range" 
            min={1} 
            max={20} 
            value={medCount}
            onChange={(e) => setMedCount(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(medCount-1)/19*100}%, rgba(255,255,255,0.2) ${(medCount-1)/19*100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
          <span>1 med</span>
          <span>20+ meds</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-[10px] leading-relaxed opacity-60 font-medium italic">
          Based on avg ₹{avgSavingPerMed} saved per medicine using generic alternatives and Jan Aushadhi stores.
        </p>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/search'}
          className="mt-4 w-full bg-white text-primary font-black py-3 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-black/10 transition-all hover:bg-accent hover:text-white"
        >
          See exact savings →
        </motion.button>
      </div>
    </div>
  )
}
