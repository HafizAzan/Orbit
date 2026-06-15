import React from "react";
import { cn } from "../../lib/utils";
import Skeleton from "./skeleton-base";

type PageHeaderSkeletonProps = {
  showAction?: boolean;
  className?: string;
};

function PageHeaderSkeleton({ showAction = true, className }: PageHeaderSkeletonProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {showAction ? <Skeleton className="h-10 w-40 rounded-lg" /> : null}
    </div>
  );
}

export default React.memo(PageHeaderSkeleton);
