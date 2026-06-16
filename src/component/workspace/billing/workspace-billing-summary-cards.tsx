import { CreditCardOutlined, CrownOutlined, CalendarOutlined } from "@ant-design/icons";
import React from "react";
import { WORKSPACE_BILLING_SUMMARY } from "../../../data/workspace-settings";
import { cn } from "../../../lib/utils";

type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  title: string;
  subtitle: string;
  iconClassName?: string;
};

function SummaryCard({ icon, label, title, subtitle, iconClassName }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-feature-sync text-primary",
            iconClassName,
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function WorkspaceBillingSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        icon={<CrownOutlined className="text-lg" />}
        label="Current plan"
        title={WORKSPACE_BILLING_SUMMARY.planName}
        subtitle={WORKSPACE_BILLING_SUMMARY.priceLabel}
      />
      <SummaryCard
        icon={<CalendarOutlined className="text-lg" />}
        label="Next payment"
        title={WORKSPACE_BILLING_SUMMARY.nextPaymentDate}
        subtitle="Annual renewal"
      />
      <SummaryCard
        icon={<CreditCardOutlined className="text-lg" />}
        label="Payment method"
        title={`${WORKSPACE_BILLING_SUMMARY.cardBrand} ···· ${WORKSPACE_BILLING_SUMMARY.cardLast4}`}
        subtitle={`Expires ${WORKSPACE_BILLING_SUMMARY.cardExpiry}`}
      />
    </div>
  );
}

export default React.memo(WorkspaceBillingSummaryCards);
