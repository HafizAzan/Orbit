import React from "react";
import { cn } from "../../lib/utils";
import ChartCardSkeleton, { PanelCardSkeleton } from "./chart-card-skeleton";
import PageHeaderSkeleton from "./page-header-skeleton";
import { StatCardsGridSkeleton } from "./stat-card-skeleton";
import TableSkeleton from "./table-skeleton";

type AdminSubscriptionsPageSkeletonProps = {
  className?: string;
};

function AdminSubscriptionsPageSkeleton({ className }: AdminSubscriptionsPageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)} aria-busy aria-label="Loading subscriptions">
      <PageHeaderSkeleton />

      <StatCardsGridSkeleton count={4} className="mb-6 mt-6" />

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCardSkeleton tall />
        </div>
        <PanelCardSkeleton lines={5} />
      </div>

      <TableSkeleton rows={8} columns={6} />
    </div>
  );
}

export default React.memo(AdminSubscriptionsPageSkeleton);
