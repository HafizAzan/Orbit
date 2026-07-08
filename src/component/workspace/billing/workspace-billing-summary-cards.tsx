import { CreditCardOutlined, CrownOutlined, CalendarOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";
import { useBillingCatalog, useCurrentSubscription } from "../../../hooks/use-billing";
import { resolveWorkspaceBillingSummary } from "../../../lib/workspace-billing-summary";
import { cn } from "../../../lib/utils";
import { StatCardsGridSkeleton } from "../../skeletons";
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
  const { data: subscription, isLoading: subscriptionLoading } = useCurrentSubscription();
  const { data: catalog, isLoading: catalogLoading } = useBillingCatalog();

  const summary = useMemo(
    () => resolveWorkspaceBillingSummary(subscription, catalog?.products),
    [catalog?.products, subscription],
  );

  if (subscriptionLoading || catalogLoading) {
    return <StatCardsGridSkeleton count={3} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard
        icon={<CrownOutlined className="text-lg" />}
        label="Current plan"
        title={summary.planName}
        subtitle={`${summary.priceLabel} · ${summary.statusLabel}`}
      />
      <SummaryCard
        icon={<CalendarOutlined className="text-lg" />}
        label="Next payment"
        title={summary.nextPaymentDate}
        subtitle={summary.nextPaymentSubtitle}
      />
      <SummaryCard
        icon={<CreditCardOutlined className="text-lg" />}
        label="Payment method"
        title={summary.paymentMethodTitle}
        subtitle={summary.paymentMethodSubtitle}
      />
    </div>
  );
}

export default React.memo(WorkspaceBillingSummaryCards);
