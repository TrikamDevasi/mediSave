import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", leftIcon, rightIcon, loading, fullWidth, disabled, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] shadow-sm",
      secondary: "bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-3)]",
      ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
      danger: "bg-[var(--color-danger)] text-white hover:bg-red-700 active:bg-red-800",
      success: "bg-[var(--color-success)] text-white hover:bg-green-700 active:bg-green-800",
    };

    const sizes = {
      xs: "h-7 px-3 text-[10px] uppercase tracking-widest font-black",
      sm: "h-8 px-4 text-xs font-bold",
      md: "h-10 px-6 text-sm font-semibold",
      lg: "h-12 px-8 text-base font-bold",
      xl: "h-14 px-10 text-lg font-extrabold",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? { translateY: -1 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98, translateY: 0 } : {}}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "w-auto",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="btn-spinner" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span className={cn(loading && "opacity-70")}>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
