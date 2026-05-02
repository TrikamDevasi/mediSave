"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SavingsToast({ amount, show }: { 
  amount: number; show: boolean 
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60, x: "-50%", scale: 0.8 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-24 left-1/2 z-[100] 
                     bg-teal-600 text-white px-6 py-3.5 rounded-full
                     shadow-2xl shadow-teal-500/40 font-bold text-sm
                     flex items-center gap-2 border border-white/20 whitespace-nowrap"
        >
          <span className="text-lg">💊</span>
          <span>Save ₹{amount} on this medicine!</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
