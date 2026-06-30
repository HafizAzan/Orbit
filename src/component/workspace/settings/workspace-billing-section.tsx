import { CreditCardOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { resolveWorkspaceInvoices } from "../../../data/workspace-billing";
import { WORKSPACE_BILLING_SUMMARY } from "../../../data/workspace-settings";
import { useBillingInvoices } from "../../../hooks/use-billing";
import { toast } from "../../../lib/toast";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import type { BillingInvoice } from "../../../types/billing.types";
import SettingsSection from "../../admin/settings/settings-section";
import WorkspaceInvoicesTable from "../billing/workspace-invoices-table";
import WorkspaceInvoiceDetailModal from "../billing/workspace-invoice-detail-modal";
import { Paragraph, Text } from "../../ui/typography";

type WorkspaceBillingSectionProps = {
  expanded?: boolean;
};

function WorkspaceBillingSection({ expanded = false }: WorkspaceBillingSectionProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useBillingInvoices();
  const [selectedInvoice, setSelectedInvoice] = React.useState<BillingInvoice | null>(null);
  const invoices = useMemo(() => resolveWorkspaceInvoices(data?.data), [data?.data]);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingsSection
          id="workspace-plan"
          title="Current Plan"
          description="Your active subscription and renewal details."
        >
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <Text as="p" size="sm" weight="semibold" color="primary" className="uppercase">
              {WORKSPACE_BILLING_SUMMARY.planName}
            </Text>
            <Text as="p" weight="bold" className="mt-2 text-3xl tracking-tight">
              {WORKSPACE_BILLING_SUMMARY.priceLabel}
            </Text>
            <Paragraph size="sm" className="mt-2">
              Next payment on <Text as="span" weight="medium">{WORKSPACE_BILLING_SUMMARY.nextPaymentDate}</Text>
            </Paragraph>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="primary"
              className="font-semibold!"
              onClick={() => navigate(`${WORKSPACE_ROUTES.BILLING}#workspace-plans`)}
            >
              Manage Plan
            </Button>
            <Button className="font-semibold!" onClick={handleViewInvoices}>
              View Invoices
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          id="workspace-payment"
          title="Payment Method"
          description="Default card used for subscription renewals."
        >
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-feature-sync text-primary">
              <CreditCardOutlined className="text-xl" />
            </div>
            <div>
              <Text as="p" weight="semibold">
                {WORKSPACE_BILLING_SUMMARY.cardBrand} ending in {WORKSPACE_BILLING_SUMMARY.cardLast4}
              </Text>
              <Paragraph size="sm" className="mt-1">
                Expires {WORKSPACE_BILLING_SUMMARY.cardExpiry}
              </Paragraph>
            </div>
          </div>

          <Button
            className="mt-5 font-semibold!"
            onClick={() => toast.info("Payment update — coming soon")}
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
