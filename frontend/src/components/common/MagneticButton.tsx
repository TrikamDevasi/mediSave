"use client"
import * as React from "react"
import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function MagneticButton({ children, className }: { 
  children: React.ReactNode; className?: string 
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia("(hover: none)").matches
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice()) return
    const rect = ref.current!.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}
