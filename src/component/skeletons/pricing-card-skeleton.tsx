import React from "react";
import { cn } from "../../lib/utils";
import Skeleton from "./skeleton-base";

type PricingCardSkeletonProps = {
  highlighted?: boolean;
  className?: string;
};

function PricingCardSkeleton({ highlighted = false, className }: PricingCardSkeletonProps) {
  return (
    <article
      className={cn(
        "relative flex h-full min-h-0 flex-col rounded-2xl border bg-card p-6 shadow-sm nav:p-8",
        highlighted ? "border-primary shadow-lg nav:scale-105" : "border-border nav:scale-[0.98]",
        className,
      )}
    >
      {highlighted ? <Skeleton className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full" /> : null}

      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      <div className="mt-6 flex items-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="mt-6 min-h-52 max-h-72 flex-1 space-y-3 overflow-hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
    </article>
  );
}

type PricingCardsGridSkeletonProps = {
  count?: number;
  className?: string;
};

function PricingCardsGridSkeleton({ count = 3, className }: PricingCardsGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 nav:grid-cols-3 nav:items-stretch nav:gap-6 nav:py-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <PricingCardSkeleton key={index} highlighted={index === 1 && count >= 3} />
      ))}
    </div>
  );
}

export default React.memo(PricingCardSkeleton);
export { PricingCardsGridSkeleton };
