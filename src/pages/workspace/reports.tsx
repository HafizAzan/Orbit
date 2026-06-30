import React from "react";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { ReportsPageSkeleton } from "../../component/skeletons";
import { useWorkspaceReports } from "../../hooks/use-workspace-tasks";
import { Paragraph, Text, Title } from "../../component/ui/typography";

function WorkspaceReportsContent() {
  const reportsQuery = useWorkspaceReports();
  const { data } = reportsQuery;

  return (
    <QueryPageGuard
      query={reportsQuery}
      loading={<ReportsPageSkeleton />}
      errorTitle="Unable to load reports"
    >
      {data ? (
        <div className="mx-auto max-w-8xl">
          <div className="mb-6">
            <Title level={2} className="text-2xl text-foreground lg:text-3xl">
              Reports
            </Title>
            <Paragraph size="sm" className="mt-1 max-w-2xl text-muted">
              Delivery insights scoped to your projects and squad.
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportMetricCard label="Total Tasks" value={String(data.summary.totalTasks)} />
            <ReportMetricCard label="Completed" value={String(data.summary.completedTasks)} />
            <ReportMetricCard label="Overdue" value={String(data.summary.overdueTasks)} />
            <ReportMetricCard label="Active Projects" value={String(data.summary.activeProjects)} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Text as="p" size="sm" weight="semibold">Tasks by project</Text>
              <div className="mt-4 space-y-3">
                {data.tasksByProject.length === 0 ? (
                  <Paragraph size="sm" className="text-muted">
                    No project task data yet.
                  </Paragraph>
                ) : (
                  data.tasksByProject.map((project) => (
                    <div
                      key={project.projectId}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                    >
                      <div>
                        <Text as="p" weight="medium">{project.projectName}</Text>
                        <Paragraph size="sm">{project.inProgress} in progress</Paragraph>
                      </div>
                      <Text as="p" size="sm" weight="semibold">
                        {project.completed}/{project.total} done
                      </Text>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Text as="p" size="sm" weight="semibold">Tasks by priority</Text>
              <div className="mt-4 space-y-3">
                {data.tasksByPriority.map((item) => (
                  <div
                    key={item.priority}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                  >
                    <Text as="p" weight="medium" className="capitalize">{item.priority}</Text>
                    <Text as="p" size="sm" weight="semibold">{item.count}</Text>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </QueryPageGuard>
  );
}

function ReportMetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">{label}</Text>
      <Text as="p" size="lg" weight="bold" className="mt-3 text-3xl!">{value}</Text>
    </article>
  );
}

function WorkspaceReports() {
  return (
    <WorkspaceRoleGate
      permission="reports.view"
      title="Reports access restricted"
      description="Reports are available to owners, admins, and managers."
    >
      <WorkspaceReportsContent />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceReports);
