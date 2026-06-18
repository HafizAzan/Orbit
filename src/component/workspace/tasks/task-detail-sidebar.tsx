import { CalendarOutlined, ClockCircleOutlined, FieldTimeOutlined, ProjectOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import type { ApiWorkspaceTask } from "../../../types/task.types";
import { getProjectBoardPath, getProjectDetailPath } from "../../../data/workspace-project-detail";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { formatDate } from "../../../lib/helper";

type TaskDetailSidebarProps = {
  task: ApiWorkspaceTask;
};

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-feature-sync text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        <div className="mt-1 text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

function TaskDetailSidebar({ task }: TaskDetailSidebarProps) {
  const { role } = useWorkspacePermissions();
  const projectPath = role === "member" ? getProjectBoardPath(task.projectId) : getProjectDetailPath(task.projectId);
  const assignee = task.assignee;

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Details</h3>

        <div className="mt-4 space-y-4">
          <DetailRow icon={<ProjectOutlined />} label="Project">
            <Link to={projectPath} className="text-primary transition-opacity hover:opacity-80">
              {task.project}
            </Link>
          </DetailRow>

          <DetailRow icon={<UserOutlined />} label="Assignee">
            {assignee ? (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-feature-sync text-[11px] font-bold text-primary">
                  {assignee.initials}
                </div>
                <span>{assignee.name}</span>
              </div>
            ) : (
              <span className="text-muted">Unassigned</span>
            )}
          </DetailRow>

          <DetailRow icon={<CalendarOutlined />} label="Due date">
            {task.dueDate ? formatDate(task.dueDate) : <span className="text-muted">No due date</span>}
          </DetailRow>

          <DetailRow icon={<FieldTimeOutlined />} label="Estimated hours">
            {task.estimatedHours != null ? (
              `${task.estimatedHours} hrs`
            ) : (
              <span className="text-muted">Not set</span>
            )}
          </DetailRow>

          <DetailRow icon={<TagOutlined />} label="Labels">
            {task.labels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted">No labels</span>
            )}
          </DetailRow>

          <DetailRow icon={<ClockCircleOutlined />} label="Created">
            {formatDate(task.createdAt)}
          </DetailRow>

          <DetailRow icon={<ClockCircleOutlined />} label="Last updated">
            {formatDate(task.updatedAt)}
          </DetailRow>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-center">
        <ClockCircleOutlined className="text-xl text-muted" />
        <p className="mt-3 text-sm text-muted">Activity will appear here as the task progresses.</p>
      </section>
    </aside>
  );
}

export default React.memo(TaskDetailSidebar);
