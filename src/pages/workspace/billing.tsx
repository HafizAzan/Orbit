import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WorkspaceBillingPlanCards from "../../component/workspace/billing/workspace-billing-plan-cards";
import WorkspaceBillingSummaryCards from "../../component/workspace/billing/workspace-billing-summary-cards";
import WorkspaceInvoiceDetailModal from "../../component/workspace/billing/workspace-invoice-detail-modal";
import WorkspaceInvoicesTable from "../../component/workspace/billing/workspace-invoices-table";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import SettingsSection from "../../component/admin/settings/settings-section";
import { Paragraph, Title } from "../../component/ui/typography";
import { resolveWorkspaceInvoices } from "../../data/workspace-billing";
import { useBillingInvoices } from "../../hooks/use-billing";
import type { BillingInvoice } from "../../types/billing.types";

const WORKSPACE_INVOICE_QUERY_PARAM = "invoice";

function WorkspaceBillingContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useBillingInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

  const invoices = useMemo(() => resolveWorkspaceInvoices(data?.data), [data?.data]);

  const openInvoice = useCallback(
    (invoice: BillingInvoice) => {
      setSelectedInvoice(invoice);
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(WORKSPACE_INVOICE_QUERY_PARAM, invoice.id);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const closeInvoice = useCallback(() => {
    setSelectedInvoice(null);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(WORKSPACE_INVOICE_QUERY_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  useEffect(() => {
    const invoiceId = searchParams.get(WORKSPACE_INVOICE_QUERY_PARAM);
    if (!invoiceId || invoices.length === 0) return;

    const match = invoices.find((invoice) => invoice.id === invoiceId);
    if (match) {
      setSelectedInvoice(match);
    }
  }, [invoices, searchParams]);

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Billing
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage your subscription, payment method, and invoice history.
        </Paragraph>
      </div>

      <div className="space-y-6">
        <WorkspaceBillingSummaryCards />
        <WorkspaceBillingPlanCards />

        <SettingsSection
          id="workspace-invoices"
          title="Invoice History"
          description="View and download past invoices for your workspace."
        >
          <WorkspaceInvoicesTable invoices={invoices} loading={isLoading} onViewInvoice={openInvoice} />
        </SettingsSection>
      </div>

      <WorkspaceInvoiceDetailModal invoice={selectedInvoice} onClose={closeInvoice} />
    </div>
  );
}

function WorkspaceBilling() {
  return (
    <WorkspaceRoleGate
      permission="billing.view"
      title="Billing access restricted"
      description="Only workspace owners and admins can manage billing and subscriptions."
    >
      <WorkspaceBillingContent />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceBilling);
