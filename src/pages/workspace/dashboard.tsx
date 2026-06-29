import React from "react";
import ActiveProjectsCard from "../../component/workspace/dashboard/active-projects-card";
import CriticalDeadlinesCard from "../../component/workspace/dashboard/critical-deadlines-card";
import GlobalActivityFeed from "../../component/workspace/dashboard/global-activity-feed";
import ProjectOverviewHeader from "../../component/workspace/dashboard/project-overview-header";
import TaskStatusChart from "../../component/workspace/dashboard/task-status-chart";
import TeamVelocityChart from "../../component/workspace/dashboard/team-velocity-chart";
import WorkspaceMetricCard from "../../component/workspace/dashboard/workspace-metric-card";
import QueryPageGuard from "../../component/common/query-page-guard";
import { DashboardPageSkeleton } from "../../component/skeletons";
import { useWorkspaceDashboard } from "../../hooks/use-workspace-tasks";

function WorkspaceDashboard() {
  const dashboardQuery = useWorkspaceDashboard();
  const { data } = dashboardQuery;

  return (
    <QueryPageGuard
      query={dashboardQuery}
      loading={<DashboardPageSkeleton />}
      errorTitle="Unable to load dashboard"
    >
      {data ? (
        <div className="mx-auto max-w-8xl">
          <ProjectOverviewHeader />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <WorkspaceMetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TeamVelocityChart data={data.velocity} />
            </div>
            <TaskStatusChart data={data.taskStatus} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <ActiveProjectsCard items={data.activeProjects} />
            <CriticalDeadlinesCard items={data.criticalDeadlines} />
            <GlobalActivityFeed
              items={data.activity as import("../../data/workspace-dashboard").WorkspaceActivityItem[]}
            />
          </div>
        </div>
      ) : null}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceDashboard);
