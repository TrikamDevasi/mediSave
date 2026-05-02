import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "govt" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

const Badge = ({
  className,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) => {
  
  const variants = {
    default: "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]",
    primary: "bg-[var(--color-primary-glow)] text-[var(--color-primary)] border-[var(--color-primary-glow)]",
    success: "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success-light)]",
    warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning-light)]",
    danger:  "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger-light)]",
    govt:    "bg-[var(--color-govt-light)] text-[var(--color-govt)] border-[var(--color-govt-light)]",
    outline: "bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)]",
  };

  const sizes = {
    sm: "h-5 px-2 text-[9px]",
    md: "h-6 px-2.5 text-[10px]",
    lg: "h-7 px-3 text-xs",
  };

  const dotColors = {
    default: "bg-[var(--color-text-faint)]",
    primary: "bg-[var(--color-primary)]",
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    danger:  "bg-[var(--color-danger)]",
    govt:    "bg-[var(--color-govt)]",
    outline: "bg-[var(--color-text-faint)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-widest transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1 w-1 rounded-full animate-pulse", dotColors[variant])} />}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  );
};

export { Badge };
