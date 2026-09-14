import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "green" | "gold" | "purple" | "blue" | "red" | "gray" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "green",
  children,
  ...props
}) => {
  const variants = {
    emerald: "bg-[#00d07d]/15 text-[#00b36b] dark:text-[#00d07d] border border-[#00d07d]/30 font-medium",
    green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium",
    gold: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-medium",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-medium",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-medium",
    red: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-medium",
    gray: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-medium",
    outline: "border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 font-normal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
