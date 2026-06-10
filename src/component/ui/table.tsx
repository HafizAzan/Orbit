import { Table as AntTable, type TableProps as AntTableProps } from "antd";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import TableEmpty from "./table-empty";

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
  ...props
}: TableProps<T>) {
  const emptyNode = (
    <TableEmpty
      title={emptyTitle}
      description={emptyDescription}
      action={emptyAction}
    />
  );

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", wrapperClassName)}>
      <AntTable<T>
        {...props}
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
  );
}

export default Table;
export type { TableProps };
