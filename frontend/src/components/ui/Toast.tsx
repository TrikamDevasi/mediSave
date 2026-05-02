import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "price-drop";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-success" />,
    error: <AlertCircle className="h-5 w-5 text-danger" />,
    info: <Info className="h-5 w-5 text-primary" />,
    "price-drop": <Zap className="h-5 w-5 text-accent animate-pulse" />,
  };

  const backgrounds = {
    success: "bg-surface border-success/20",
    error: "bg-surface border-danger/20",
    info: "bg-surface border-primary/20",
    "price-drop": "bg-foreground border-white/10 text-background",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-[var(--radius-lg)] border shadow-elevation-3 min-w-[320px] max-w-md",
        backgrounds[type]
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-bold tracking-tight">{message}</div>
      <button onClick={onClose} className="shrink-0 p-2 opacity-40 hover:opacity-100 transition-opacity" aria-label="Close toast">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  const portalRoot = typeof document !== "undefined" ? document.getElementById("portal-root") : null;

  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[var(--z-toast)] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>,
    portalRoot
  );
}
