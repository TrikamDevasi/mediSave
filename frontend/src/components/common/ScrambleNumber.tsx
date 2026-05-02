"use client"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

export function ScrambleNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const chars = "0123456789"
  const [display, setDisplay] = useState("")
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView || done) return

    let iteration = 0
    const target = value
    const interval = setInterval(() => {
      setDisplay(
        target.split("").map((char, i) => {
          if (i < iteration) return char
          if (!/[0-9]/.test(char)) return char
          return chars[Math.floor(Math.random() * chars.length)]
        }).join("")
      )
      
      if (iteration >= target.length) {
        clearInterval(interval)
        setDone(true)
      }
      
      iteration += 0.5
    }, 50)
    
    return () => clearInterval(interval)
  }, [value, isInView, done])

  return (
    <span ref={ref} className="font-mono font-black tabular-nums">
      {display || "0"}{suffix}
    </span>
  )
}
