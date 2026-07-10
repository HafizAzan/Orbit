import { FileTextOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import {
  WORKSPACE_INVOICE_STATUS_STYLES,
  getWorkspaceInvoiceDetail,
} from "../../../data/workspace-billing";
import { formatCurrency, formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import type { BillingInvoice } from "../../../types/billing.types";
import DetailModal from "../../ui/detail-modal";
import RecordDetailField from "../../admin/shared/record-detail-field";
import { Text } from "../../ui/typography";

type WorkspaceInvoiceDetailModalProps = {
  invoice: BillingInvoice | null;
  workspaceName?: string;
  billingEmail?: string | null;
  onClose: () => void;
};

function WorkspaceInvoiceDetailModal({
  invoice,
  workspaceName,
  billingEmail,
  onClose,
}: WorkspaceInvoiceDetailModalProps) {
  const detail = invoice
    ? getWorkspaceInvoiceDetail(invoice, { workspaceName, billingEmail })
    : null;
  const statusKey = detail?.status?.toLowerCase() ?? "paid";
  const statusStyle = WORKSPACE_INVOICE_STATUS_STYLES[statusKey] ?? WORKSPACE_INVOICE_STATUS_STYLES.paid;

  return (
    <DetailModal
      open={invoice !== null}
      onClose={onClose}
      title={detail?.number ? `Invoice ${detail.number}` : "Invoice"}
      subtitle={detail ? `${detail.workspaceName} · ${detail.billingEmail}` : undefined}
      icon={<FileTextOutlined />}
      width={640}
    >
      {detail ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <RecordDetailField label="Status">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  statusStyle.badge,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
                {statusStyle.label}
              </span>
            </RecordDetailField>
            <RecordDetailField label="Invoice date" value={formatDate(detail.createdAt)} />
            <RecordDetailField
              label="Refundable until"
              value={
                detail.refundable && detail.refundWindowEndsAt
                  ? formatDate(detail.refundWindowEndsAt)
                  : detail.refundable
                    ? "Within refund window"
                    : "Not refundable"
              }
            />
            <RecordDetailField
              label="Billing period"
              value={
                detail.periodStart && detail.periodEnd
                  ? `${formatDate(detail.periodStart)} – ${formatDate(detail.periodEnd)}`
                  : "—"
              }
              className="sm:col-span-2"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border bg-background/60 px-4 py-3 text-[11px] font-semibold tracking-wide text-muted uppercase">
              <Text as="span" size="xs" weight="semibold" color="muted" className="text-[11px]! tracking-wide uppercase">
                Description
              </Text>
              <Text as="span" size="xs" weight="semibold" color="muted" className="text-right text-[11px]! tracking-wide uppercase">
                Qty
              </Text>
              <Text as="span" size="xs" weight="semibold" color="muted" className="min-w-24 text-right text-[11px]! tracking-wide uppercase">
                Amount
              </Text>
            </div>

            {detail.lineItems.map((item, index) => (
              <div
                key={`${item.description}-${index}`}
                className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0"
              >
                <Text as="span" size="sm" weight="medium">
                  {item.description}
                </Text>
                <Text as="span" size="sm" color="muted" className="text-right">
                  {item.quantity}
                </Text>
                <Text as="span" size="sm" weight="medium" className="min-w-24 text-right">
                  {formatCurrency(item.unitAmount * item.quantity, detail.currency, 2)}
                </Text>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between text-sm">
              <Text as="span" size="sm" color="muted">
                Subtotal
              </Text>
              <Text as="span" size="sm" weight="medium">
                {formatCurrency(detail.subtotal, detail.currency, 2)}
              </Text>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Text as="span" size="sm" color="muted">
                Tax
              </Text>
              <Text as="span" size="sm" weight="medium">
                {formatCurrency(detail.tax, detail.currency, 2)}
              </Text>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <Text as="span" size="sm" weight="semibold">
                Total paid
              </Text>
              <Text as="span" size="lg" weight="bold">
                {formatCurrency(detail.total, detail.currency, 2)}
              </Text>
            </div>
          </div>

          {detail.invoicePdf || detail.hostedInvoiceUrl ? (
            <div className="flex flex-wrap gap-3">
              {detail.invoicePdf ? (
                <Button type="primary" href={detail.invoicePdf} target="_blank" rel="noreferrer" className="font-semibold!">
                  Download PDF
                </Button>
              ) : null}
              {detail.hostedInvoiceUrl ? (
                <Button href={detail.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="font-semibold!">
                  View on Stripe
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </DetailModal>
  );
}

export default React.memo(WorkspaceInvoiceDetailModal);
