import React from "react";
import { cn } from "../../lib/utils";
import Skeleton from "./skeleton-base";

type ChartCardSkeletonProps = {
  className?: string;
  tall?: boolean;
};

function ChartCardSkeleton({ className, tall = false }: ChartCardSkeletonProps) {
  return (
    <article className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton className={cn("mt-6 w-full rounded-xl", tall ? "h-72" : "h-56")} />
    </article>
  );
}

type PanelCardSkeletonProps = {
  lines?: number;
  className?: string;
};

function PanelCardSkeleton({ lines = 4, className }: PanelCardSkeletonProps) {
  return (
    <article className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      <Skeleton className="h-5 w-36" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </article>
  );
}

export default React.memo(ChartCardSkeleton);
export { PanelCardSkeleton };
