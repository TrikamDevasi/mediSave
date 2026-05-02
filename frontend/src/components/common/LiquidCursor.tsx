"use client"
import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function LiquidCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)
  
  const trailXSpring = useSpring(trailX, { damping: 35, stiffness: 120 })
  const trailYSpring = useSpring(trailY, { damping: 35, stiffness: 120 })

  const isHovering = useRef(false)

  useEffect(() => {
    /* Only on non-touch devices */
    if (typeof window === 'undefined' || window.matchMedia("(hover: none)").matches) return
    
    /* Hide default cursor */
    document.body.style.cursor = "none"

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8)
      cursorY.set(e.clientY - 8)
      trailX.set(e.clientX - 20)
      trailY.set(e.clientY - 20)
    }

    const handleHoverIn = () => { isHovering.current = true }
    const handleHoverOut = () => { isHovering.current = false }

    document.addEventListener("mousemove", move)
    
    const interactiveElements = document.querySelectorAll("button, a, [role=button]")
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", handleHoverIn)
      el.addEventListener("mouseleave", handleHoverOut)
    })

    return () => {
      document.body.style.cursor = "auto"
      document.removeEventListener("mousemove", move)
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", handleHoverIn)
        el.removeEventListener("mouseleave", handleHoverOut)
      })
    }
  }, [cursorX, cursorY, trailX, trailY])

  return (
    <>
      {/* Small precise dot */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
      />
      {/* Large laggy trail circle */}
      <motion.div
        style={{ x: trailXSpring, y: trailYSpring }}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-primary/50 pointer-events-none z-[9999] mix-blend-difference"
      />
    </>
  )
}
