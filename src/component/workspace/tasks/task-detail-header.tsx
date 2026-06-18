import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import type { ApiWorkspaceTask } from "../../../types/task.types";
import { TASK_PRIORITY_CONFIG, TASK_STATUS_CONFIG } from "../../../data/workspace-tasks";
import { getTaskEditPath } from "../../../data/workspace-task-form";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { cn } from "../../../lib/utils";
import { useWorkspaceReturnTo } from "../../../lib/workspace-navigation";
import { getWorkspaceTaskHubPath } from "../../../lib/workspace-routing";
import WorkspaceBackLink from "../common/workspace-back-link";
import WorkspaceNavLink from "../common/workspace-nav-link";
import { Paragraph, Title } from "../../ui/typography";

type TaskDetailHeaderProps = {
  task: ApiWorkspaceTask;
};

function TaskDetailHeader({ task }: TaskDetailHeaderProps) {
  const { can, role } = useWorkspacePermissions();
  const canEditTask = can("task.edit");
  const taskHubPath = getWorkspaceTaskHubPath(role);
  const taskHubLabel = role === "member" ? "My Tasks" : "Tasks";
  const { returnPath, returnLabel } = useWorkspaceReturnTo(taskHubPath, taskHubLabel);

  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

  return (
    <div className="mb-6">
      <WorkspaceBackLink fallbackPath={returnPath} fallbackLabel={returnLabel} />

      <nav className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link to={returnPath} className="font-medium transition-colors hover:text-primary">
          {returnLabel}
        </Link>
        <span className="text-slate-300">›</span>
        <span>{task.taskCode}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-wide text-primary">{task.taskCode}</span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
                statusConfig.badgeClass,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dot)} />
              {statusConfig.label}
            </span>

            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
                priorityConfig.badgeClass,
              )}
            >
              {priorityConfig.label}
            </span>
          </div>

          <Title level={2} className="mt-3 text-2xl text-foreground lg:text-3xl">
            {task.title}
          </Title>

          <Paragraph size="sm" className="mt-2 text-muted">
            {task.project}
          </Paragraph>
        </div>

        {canEditTask ? (
          <WorkspaceNavLink to={getTaskEditPath(task.id)} preserveReturn>
            <Button type="primary" icon={<EditOutlined />} size="large" className="font-semibold!">
              Edit Task
            </Button>
          </WorkspaceNavLink>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(TaskDetailHeader);
