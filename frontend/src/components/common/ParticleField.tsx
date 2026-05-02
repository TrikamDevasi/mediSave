"use client"
import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number
  vx: number; vy: number
  targetX: number; targetY: number
  size: number; opacity: number; color: string
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const parent = canvas.parentElement!
    
    const resize = () => {
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }
    
    resize()
    window.addEventListener("resize", resize)

    const colors = ["#0d9ea6", "#fbbf24", "#4ade80", "#a78bfa"]
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 30 : 60 

    /* Generate capsule shape target positions */
    const getCapsulePoints = (n: number) => {
      const points: {x: number, y: number}[] = []
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const rx = isMobile ? 100 : 160, ry = isMobile ? 40 : 60
      
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2
        points.push({
          x: cx + rx * Math.cos(t) + (Math.random()-0.5)*30,
          y: cy + ry * Math.sin(t) + (Math.random()-0.5)*30
        })
      }
      return points
    }

    let targets = getCapsulePoints(count)
    const particles: Particle[] = Array.from({length: count}, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random()-0.5) * 2,
      vy: (Math.random()-0.5) * 2,
      targetX: targets[i % targets.length].x,
      targetY: targets[i % targets.length].y,
      size: Math.random() * 1.5 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    let mode: "form" | "drift" = "form"
    let tick = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick++

      if (tick % 240 === 0) {
        mode = mode === "form" ? "drift" : "form"
        if (mode === "form") targets = getCapsulePoints(count)
      }

      particles.forEach((p, i) => {
        if (mode === "form") {
          p.vx += (p.targetX - p.x) * 0.01
          p.vy += (p.targetY - p.y) * 0.01
          p.vx *= 0.92
          p.vy *= 0.92
        } else {
          p.vx += (Math.random()-0.5) * 0.1
          p.vy += (Math.random()-0.5) * 0.1
          p.vx *= 0.98
          p.vy *= 0.98
        }
        
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2,"0")
        ctx.fill()

        // Connection lines - Only on Desktop for performance
        if (!isMobile) {
          particles.slice(i+1).forEach(p2 => {
            const dist = Math.hypot(p.x-p2.x, p.y-p2.y)
            if (dist < 70) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(13,158,166,${0.1 * (1 - dist/70)})`
              ctx.lineWidth = 0.4
              ctx.stroke()
            }
          })
        }
      })

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.35,
        mixBlendMode: 'screen',
        zIndex: 0,
      }}
    />
  )
}
