import { CheckOutlined, DownOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import React, { useMemo, useState } from "react";
import { DASHBOARD_PERIOD_FILTER_OPTIONS, DEFAULT_DASHBOARD_PERIOD_FILTER, type DashboardPeriodFilter } from "../../../data/workspace-dashboard";
import { isWorkspaceOwner } from "../../../lib/workspace-routing";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import WorkspaceNavLink from "../common/workspace-nav-link";
import { Paragraph, Text, Title } from "../../ui/typography";
import { useAppContext } from "../../../context/app-context";

type ProjectOverviewHeaderProps = {
  period?: DashboardPeriodFilter;
  onPeriodChange?: (period: DashboardPeriodFilter) => void;
};

function ProjectOverviewHeader({ period: periodProp, onPeriodChange }: ProjectOverviewHeaderProps) {
  const [open, setOpen] = useState(false);
  const app = useAppContext();
  const isOwner = isWorkspaceOwner({ role: app?.user?.role ?? "member" });

  const period = periodProp ?? DEFAULT_DASHBOARD_PERIOD_FILTER;

  const selectedLabel = useMemo(() => DASHBOARD_PERIOD_FILTER_OPTIONS.find((option) => option.value === period)?.label ?? "Filters", [period]);

  const handleSelect = (value: DashboardPeriodFilter) => {
    onPeriodChange?.(value);
    setOpen(false);
  };

  const dropdownContent = (
    <div className="w-52 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
      <Text as="p" size="xs" weight="semibold" color="muted" className="px-2.5 py-1.5 text-[11px]! tracking-wide uppercase">
        Time Period
      </Text>
      <div className="space-y-1">
        {DASHBOARD_PERIOD_FILTER_OPTIONS.map((option) => {
          const isSelected = option.value === period;

          return (
            <Button
              key={option.value}
              type="text"
              block
              onClick={() => handleSelect(option.value)}
              className={cn(
                "h-auto justify-start! rounded-xl px-3 py-2.5 font-medium!",
                isSelected ? "bg-feature-sync text-primary" : "text-foreground hover:bg-background!",
              )}
            >
              <span>{option.label}</span>
              {isSelected ? <CheckOutlined className="ml-auto text-xs" /> : null}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Overview Dashboard
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          {isOwner
            ? "Organization-wide health, billing readiness, and delivery oversight."
            : "Welcome back. Here's what's happening with your workspace today."}
        </Paragraph>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Dropdown open={open} onOpenChange={setOpen} trigger={["click"]} placement="bottomRight" popupRender={() => dropdownContent}>
          <Button icon={<FilterOutlined />} size="large" className="font-semibold!">
            {selectedLabel}
            <DownOutlined className="ml-1.5 text-xs text-muted" />
          </Button>
        </Dropdown>

        <WorkspaceNavLink to={WORKSPACE_ROUTES.PROJECT_CREATE}>
          <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
            New Project
          </Button>
        </WorkspaceNavLink>
      </div>
    </div>
  );
}

export default React.memo(ProjectOverviewHeader);
