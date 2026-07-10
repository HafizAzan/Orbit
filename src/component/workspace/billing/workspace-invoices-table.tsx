import { EyeOutlined, UndoOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo } from "react";
import { WORKSPACE_INVOICE_STATUS_STYLES } from "../../../data/workspace-billing";
import { formatCurrency, formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import type { BillingInvoice } from "../../../types/billing.types";
import Table from "../../ui/table";
import { Text } from "../../ui/typography";

type WorkspaceInvoicesTableProps = {
  invoices: BillingInvoice[];
  loading?: boolean;
  onViewInvoice: (invoice: BillingInvoice) => void;
  onRefundInvoice?: (invoice: BillingInvoice) => void;
  refundingInvoiceId?: string | null;
};

function WorkspaceInvoicesTable({
  invoices,
  loading = false,
  onViewInvoice,
  onRefundInvoice,
  refundingInvoiceId = null,
}: WorkspaceInvoicesTableProps) {
  const columns = useMemo<ColumnsType<BillingInvoice>>(
    () => [
      {
        title: "Invoice",
        dataIndex: "number",
        key: "number",
        render: (number: string | null, record) => (
          <div>
            <Text as="p" weight="semibold">{number ?? record.id}</Text>
            <Text as="p" size="xs" color="muted">
              {formatDate(record.createdAt)}
            </Text>
          </div>
        ),
      },
      {
        title: "Period",
        key: "period",
        render: (_, record) =>
          record.periodStart && record.periodEnd ? (
            <Text as="span" size="sm" color="muted">
              {formatDate(record.periodStart)} – {formatDate(record.periodEnd)}
            </Text>
          ) : (
            <Text as="span" size="sm" color="muted">
              —
            </Text>
          ),
      },
      {
        title: "Amount",
        key: "amount",
        align: "right",
        render: (_, record) => (
          <Text as="span" weight="semibold">
            {formatCurrency(record.amountPaid || record.amountDue, record.currency, 2)}
          </Text>
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
        title: "Refund window",
        key: "refundWindow",
        render: (_, record) =>
          record.refundable && record.refundWindowEndsAt ? (
            <Text as="span" size="sm" color="muted">
              Until {formatDate(record.refundWindowEndsAt)}
            </Text>
          ) : (
            <Text as="span" size="sm" color="muted">
              —
            </Text>
          ),
      },
      {
        title: "",
        key: "actions",
        width: 180,
        align: "right",
        render: (_, record) => (
          <div className="flex justify-end gap-1">
            {record.refundable && onRefundInvoice ? (
              <Button
                type="link"
                icon={<UndoOutlined />}
                loading={refundingInvoiceId === record.id}
                className="font-semibold!"
                onClick={() => onRefundInvoice(record)}
              >
                Refund
              </Button>
            ) : null}
            <Button
              type="link"
              icon={<EyeOutlined />}
              className="font-semibold!"
              onClick={() => onViewInvoice(record)}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [onRefundInvoice, onViewInvoice, refundingInvoiceId],
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
