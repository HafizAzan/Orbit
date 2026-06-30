import { CreditCardOutlined, CrownOutlined, CalendarOutlined } from "@ant-design/icons";
import React from "react";
import { WORKSPACE_BILLING_SUMMARY } from "../../../data/workspace-settings";
import { cn } from "../../../lib/utils";
import { Paragraph, Text } from "../../ui/typography";

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
          <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
            {label}
          </Text>
          <Text as="p" size="lg" weight="bold" className="mt-1">
            {title}
          </Text>
          <Paragraph size="sm" className="mt-1">
            {subtitle}
          </Paragraph>
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
