"use client"
import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AmbientSound() {
  const [soundOn, setSoundOn] = useState(false)

  const toggleSound = () => setSoundOn(!soundOn)

  return (
    <div className="fixed bottom-32 right-6 z-40">
      <AnimatePresence>
        {soundOn && (
          <>
            <motion.div 
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="sound-ripple" 
            />
            <motion.div 
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
              className="sound-ripple" 
            />
            <motion.div 
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
              className="sound-ripple" 
            />
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSound}
        className="relative w-10 h-10 rounded-full bg-surface border border-divider flex items-center justify-center shadow-lg hover:border-primary/50 transition-colors"
        aria-label={soundOn ? "Mute ambient atmosphere" : "Unmute ambient atmosphere"}
      >
        {soundOn ? <Volume2 size={16} className="text-primary" /> : <VolumeX size={16} className="text-muted-foreground" />}
      </motion.button>
    </div>
  )
}
