"use client"
import * as React from "react"
import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export function TiltCard({ children, className }: { 
  children: React.ReactNode; className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia("(hover: none)").matches
  }
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { 
    stiffness: 200, damping: 20 
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { 
    stiffness: 200, damping: 20 
  })
  const glare = useSpring(useTransform(x, [-0.5, 0.5], [0, 1]), {
    stiffness: 200, damping: 20
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice()) return
    const rect = ref.current!.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d", 
        perspective: 1000 
      }}
      className={className}
    >
      {/* Glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl z-20"
        style={{
          background: useTransform(
            glare,
            [0, 1],
            ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"]
          ),
        }}
      />
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  )
}
