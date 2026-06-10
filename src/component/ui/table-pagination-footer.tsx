import { Pagination } from "antd";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type TablePaginationFooterProps = {
  summary: ReactNode;
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
};

function TablePaginationFooter({
  summary,
  current,
  pageSize,
  total,
  onChange,
  className,
}: TablePaginationFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="shrink-0">{summary}</div>

      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        className={cn(
          "[&_.ant-pagination-item]:mb-0!",
          "[&_.ant-pagination-item]:h-9! [&_.ant-pagination-item]:min-w-9! [&_.ant-pagination-item]:rounded-lg! [&_.ant-pagination-item]:border! [&_.ant-pagination-item]:border-border! [&_.ant-pagination-item]:leading-9!",
          "[&_.ant-pagination-item-active]:border-primary! [&_.ant-pagination-item-active]:bg-feature-sync!",
          "[&_.ant-pagination-item-active_a]:font-semibold! [&_.ant-pagination-item-active_a]:text-primary!",
          "[&_.ant-pagination-prev]:mb-0! [&_.ant-pagination-next]:mb-0!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:flex! [&_.ant-pagination-next_.ant-pagination-item-link]:flex!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:h-9! [&_.ant-pagination-next_.ant-pagination-item-link]:h-9!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:min-w-9! [&_.ant-pagination-next_.ant-pagination-item-link]:min-w-9!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:items-center! [&_.ant-pagination-next_.ant-pagination-item-link]:items-center!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:justify-center! [&_.ant-pagination-next_.ant-pagination-item-link]:justify-center!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:rounded-lg! [&_.ant-pagination-next_.ant-pagination-item-link]:rounded-lg!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:border! [&_.ant-pagination-next_.ant-pagination-item-link]:border!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:border-border! [&_.ant-pagination-next_.ant-pagination-item-link]:border-border!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:bg-card! [&_.ant-pagination-next_.ant-pagination-item-link]:bg-card!",
          "[&_.ant-pagination-prev_.ant-pagination-item-link]:text-foreground! [&_.ant-pagination-next_.ant-pagination-item-link]:text-foreground!",
          "[&_.ant-pagination-disabled_.ant-pagination-item-link]:bg-background! [&_.ant-pagination-disabled_.ant-pagination-item-link]:text-muted!",
          "[&_.ant-pagination-disabled_.ant-pagination-item-link]:opacity-100!",
        )}
      />
    </div>
  );
}

export default TablePaginationFooter;
export type { TablePaginationFooterProps };
