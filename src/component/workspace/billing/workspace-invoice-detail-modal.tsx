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

type WorkspaceInvoiceDetailModalProps = {
  invoice: BillingInvoice | null;
  onClose: () => void;
};

function WorkspaceInvoiceDetailModal({ invoice, onClose }: WorkspaceInvoiceDetailModalProps) {
  const detail = invoice ? getWorkspaceInvoiceDetail(invoice) : null;
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
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span className="min-w-24 text-right">Amount</span>
            </div>

            {detail.lineItems.map((item, index) => (
              <div
                key={`${item.description}-${index}`}
                className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0"
              >
                <span className="font-medium text-foreground">{item.description}</span>
                <span className="text-right text-muted">{item.quantity}</span>
                <span className="min-w-24 text-right font-medium text-foreground">
                  {formatCurrency(item.unitAmount * item.quantity, detail.currency, 2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(detail.subtotal, detail.currency, 2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Tax</span>
              <span className="font-medium text-foreground">{formatCurrency(detail.tax, detail.currency, 2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-foreground">Total paid</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(detail.total, detail.currency, 2)}</span>
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
