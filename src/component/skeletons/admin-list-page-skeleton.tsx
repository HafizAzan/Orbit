import React from "react";
import { cn } from "../../lib/utils";
import PageHeaderSkeleton from "./page-header-skeleton";
import { StatCardsGridSkeleton } from "./stat-card-skeleton";
import TableSkeleton from "./table-skeleton";

type AdminListPageSkeletonProps = {
  statCount?: number;
  tableRows?: number;
  tableColumns?: number;
  showHeaderAction?: boolean;
  className?: string;
};

function AdminListPageSkeleton({
  statCount = 4,
  tableRows = 8,
  tableColumns = 5,
  showHeaderAction = true,
  className,
}: AdminListPageSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-8xl", className)} aria-busy aria-label="Loading page content">
      <PageHeaderSkeleton showAction={showHeaderAction} />
      <StatCardsGridSkeleton count={statCount} className="mb-6 mt-6" />
      <TableSkeleton rows={tableRows} columns={tableColumns} />
    </div>
  );
}

export default React.memo(AdminListPageSkeleton);
