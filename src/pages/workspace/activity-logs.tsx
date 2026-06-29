import React from "react";
import { Paragraph, Title } from "../../component/ui/typography";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceActivityLogsSection from "../../component/workspace/activity/workspace-activity-logs-section";
import { ActivityLogsPageSkeleton } from "../../component/skeletons";
import { useWorkspaceActivities } from "../../hooks/use-workspace-activity";

function WorkspaceActivityLogsPage() {
  const activitiesQuery = useWorkspaceActivities({ page: 1, limit: 20 });

  return (
    <QueryPageGuard
      query={activitiesQuery}
      loading={<ActivityLogsPageSkeleton />}
      errorTitle="Unable to load activity logs"
    >
      <div className="mx-auto max-w-8xl">
        <div className="mb-6">
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Activity Logs
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Audit trail for workspace actions. Entries refresh automatically every 30 seconds while this page is open.
          </Paragraph>
        </div>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <WorkspaceActivityLogsSection />
        </article>
      </div>
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceActivityLogsPage);
