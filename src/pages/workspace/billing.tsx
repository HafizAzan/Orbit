import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageSeo from "../../component/seo/page-seo";
import WorkspaceBillingPlanCards from "../../component/workspace/billing/workspace-billing-plan-cards";
import WorkspaceBillingSummaryCards from "../../component/workspace/billing/workspace-billing-summary-cards";
import WorkspaceBillingActions from "../../component/workspace/billing/workspace-billing-actions";
import WorkspaceInvoiceDetailModal from "../../component/workspace/billing/workspace-invoice-detail-modal";
import WorkspaceInvoicesTable from "../../component/workspace/billing/workspace-invoices-table";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { ConfirmModal } from "../../component/ui/modal";
import SettingsSection from "../../component/admin/settings/settings-section";
import { Paragraph, Title } from "../../component/ui/typography";
import { resolveWorkspaceInvoices } from "../../data/workspace-billing";
import { useBillingInvoices, useRefundPayment } from "../../hooks/use-billing";
import { useWorkspaceOrganization } from "../../hooks/use-workspace-organization";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import type { BillingInvoice } from "../../types/billing.types";

const WORKSPACE_INVOICE_QUERY_PARAM = "invoice";

function WorkspaceBillingContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useBillingInvoices();
  const { data: organization } = useWorkspaceOrganization();
  const { mutateAsync: refundPayment } = useRefundPayment();
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [refundingInvoice, setRefundingInvoice] = useState<BillingInvoice | null>(null);
  const [refundingInvoiceId, setRefundingInvoiceId] = useState<string | null>(null);

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

  const handleRefundInvoice = useCallback(async () => {
    if (!refundingInvoice) return;

    setRefundingInvoiceId(refundingInvoice.id);

    try {
      const result = await refundPayment({ invoiceId: refundingInvoice.id });
      showApiSuccessToast(result.message);
      setRefundingInvoice(null);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setRefundingInvoiceId(null);
    }
  }, [refundPayment, refundingInvoice]);

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
        <WorkspaceBillingActions />
        <WorkspaceBillingPlanCards />

        <SettingsSection
          id="workspace-invoices"
          title="Invoice History"
          description="View and download past invoices for your workspace."
        >
          <WorkspaceInvoicesTable
            invoices={invoices}
            loading={isLoading}
            onViewInvoice={openInvoice}
            onRefundInvoice={setRefundingInvoice}
            refundingInvoiceId={refundingInvoiceId}
          />
        </SettingsSection>
      </div>

      <WorkspaceInvoiceDetailModal
        invoice={selectedInvoice}
        workspaceName={organization?.name}
        billingEmail={organization?.billingEmail}
        onClose={closeInvoice}
      />

      <ConfirmModal
        open={refundingInvoice !== null}
        onClose={() => setRefundingInvoice(null)}
        onConfirm={handleRefundInvoice}
        title="Refund invoice?"
        description="This will refund the paid amount for the selected invoice."
        confirmText="Process refund"
        confirmDanger
        confirmLoading={refundingInvoiceId !== null}
      />
    </div>
  );
}

function WorkspaceBilling() {
  return (
    <>
      <PageSeo title="Billing & Subscription" description="Manage your workspace billing and subscription plan." noIndex />
      <WorkspaceRoleGate
        permission="billing.view"
        title="Billing access restricted"
        description="Only workspace owners and admins can manage billing and subscriptions."
      >
        <WorkspaceBillingContent />
      </WorkspaceRoleGate>
    </>
  );
}

export default React.memo(WorkspaceBilling);
