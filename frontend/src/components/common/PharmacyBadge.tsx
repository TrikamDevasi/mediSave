"use client"
import * as React from "react"

const pharmacyColors: Record<string, string> = {
  "Apollo":       "var(--color-apollo)",
  "MedPlus":      "var(--color-medplus)",
  "1mg":          "var(--color-onemg)",
  "Netmeds":      "var(--color-netmeds)",
  "Jan Aushadhi": "var(--color-janaushadhi)",
}

export function PharmacyBadge({ name }: { name: string }) {
  const color = pharmacyColors[name] ?? "var(--color-primary)"
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border"
      style={{ 
        backgroundColor: `color-mix(in srgb, ${color}, transparent 88%)`,
        color: color,
        borderColor: `color-mix(in srgb, ${color}, transparent 75%)`
      }}
    >
      {name}
    </span>
  )
}
