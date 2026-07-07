import { CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import type { KanbanTask } from "../../../data/workspace-board";
import { KANBAN_PRIORITY_CONFIG } from "../../../data/workspace-board";
import { getTaskDetailPath } from "../../../data/workspace-task-form";
import MarkdownContent from "../../common/markdown-content";
import { resolveBadgeClass, useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import { cn } from "../../../lib/utils";
import { Text } from "../../ui/typography";

type KanbanTaskCardProps = {
  task: KanbanTask;
  variant?: "default" | "pending" | "completed";
  showDelete?: boolean;
  onDelete?: (taskId: string) => void;
};

function KanbanTaskCard({ task, variant = "default", showDelete = false, onDelete }: KanbanTaskCardProps) {
  const isDark = useIsDarkAppTheme();
  const priorityConfig = KANBAN_PRIORITY_CONFIG[task.priority];
  const isCompleted = variant === "completed";

  return (
    <div
      className={cn(
        "group relative min-h-[120px] rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md sm:min-h-[140px]",
        isCompleted
          ? isDark
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-emerald-100 bg-emerald-50/30"
          : "border-border",
        variant === "pending" && (isDark ? "border-amber-500/30 bg-amber-500/10" : "border-amber-100 bg-amber-50/20"),
      )}
    >
      {showDelete && onDelete ? (
        <button
          type="button"
          aria-label={`Delete ${task.title}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete(task.id);
          }}
          className={cn(
            "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
            isDark && "hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400",
          )}
        >
          <DeleteOutlined className="text-sm" />
        </button>
      ) : null}

      <Link
        to={getTaskDetailPath(task.id)}
        className="block h-full p-4 sm:p-5 lg:p-6"
      >
        <span
          className={cn(
            "inline-flex rounded-md border px-2.5 py-1 text-xs font-bold tracking-wide",
            resolveBadgeClass(priorityConfig.badgeClass, isDark),
          )}
        >
          {priorityConfig.label}
        </span>

        <Text
          as="p"
          weight="semibold"
          className={cn(
            "mt-4 text-base leading-snug sm:text-[17px]",
            isCompleted ? "text-muted line-through decoration-slate-300" : "text-foreground",
          )}
        >
          {task.title}
        </Text>

        {task.description ? (
          <MarkdownContent content={task.description} className="mt-3" lineClamp={3} interactive={false} />
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          <Text as="span" size="sm" color="muted" className="inline-flex items-center gap-2">
            <CalendarOutlined />
            {task.dueLabel}
          </Text>

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
    </div>
  );
}

export default React.memo(KanbanTaskCard);
