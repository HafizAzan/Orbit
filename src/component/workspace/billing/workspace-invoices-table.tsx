import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo } from "react";
import { WORKSPACE_INVOICE_STATUS_STYLES } from "../../../data/workspace-billing";
import { formatCurrency, formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import type { BillingInvoice } from "../../../types/billing.types";
import Table from "../../ui/table";

type WorkspaceInvoicesTableProps = {
  invoices: BillingInvoice[];
  loading?: boolean;
  onViewInvoice: (invoice: BillingInvoice) => void;
};

function WorkspaceInvoicesTable({ invoices, loading = false, onViewInvoice }: WorkspaceInvoicesTableProps) {
  const columns = useMemo<ColumnsType<BillingInvoice>>(
    () => [
      {
        title: "Invoice",
        dataIndex: "number",
        key: "number",
        render: (number: string | null, record) => (
          <div>
            <p className="font-semibold text-foreground">{number ?? record.id}</p>
            <p className="text-xs text-muted">{formatDate(record.createdAt)}</p>
          </div>
        ),
      },
      {
        title: "Period",
        key: "period",
        render: (_, record) =>
          record.periodStart && record.periodEnd ? (
            <span className="text-sm text-muted">
              {formatDate(record.periodStart)} – {formatDate(record.periodEnd)}
            </span>
          ) : (
            <span className="text-sm text-muted">—</span>
          ),
      },
      {
        title: "Amount",
        key: "amount",
        align: "right",
        render: (_, record) => (
          <span className="font-semibold text-foreground">
            {formatCurrency(record.amountPaid || record.amountDue, record.currency, 2)}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string | null) => {
          const key = status?.toLowerCase() ?? "paid";
          const style = WORKSPACE_INVOICE_STATUS_STYLES[key] ?? WORKSPACE_INVOICE_STATUS_STYLES.paid;

          return (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                style.badge,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
              {style.label}
            </span>
          );
        },
      },
      {
        title: "",
        key: "actions",
        width: 120,
        align: "right",
        render: (_, record) => (
          <Button
            type="link"
            icon={<EyeOutlined />}
            className="font-semibold!"
            onClick={() => onViewInvoice(record)}
          >
            View
          </Button>
        ),
      },
    ],
    [onViewInvoice],
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={invoices}
      loading={loading}
      pagination={false}
      locale={{
        emptyText: "No invoices yet.",
      }}
    />
  );
}

export default React.memo(WorkspaceInvoicesTable);
