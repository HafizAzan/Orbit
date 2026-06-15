import React from "react";
import { cn } from "../../lib/utils";
import Skeleton from "./skeleton-base";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  showToolbar?: boolean;
  className?: string;
};

function TableSkeleton({
  rows = 8,
  columns = 5,
  showToolbar = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      {showToolbar ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Skeleton className="h-10 min-w-[220px] flex-1 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      ) : null}

      <div className="border-b border-border bg-muted/10 px-4 py-3">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={`head-${index}`} className="h-4 w-full max-w-28" />
          ))}
        </div>
      </div>

      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-4">
            <div
              className="grid items-center gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }, (_, columnIndex) => (
                <Skeleton
                  key={`${rowIndex}-${columnIndex}`}
                  className={cn("h-4 w-full", columnIndex === 0 ? "max-w-40" : "max-w-24")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(TableSkeleton);
