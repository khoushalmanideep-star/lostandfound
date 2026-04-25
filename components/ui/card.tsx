import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("saas-card", className)} {...props} />;
}

export function CardHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

