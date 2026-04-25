import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const variantClass: Record<BadgeVariant, string> = {
  default: "saas-badge",
  success:
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-900/25 dark:text-emerald-200",
  warning:
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/25 dark:text-amber-200",
  danger:
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800/60 dark:bg-rose-900/25 dark:text-rose-200",
  info:
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-800/60 dark:bg-indigo-900/25 dark:text-indigo-200",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={cn(variantClass[variant], className)} {...props} />;
}

