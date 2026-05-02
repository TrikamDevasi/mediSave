import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ParticleBurst({ trigger }: { trigger: boolean }) {
  const particles = React.useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
    x: Math.cos((i * Math.PI * 2) / 8) * 40,
    y: Math.sin((i * Math.PI * 2) / 8) * 40,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        {trigger && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full bg-teal-400"
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ top: "50%", left: "50%", marginLeft: "-4px", marginTop: "-4px" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
