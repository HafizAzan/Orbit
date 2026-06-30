import { CheckOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import React from "react";
import { PLAN_STYLES, type OrganizationPlan } from "../../../data/admin-organizations";
import {
  SUBSCRIPTION_BILLING_FILTER_OPTIONS,
  SUBSCRIPTION_PLAN_FILTER_OPTIONS,
  type BillingCycle,
} from "../../../data/admin-subscriptions";
import { countActiveSubscriptionFilters, DEFAULT_SUBSCRIPTION_FILTERS, type SubscriptionFilters } from "../../../lib/subscription-filters";
import { delay } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import FilterDrawerSection from "../shared/filter-drawer-section";
import { Paragraph, Text } from "../../ui/typography";

type SubscriptionFilterDrawerProps = {
  open: boolean;
  draftFilters: SubscriptionFilters;
  onClose: () => void;
  onDraftChange: (filters: SubscriptionFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

function SubscriptionFilterDrawer({ open, draftFilters, onClose, onDraftChange, onApply, onClear }: SubscriptionFilterDrawerProps) {
  const activeCount = countActiveSubscriptionFilters(draftFilters);

  const togglePlan = (plan: OrganizationPlan) => {
    const plans = draftFilters.plans.includes(plan) ? draftFilters.plans.filter((value) => value !== plan) : [...draftFilters.plans, plan];

    onDraftChange({ ...draftFilters, plans });
  };

  const toggleBilling = (billingCycle: BillingCycle) => {
    const billingCycles = draftFilters.billingCycles.includes(billingCycle)
      ? draftFilters.billingCycles.filter((value) => value !== billingCycle)
      : [...draftFilters.billingCycles, billingCycle];

    onDraftChange({ ...draftFilters, billingCycles });
  };

  const handleClear = async () => {
    onDraftChange(DEFAULT_SUBSCRIPTION_FILTERS);
    onClear();
    await delay(200);
    onClose();
  };

  return (
    <Drawer
      title={null}
      placement="right"
      width={380}
      open={open}
      onClose={onClose}
      destroyOnClose={false}
      closable
      classNames={{
        header: "hidden!",
        body: "flex h-full flex-col px-0! py-0!",
        footer: "border-t border-border px-5! py-4!",
      }}
      footer={
        <div className="flex flex-col gap-2">
          <Button type="primary" size="large" block onClick={onApply} className="h-11! rounded-xl! font-semibold!">
            Apply filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
          <Button type="text" block onClick={handleClear} className="font-medium! text-muted!">
            Clear all
          </Button>
        </div>
      }
    >
      <div className="border-b border-border bg-feature-sync/30 px-5 py-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FilterOutlined className="text-lg" />
          </span>
          <div className="min-w-0">
            <Text as="p" size="sm" className="font-semibold text-foreground">
              Filter subscriptions
            </Text>
            <Paragraph size="xs" className="mt-1 text-muted">
              {activeCount > 0
                ? `${activeCount} ${activeCount === 1 ? "filter" : "filters"} selected`
                : "Refine the list by plan or billing cycle."}
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <FilterDrawerSection title="Plan" description="Filter by subscription tier.">
          <div className="grid grid-cols-2 gap-2">
            {SUBSCRIPTION_PLAN_FILTER_OPTIONS.map((option) => {
              const isSelected = draftFilters.plans.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePlan(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border px-3.5 py-3 text-left transition-all",
                    isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                  )}
                >
                  <span
                    className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide", PLAN_STYLES[option.value])}
                  >
                    {option.value}
                  </span>
                  <Text size="sm" weight="medium">{option.label}</Text>
                </button>
              );
            })}
          </div>
        </FilterDrawerSection>

        <FilterDrawerSection title="Billing cycle" description="Show annual or monthly subscriptions.">
          {SUBSCRIPTION_BILLING_FILTER_OPTIONS.map((option) => {
            const isSelected = draftFilters.billingCycles.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleBilling(option.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                  isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                )}
              >
                <Text size="sm" weight="medium">{option.label}</Text>
                {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
              </button>
            );
          })}
        </FilterDrawerSection>
      </div>
    </Drawer>
  );
}

export default React.memo(SubscriptionFilterDrawer);
