"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Ahmedabad", 
  "Chennai", "Hyderabad", "Pune", "Kolkata",
  "Surat", "Jaipur"
]

export function CityFlip() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % cities.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-foreground/50 mb-8 bg-surface-2/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-divider shadow-md transition-all hover:border-primary/50">
      <MapPin className="h-3.5 w-3.5 text-primary" />
      <span>Prices for</span>
      <div className="overflow-hidden h-5 relative w-32">
        <AnimatePresence mode="wait">
          <motion.span
            key={cities[index]}
            className="absolute font-black text-primary text-sm tracking-tight"
            initial={{ y: 24, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -24, opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "center center" }}
          >
            {cities[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <button className="text-[9px] underline underline-offset-4 opacity-40 hover:opacity-100 transition-opacity">
        Detect city
      </button>
    </div>
  )
}
