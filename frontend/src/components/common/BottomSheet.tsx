"use client"
import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import { X } from "lucide-react"

export function BottomSheet({ 
  isOpen, onClose, children, title 
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}) {
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 300], [1, 0])
  const scale = useTransform(y, [0, 300], [1, 0.95])

  // Fix 7.1 — iOS Rubber-band scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      animate(y, 600, { duration: 0.3 }).then(onClose)
    } else {
      animate(y, 0, { type: "spring", stiffness: 400, damping: 40 })
    }
  }

  const portalRoot = typeof document !== "undefined" ? document.getElementById("portal-root") : null

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex flex-col justify-end overflow-hidden">
          {/* Backdrop — Fix 1.1: Use scale z-index */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-[var(--z-overlay)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet Container — Fix 3.1: Consistent Radius */}
          <motion.div
            style={{ y }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-[var(--z-modal)] w-full max-w-2xl mx-auto bg-surface rounded-t-[var(--radius-2xl)] shadow-elevation-4 overflow-hidden flex flex-col max-h-[92dvh]"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-divider" />
            </div>

            {/* Header — Fix 4.3: Text Wrap Balance */}
            <div className="px-8 py-4 border-b border-divider flex items-center justify-between">
              <h3 className="font-black text-xl tracking-tight text-foreground text-wrap-balance">{title}</h3>
              <button 
                onClick={onClose}
                className="p-3 rounded-full hover:bg-surface-2 transition-colors border border-divider"
                aria-label="Close sheet"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <motion.div 
              style={{ opacity, scale }} 
              className="p-8 overflow-y-auto no-scrollbar pb-24"
            >
              {children}
            </motion.div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (!portalRoot) return null
  return createPortal(content, portalRoot)
}
