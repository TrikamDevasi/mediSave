"use client"
import { motion } from "framer-motion"

export function AnimatedHeadline({ text, delay = 0 }: { 
  text: string; delay?: number 
}) {
  const words = text.split(" ")
  
  return (
    <span className="inline-flex flex-wrap gap-x-[0.25em]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 60, rotateX: -40 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ transformOrigin: "bottom center", display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
