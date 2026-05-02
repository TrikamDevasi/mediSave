import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, loading, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="w-full space-y-1.5">
        <div className="input-wrapper group">
          <input
            id={id}
            ref={ref}
            className={cn(
              "input-field peer",
              error && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-light)]",
              className
            )}
            placeholder=" "
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              "input-label",
              error && "text-[var(--color-danger)] peer-focus:text-[var(--color-danger)]"
            )}
          >
            {label}
          </label>
          
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="btn-spinner text-[var(--color-primary)]" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-[10px] font-bold text-[var(--color-danger)] uppercase tracking-widest pl-4">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
