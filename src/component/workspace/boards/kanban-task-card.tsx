import { CalendarOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import type { KanbanTask } from "../../../data/workspace-board";
import { KANBAN_PRIORITY_CONFIG } from "../../../data/workspace-board";
import { getTaskDetailPath } from "../../../data/workspace-task-form";
import MarkdownContent from "../../common/markdown-content";
import { cn } from "../../../lib/utils";

type KanbanTaskCardProps = {
  task: KanbanTask;
  variant?: "default" | "pending" | "completed";
};

function KanbanTaskCard({ task, variant = "default" }: KanbanTaskCardProps) {
  const priorityConfig = KANBAN_PRIORITY_CONFIG[task.priority];
  const isCompleted = variant === "completed";

  return (
    <Link
      to={getTaskDetailPath(task.id)}
      className={cn(
        "block min-h-[120px] rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:min-h-[140px] sm:p-5 lg:p-6",
        isCompleted ? "border-emerald-100 bg-emerald-50/30" : "border-border",
        variant === "pending" && "border-amber-100 bg-amber-50/20",
      )}
    >
      <span
        className={cn(
          "inline-flex rounded-md border px-2.5 py-1 text-xs font-bold tracking-wide",
          priorityConfig.badgeClass,
        )}
      >
        {priorityConfig.label}
      </span>

      <h3
        className={cn(
          "mt-4 text-base font-semibold leading-snug sm:text-[17px]",
          isCompleted ? "text-muted line-through decoration-slate-300" : "text-foreground",
        )}
      >
        {task.title}
      </h3>

      {task.description ? (
        <MarkdownContent content={task.description} className="mt-3" lineClamp={3} interactive={false} />
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm text-muted">
          <CalendarOutlined />
          {task.dueLabel}
        </span>

        <div
          title={task.assignee.name}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            task.assignee.avatarColor,
          )}
        >
          {task.assignee.initials}
        </div>
      </div>
    </Link>
  );
}

export default React.memo(KanbanTaskCard);
