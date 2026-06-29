import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import WorkspaceActivityLogsSection from "../activity/workspace-activity-logs-section";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";

function WorkspaceProfileActivityLogsCard() {
  return (
    <div className="space-y-6">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Activity Logs</h2>
            <p className="mt-1 text-sm text-muted">
              Audit entries for actions in your visible workspace modules. Updates refresh automatically.
            </p>
          </div>
          <Link to={WORKSPACE_ROUTES.ACTIVITY_LOGS}>
            <Button type="default" className="font-semibold!">
              View all activities
            </Button>
          </Link>
        </div>

        <WorkspaceActivityLogsSection compact pageSize={10} />
      </article>
    </div>
  );
}

export default React.memo(WorkspaceProfileActivityLogsCard);
