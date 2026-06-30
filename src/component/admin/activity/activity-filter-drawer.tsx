import { CheckOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import React from "react";
import { ACTIVITY_SEVERITY_FILTER_OPTIONS, ACTIVITY_SEVERITY_STYLES, ACTIVITY_TABS, type ActivitySeverity } from "../../../data/admin-activity";
import {
  countActiveActivityFilters,
  DEFAULT_ACTIVITY_FILTERS,
  type ActivityEventTabKey,
  type ActivityFilters,
} from "../../../lib/activity-filters";
import { delay } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import FilterDrawerSection from "../shared/filter-drawer-section";
import { Paragraph, Text } from "../../ui/typography";

type ActivityFilterDrawerProps = {
  open: boolean;
  draftFilters: ActivityFilters;
  onClose: () => void;
  onDraftChange: (filters: ActivityFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

function ActivityFilterDrawer({ open, draftFilters, onClose, onDraftChange, onApply, onClear }: ActivityFilterDrawerProps) {
  const activeCount = countActiveActivityFilters(draftFilters);

  const toggleSeverity = (severity: ActivitySeverity) => {
    const severities = draftFilters.severities.includes(severity)
      ? draftFilters.severities.filter((value) => value !== severity)
      : [...draftFilters.severities, severity];

    onDraftChange({ ...draftFilters, severities });
  };

  const handleEventTabChange = (eventTab: ActivityEventTabKey) => {
    onDraftChange({ ...draftFilters, eventTab });
  };

  const handleClear = async () => {
    onDraftChange(DEFAULT_ACTIVITY_FILTERS);
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
              Filter activity
            </Text>
            <Paragraph size="xs" className="mt-1 text-muted">
              {activeCount > 0
                ? `${activeCount} ${activeCount === 1 ? "filter" : "filters"} selected`
                : "Refine events by type or severity."}
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <FilterDrawerSection title="Event type" description="Show events by category.">
          {ACTIVITY_TABS.map((tab) => {
            const isSelected = draftFilters.eventTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleEventTabChange(tab.key as ActivityEventTabKey)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                  isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                )}
              >
                <Text size="sm" weight="medium">{tab.label}</Text>
                {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
              </button>
            );
          })}
        </FilterDrawerSection>

        <FilterDrawerSection title="Severity" description="Show events by alert level.">
          {ACTIVITY_SEVERITY_FILTER_OPTIONS.map((option) => {
            const isSelected = draftFilters.severities.includes(option.value);
            const severityStyle = ACTIVITY_SEVERITY_STYLES[option.value];

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleSeverity(option.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                  isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25 hover:bg-background",
                )}
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", severityStyle.dot)} />
                <Text size="sm" weight="medium">{severityStyle.label}</Text>
                {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
              </button>
            );
          })}
        </FilterDrawerSection>
      </div>
    </Drawer>
  );
}

export default React.memo(ActivityFilterDrawer);
