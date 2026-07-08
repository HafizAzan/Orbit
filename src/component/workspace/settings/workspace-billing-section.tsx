import { CreditCardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { resolveWorkspaceInvoices } from "../../../data/workspace-billing";
import { useBillingCatalog, useBillingInvoices, useBillingPortal, useCurrentSubscription } from "../../../hooks/use-billing";
import { resolveWorkspaceBillingSummary } from "../../../lib/workspace-billing-summary";
import { showApiErrorToast } from "../../../lib/api-error";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import type { BillingInvoice } from "../../../types/billing.types";
import SettingsSection from "../../admin/settings/settings-section";
import { StatCardsGridSkeleton } from "../../skeletons";
import WorkspaceInvoicesTable from "../billing/workspace-invoices-table";
import WorkspaceInvoiceDetailModal from "../billing/workspace-invoice-detail-modal";
import { Paragraph, Text } from "../../ui/typography";

type WorkspaceBillingSectionProps = {
  expanded?: boolean;
};

function WorkspaceBillingSection({ expanded = false }: WorkspaceBillingSectionProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useBillingInvoices();
  const { data: subscription, isLoading: subscriptionLoading } = useCurrentSubscription();
  const { data: catalog, isLoading: catalogLoading } = useBillingCatalog();
  const { mutateAsync: openPortal, isPending: portalLoading } = useBillingPortal();
  const [selectedInvoice, setSelectedInvoice] = React.useState<BillingInvoice | null>(null);
  const invoices = useMemo(() => resolveWorkspaceInvoices(data?.data), [data?.data]);

  const summary = useMemo(
    () => resolveWorkspaceBillingSummary(subscription, catalog?.products),
    [catalog?.products, subscription],
  );

  const handleViewInvoices = () => {
    if (invoices[0]) {
      setSelectedInvoice(invoices[0]);
    }
  };

  const handleViewAllInvoices = () => {
    if (invoices[0]) {
      navigate(`${WORKSPACE_ROUTES.BILLING}?invoice=${invoices[0].id}`);
      return;
    }

    navigate(WORKSPACE_ROUTES.BILLING);
  };

  const planLoading = subscriptionLoading || catalogLoading;

  const handleUpdatePayment = async () => {
    try {
      const result = await openPortal(`${window.location.origin}/settings?tab=billing`);
      window.location.assign(result.url);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingsSection
          id="workspace-plan"
          title="Current Plan"
          description="Your active subscription and renewal details."
        >
          {planLoading ? (
            <StatCardsGridSkeleton count={1} />
          ) : (
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <Text as="p" size="sm" weight="semibold" color="primary" className="uppercase">
                {summary.planName}
              </Text>
              <Text as="p" weight="bold" className="mt-2 text-3xl tracking-tight">
                {summary.priceLabel}
              </Text>
              <Paragraph size="sm" className="mt-2">
                Next payment on <Text as="span" weight="medium">{summary.nextPaymentDate}</Text>
              </Paragraph>
              <Paragraph size="sm" className="mt-1 text-muted">
                Status: {summary.statusLabel}
              </Paragraph>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="primary"
              className="font-semibold!"
              onClick={() => navigate(`${WORKSPACE_ROUTES.BILLING}#workspace-plans`)}
            >
              Manage Plan
            </Button>
            <Button className="font-semibold!" onClick={handleViewInvoices} disabled={invoices.length === 0}>
              View Invoices
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          id="workspace-payment"
          title="Payment Method"
          description="Default card used for subscription renewals."
        >
          {planLoading ? (
            <StatCardsGridSkeleton count={1} />
          ) : (
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-feature-sync text-primary">
                <CreditCardOutlined className="text-xl" />
              </div>
              <div>
                <Text as="p" weight="semibold">
                  {summary.paymentMethodTitle}
                </Text>
                <Paragraph size="sm" className="mt-1">
                  {summary.paymentMethodSubtitle}
                </Paragraph>
              </div>
            </div>
          )}

          <Button
            className="mt-5 font-semibold!"
            loading={portalLoading}
            disabled={!subscription?.stripeCustomerId}
            onClick={() => {
              void handleUpdatePayment();
            }}
          >
            Update Payment
          </Button>
        </SettingsSection>
      </div>

      {expanded ? (
        <SettingsSection
          id="workspace-billing-history"
          title="Billing History"
          description="Recent invoices and payment receipts."
          action={
            <button
              type="button"
              onClick={handleViewAllInvoices}
              className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
            >
              View all
            </button>
          }
        >
          <WorkspaceInvoicesTable
            invoices={invoices.slice(0, 3)}
            loading={isLoading}
            onViewInvoice={setSelectedInvoice}
          />
        </SettingsSection>
      ) : null}

      <WorkspaceInvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </div>
  );
}

export default React.memo(WorkspaceBillingSection);
