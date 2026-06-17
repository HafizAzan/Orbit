import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import type { MyTask } from "../../../data/workspace-my-tasks";
import { getTaskCreatePath } from "../../../data/workspace-task-form";
import { TASK_PRIORITY_CONFIG } from "../../../data/workspace-tasks";
import { formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import WorkspaceNavLink from "../common/workspace-nav-link";
import MyTasksSectionHeader from "./my-tasks-section-header";

type MyTasksDueTodaySectionProps = {
  tasks: MyTask[];
  canCreateTask: boolean;
  onOpenTask: (task: MyTask) => void;
};

function MyTasksDueTodaySection({ tasks, canCreateTask, onOpenTask }: MyTasksDueTodaySectionProps) {
  return (
    <section className="mb-8">
      <MyTasksSectionHeader title="Due Today" count={tasks.length} accentClass="bg-red-500" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => {
          const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task)}
              className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold tracking-[0.18em] text-muted uppercase">{task.project}</span>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                    priorityConfig.badgeClass,
                  )}
                >
                  {priorityConfig.label}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-foreground">{task.title}</h3>

              {task.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{task.description}</p>
              ) : null}

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <CalendarOutlined />
                  {task.dueTime ?? formatDate(task.dueDate, { year: undefined })}
                </span>

                {task.collaborators?.length ? (
                  <Avatar.Group max={{ count: 3 }} size={28}>
                    {task.collaborators.map((member) => (
                      <Avatar
                        key={member.id}
                        className={cn("font-semibold!", member.avatarColor ?? "bg-primary/10! text-primary!")}
                      >
                        {member.initials}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                ) : null}
              </div>
            </button>
          );
        })}

        {canCreateTask ? (
          <WorkspaceNavLink
            to={getTaskCreatePath()}
            className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-center transition-colors hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-feature-sync text-primary">
              <PlusOutlined className="text-xl" />
            </span>
            <span className="mt-4 text-sm font-semibold text-foreground">Add a task for today</span>
          </WorkspaceNavLink>
        ) : null}
      </div>
    </section>
  );
}

export default React.memo(MyTasksDueTodaySection);
