import { Checkbox } from "antd";
import React from "react";
import type { MyTask } from "../../../data/workspace-my-tasks";
import { TASK_PRIORITY_CONFIG } from "../../../data/workspace-tasks";
import { formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import MyTasksSectionHeader from "./my-tasks-section-header";
import { Paragraph, Text } from "../../ui/typography";

type MyTasksAssignedSectionProps = {
  tasks: MyTask[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onOpenTask: (task: MyTask) => void;
};

function MyTasksAssignedSection({ tasks, onToggleComplete, onOpenTask }: MyTasksAssignedSectionProps) {
  return (
    <section className="mb-8">
      <MyTasksSectionHeader title="Assigned to Me" count={tasks.length} accentClass="bg-violet-500" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {tasks.map((task, index) => {
          const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
          const isDone = task.status === "done";

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
                  checked={isDone}
                  onChange={(event) => onToggleComplete(task.id, event.target.checked)}
                  className="mt-1"
                />
                <button type="button" onClick={() => onOpenTask(task)} className="min-w-0 text-left">
                  <Text as="p" weight="semibold">{task.title}</Text>
                  <Paragraph size="sm" className="mt-1">{task.project}</Paragraph>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <Text as="span" size="sm" color="muted">{formatDate(task.dueDate, { year: undefined })}</Text>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                    priorityConfig.badgeClass,
                  )}
                >
                  {priorityConfig.label}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-feature-sync text-[11px] font-bold text-primary">
                  {task.assignee.initials}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(MyTasksAssignedSection);
