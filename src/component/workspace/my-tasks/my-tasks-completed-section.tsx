import { CheckCircleOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React, { useState } from "react";
import type { MyTask } from "../../../data/workspace-my-tasks";
import { TASK_PRIORITY_CONFIG } from "../../../data/workspace-tasks";
import { formatDate } from "../../../lib/helper";
import { resolveBadgeClass, useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type MyTasksCompletedSectionProps = {
  tasks: MyTask[];
  onClearAll?: () => void;
  onOpenTask: (task: MyTask) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
};

function MyTasksCompletedSection({
  tasks,
  onClearAll,
  onOpenTask,
  onToggleComplete,
}: MyTasksCompletedSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const isDark = useIsDarkAppTheme();
  const count = tasks.length;

  if (count === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Title level={5} color="default">Completed</Title>
          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-slate-500 px-2 py-0.5 text-xs font-bold text-white">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onClearAll ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              Hide completed
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className={cn("text-muted transition-colors hover:text-foreground")}
            aria-label={expanded ? "Collapse completed tasks" : "Expand completed tasks"}
          >
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {tasks.map((task, index) => {
            const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

            return (
              <div
                key={task.id}
                className={cn(
                  "flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
                  index > 0 && "border-t border-border",
                )}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <Checkbox
                    checked
                    onChange={() => onToggleComplete(task.id, false)}
                    className="mt-1"
                  />
                  <button type="button" onClick={() => onOpenTask(task)} className="min-w-0 text-left">
                    <Text as="p" weight="semibold" className="text-muted line-through">
                      {task.title}
                    </Text>
                    <Paragraph size="sm" className="mt-1">{task.project}</Paragraph>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <Text as="span" size="sm" color="muted">{formatDate(task.dueDate, { year: undefined })}</Text>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                      resolveBadgeClass(priorityConfig.badgeClass, isDark),
                    )}
                  >
                    {priorityConfig.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircleOutlined />
                    Done
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Paragraph size="sm" className="mt-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          Expand to review {count} completed {count === 1 ? "task" : "tasks"} or reopen any item.
        </Paragraph>
      )}
    </section>
  );
}

export default React.memo(MyTasksCompletedSection);
