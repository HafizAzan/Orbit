import { Table as AntTable, type TableProps as AntTableProps } from "antd";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import TableEmpty from "./table-empty";

/** Scroll area height — consistent min area; overflow scrolls inside the wrapper. */
const DEFAULT_TABLE_SCROLL_HEIGHT = 480;

type TableProps<T extends object> = AntTableProps<T> & {
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  wrapperClassName?: string;
};

function Table<T extends object>({
  emptyTitle,
  emptyDescription,
  emptyAction,
  wrapperClassName,
  className,
  locale,
  pagination,
  scroll,
  ...props
}: TableProps<T>) {
  const emptyNode = (
    <TableEmpty
      title={emptyTitle}
      description={emptyDescription}
      action={emptyAction}
    />
  );

  const tableScroll = scroll ? { ...scroll, y: undefined } : undefined;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", wrapperClassName)}>
      <div
        className="overflow-auto"
        style={{ minHeight: DEFAULT_TABLE_SCROLL_HEIGHT, maxHeight: DEFAULT_TABLE_SCROLL_HEIGHT }}
      >
        <AntTable<T>
          {...props}
          scroll={tableScroll}
          className={cn(
            "[&_.ant-table]:bg-transparent!",
            "[&_.ant-table-thead>tr>th]:bg-background! [&_.ant-table-thead>tr>th]:text-xs! [&_.ant-table-thead>tr>th]:font-semibold! [&_.ant-table-thead>tr>th]:uppercase! [&_.ant-table-thead>tr>th]:tracking-wide! [&_.ant-table-thead>tr>th]:text-muted!",
            "[&_.ant-table-thead>tr>th:before]:hidden!",
            "[&_.ant-table-tbody>tr>td]:border-border!",
            "[&_.ant-table-tbody>tr:hover>td]:bg-background/60!",
            className,
          )}
          locale={{
            ...locale,
            emptyText: locale?.emptyText ?? emptyNode,
          }}
          pagination={
            pagination === false
              ? false
              : {
                  showSizeChanger: false,
                  className: "font-medium!",
                  ...pagination,
                }
          }
        />
      </div>
    </div>
  );
}

export default Table;
export type { TableProps };
