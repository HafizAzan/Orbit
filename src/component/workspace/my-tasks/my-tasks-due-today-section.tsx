import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import type { MyTask } from "../../../data/workspace-my-tasks";
import { getTaskCreatePath } from "../../../data/workspace-task-form";
import { TASK_PRIORITY_CONFIG } from "../../../data/workspace-tasks";
import { formatDate } from "../../../lib/helper";
import { resolveBadgeClass, useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import { cn } from "../../../lib/utils";
import MarkdownContent from "../../common/markdown-content";
import WorkspaceNavLink from "../common/workspace-nav-link";
import MyTasksSectionHeader from "./my-tasks-section-header";
import { Text, Title } from "../../ui/typography";

type MyTasksDueTodaySectionProps = {
  tasks: MyTask[];
  canCreateTask: boolean;
  onOpenTask: (task: MyTask) => void;
};

function MyTasksDueTodaySection({ tasks, canCreateTask, onOpenTask }: MyTasksDueTodaySectionProps) {
  const isDark = useIsDarkAppTheme();

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
                <Text as="span" size="xs" weight="bold" color="muted" className="text-[11px]! tracking-[0.18em] uppercase">{task.project}</Text>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                    resolveBadgeClass(priorityConfig.badgeClass, isDark),
                  )}
                >
                  {priorityConfig.label}
                </span>
              </div>

              <Title level={5} color="default" className="mt-3">{task.title}</Title>

              {task.description ? (
                <MarkdownContent content={task.description} className="mt-2" lineClamp={2} interactive={false} />
              ) : null}

              <div className="mt-5 flex items-center justify-between gap-3">
                <Text as="span" size="sm" color="muted" className="inline-flex items-center gap-1.5">
                  <CalendarOutlined />
                  {task.dueTime ?? formatDate(task.dueDate, { year: undefined })}
                </Text>

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
            <Text as="span" size="sm" weight="semibold" className="mt-4">Add a task for today</Text>
          </WorkspaceNavLink>
        ) : null}
      </div>
    </section>
  );
}

export default React.memo(MyTasksDueTodaySection);
