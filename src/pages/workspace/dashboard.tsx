import React from "react";
import ActiveProjectsCard from "../../component/workspace/dashboard/active-projects-card";
import CriticalDeadlinesCard from "../../component/workspace/dashboard/critical-deadlines-card";
import GlobalActivityFeed from "../../component/workspace/dashboard/global-activity-feed";
import ProjectOverviewHeader from "../../component/workspace/dashboard/project-overview-header";
import TaskStatusChart from "../../component/workspace/dashboard/task-status-chart";
import TeamVelocityChart from "../../component/workspace/dashboard/team-velocity-chart";
import WorkspaceMetricCard from "../../component/workspace/dashboard/workspace-metric-card";
import {
  ACTIVE_PROJECTS,
  CRITICAL_DEADLINES,
  TASK_STATUS_DATA,
  TEAM_VELOCITY_DATA,
  WORKSPACE_ACTIVITY,
  WORKSPACE_DASHBOARD_METRICS,
} from "../../data/workspace-dashboard";

function WorkspaceDashboard() {
  return (
    <div className="mx-auto max-w-8xl">
      <ProjectOverviewHeader />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {WORKSPACE_DASHBOARD_METRICS.map((metric) => (
          <WorkspaceMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TeamVelocityChart data={TEAM_VELOCITY_DATA} />
        </div>
        <TaskStatusChart data={TASK_STATUS_DATA} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ActiveProjectsCard items={ACTIVE_PROJECTS} />
        <CriticalDeadlinesCard items={CRITICAL_DEADLINES} />
        <GlobalActivityFeed items={WORKSPACE_ACTIVITY} />
      </div>
    </div>
  );
}

export default React.memo(WorkspaceDashboard);
