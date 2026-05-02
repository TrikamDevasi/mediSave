import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated" | "outlined" | "ghost" | "teal" | "dark";
export type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  selected?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", hoverable, selected, children, ...props }, ref) => {
    
    const variants = {
      default: "bg-[var(--elevation-1)] border-[var(--color-border)]",
      elevated: "bg-[var(--elevation-2)] border-transparent shadow-[var(--shadow-elevation-2)]",
      outlined: "bg-transparent border-[var(--color-border-strong)]",
      ghost: "bg-transparent border-transparent shadow-none",
      teal: "bg-[var(--color-primary)] text-white border-transparent",
      dark: "bg-[#0a0f0f] text-white border-white/10",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { translateY: -2 } : {}}
        className={cn(
          "card rounded-[24px] border transition-all duration-300",
          variants[variant],
          paddings[padding],
          hoverable && "card-hoverable cursor-pointer shadow-md hover:shadow-xl",
          selected && "card-selected border-primary",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export { Card };
