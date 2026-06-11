import { CalendarOutlined, CheckOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import React from "react";
import {
  ORGANIZATION_CREATED_FILTER_OPTIONS,
  ORGANIZATION_PLAN_FILTER_OPTIONS,
  ORGANIZATION_STATUS_FILTER_OPTIONS,
  PLAN_STYLES,
  STATUS_STYLES,
  type OrganizationCreatedDateFilter,
  type OrganizationPlan,
  type OrganizationStatus,
} from "../../../data/admin-organizations";
import { countActiveOrganizationFilters, DEFAULT_ORGANIZATION_FILTERS, type OrganizationFilters } from "../../../lib/organization-filters";
import { cn } from "../../../lib/utils";
import { Paragraph, Text } from "../../ui/typography";
import { delay } from "../../../lib/helper";

type OrganizationFilterDrawerProps = {
  open: boolean;
  draftFilters: OrganizationFilters;
  onClose: () => void;
  onDraftChange: (filters: OrganizationFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

type FilterSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function FilterSection({ title, description, children }: FilterSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-background/70 p-4">
      <Text as="p" size="sm" className="font-semibold text-foreground">
        {title}
      </Text>
      <Paragraph size="xs" className="mt-1 text-muted">
        {description}
      </Paragraph>
      <div className="mt-4 space-y-2">{children}</div>
    </section>
  );
}

function OrganizationFilterDrawer({ open, draftFilters, onClose, onDraftChange, onApply, onClear }: OrganizationFilterDrawerProps) {
  const activeCount = countActiveOrganizationFilters(draftFilters);

  const toggleStatus = (status: OrganizationStatus) => {
    const statuses = draftFilters.statuses.includes(status)
      ? draftFilters.statuses.filter((value) => value !== status)
      : [...draftFilters.statuses, status];

    onDraftChange({ ...draftFilters, statuses });
  };

  const togglePlan = (plan: OrganizationPlan) => {
    const plans = draftFilters.plans.includes(plan) ? draftFilters.plans.filter((value) => value !== plan) : [...draftFilters.plans, plan];

    onDraftChange({ ...draftFilters, plans });
  };

  const handleCreatedChange = (value: OrganizationCreatedDateFilter) => {
    onDraftChange({ ...draftFilters, createdWithin: value });
  };

  const handleClear = async () => {
    onDraftChange(DEFAULT_ORGANIZATION_FILTERS);
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
              Filter organizations
            </Text>
            <Paragraph size="xs" className="mt-1 text-muted">
              {activeCount > 0
                ? `${activeCount} ${activeCount === 1 ? "filter" : "filters"} selected`
                : "Refine the list by status, plan, or created date."}
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <FilterSection title="Status" description="Show organizations by account state.">
          {ORGANIZATION_STATUS_FILTER_OPTIONS.map((option) => {
            const isSelected = draftFilters.statuses.includes(option.value);
            const statusStyle = STATUS_STYLES[option.value];

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleStatus(option.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                  isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                )}
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusStyle.dot)} />
                <span className="text-sm font-medium text-foreground">{statusStyle.label}</span>
                {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
              </button>
            );
          })}
        </FilterSection>

        <FilterSection title="Plan" description="Filter by subscription tier.">
          <div className="grid grid-cols-2 gap-2">
            {ORGANIZATION_PLAN_FILTER_OPTIONS.map((option) => {
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
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Created date" description="Limit results by onboarding date.">
          <div className="grid grid-cols-2 gap-2">
            {ORGANIZATION_CREATED_FILTER_OPTIONS.map((option) => {
              const isSelected = draftFilters.createdWithin === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCreatedChange(option.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left transition-all",
                    isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                    option.value === "all" && "col-span-2",
                  )}
                >
                  {option.value !== "all" ? <CalendarOutlined className={cn("text-sm", isSelected ? "text-primary" : "text-muted")} /> : null}
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                  {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </FilterSection>
      </div>
    </Drawer>
  );
}

export default React.memo(OrganizationFilterDrawer);
