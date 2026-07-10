import React, { useState } from "react";
import PageSeo from "../../component/seo/page-seo";
import ActiveProjectsCard from "../../component/workspace/dashboard/active-projects-card";
import CriticalDeadlinesCard from "../../component/workspace/dashboard/critical-deadlines-card";
import GlobalActivityFeed from "../../component/workspace/dashboard/global-activity-feed";
import OwnerOrgHealthCard from "../../component/workspace/dashboard/owner-org-health-card";
import ProjectOverviewHeader from "../../component/workspace/dashboard/project-overview-header";
import TaskStatusChart from "../../component/workspace/dashboard/task-status-chart";
import TeamVelocityChart from "../../component/workspace/dashboard/team-velocity-chart";
import WorkspaceMetricCard from "../../component/workspace/dashboard/workspace-metric-card";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { DashboardPageSkeleton } from "../../component/skeletons";
import { DEFAULT_DASHBOARD_PERIOD_FILTER, type DashboardPeriodFilter } from "../../data/workspace-dashboard";
import { useWorkspaceDashboard } from "../../hooks/use-workspace-tasks";
import { useAppContext } from "../../context/app-context";

function WorkspaceDashboardContent() {
  const app = useAppContext();
  const isOwner = app?.user?.role === "owner";
  const [period, setPeriod] = useState<DashboardPeriodFilter>(DEFAULT_DASHBOARD_PERIOD_FILTER);
  const dashboardQuery = useWorkspaceDashboard(period);
  const { data } = dashboardQuery;

  return (
    <QueryPageGuard query={dashboardQuery} loading={<DashboardPageSkeleton />} errorTitle="Unable to load dashboard">
      {data ? (
        <div className="mx-auto max-w-8xl">
          <ProjectOverviewHeader period={period} onPeriodChange={setPeriod} />
          {isOwner ? <OwnerOrgHealthCard /> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <WorkspaceMetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TeamVelocityChart data={data.velocity} period={period} />
            </div>
            <TaskStatusChart data={data.taskStatus} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <ActiveProjectsCard items={data.activeProjects} />
            <CriticalDeadlinesCard items={data.criticalDeadlines} />
            <GlobalActivityFeed items={data.activity as import("../../data/workspace-dashboard").WorkspaceActivityItem[]} />
          </div>
        </div>
      ) : null}
    </QueryPageGuard>
  );
}

function WorkspaceDashboard() {
  return (
    <>
      <PageSeo title="Dashboard" description="Workspace overview, metrics, and activity." noIndex />
      <WorkspaceRoleGate
        permission="dashboard.view"
        title="Dashboard access restricted"
        description="Members use My Tasks for assigned work. Owners, admins, and managers can open the workspace dashboard."
      >
        <WorkspaceDashboardContent />
      </WorkspaceRoleGate>
    </>
  );
}

export default React.memo(WorkspaceDashboard);
