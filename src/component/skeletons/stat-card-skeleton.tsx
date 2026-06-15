import React from "react";
import { cn } from "../../lib/utils";
import Skeleton from "./skeleton-base";

type StatCardSkeletonProps = {
  className?: string;
};

function StatCardSkeleton({ className }: StatCardSkeletonProps) {
  return (
    <article className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-28" />
      <Skeleton className="mt-2 h-8 w-20" />
    </article>
  );
}

type StatCardsGridSkeletonProps = {
  count?: number;
  className?: string;
};

function StatCardsGridSkeleton({ count = 4, className }: StatCardsGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default React.memo(StatCardSkeleton);
export { StatCardsGridSkeleton };
