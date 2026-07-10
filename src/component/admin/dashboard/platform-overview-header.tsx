import React from "react";
import { cn } from "../../../lib/utils";
import { Paragraph, Title } from "../../ui/typography";

export type DashboardViewTab = "dashboard" | "analytics";

export const DASHBOARD_VIEW_TAB_SLUGS: Record<DashboardViewTab, string> = {
  dashboard: "dashboard",
  analytics: "analytics",
};

export const DEFAULT_DASHBOARD_VIEW_TAB: DashboardViewTab = "dashboard";

const VIEW_TABS: { key: DashboardViewTab; label: string }[] = [
  { key: "dashboard", label: "Overview" },
  { key: "analytics", label: "Insights" },
];

type PlatformOverviewHeaderProps = {
  activeTab: DashboardViewTab;
  onTabChange: (tab: DashboardViewTab) => void;
};

function PlatformOverviewHeader({ activeTab, onTabChange }: PlatformOverviewHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Platform Overview
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Real-time health and performance metrics for Orbit.
        </Paragraph>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key ? "bg-feature-sync text-primary shadow-sm" : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(PlatformOverviewHeader);
