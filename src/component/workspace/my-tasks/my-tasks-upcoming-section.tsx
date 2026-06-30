import { BarChartOutlined, RocketOutlined, SafetyOutlined } from "@ant-design/icons";
import React from "react";
import type { MyTask, MyTaskIcon } from "../../../data/workspace-my-tasks";
import { TASK_PRIORITY_CONFIG } from "../../../data/workspace-tasks";
import { formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import MyTasksSectionHeader from "./my-tasks-section-header";
import { Paragraph, Text, Title } from "../../ui/typography";

type MyTasksUpcomingSectionProps = {
  tasks: MyTask[];
  onOpenTask: (task: MyTask) => void;
};

function getTaskIcon(icon: MyTaskIcon = "default") {
  switch (icon) {
    case "rocket":
      return RocketOutlined;
    case "chart":
      return BarChartOutlined;
    case "shield":
      return SafetyOutlined;
    default:
      return RocketOutlined;
  }
}

function MyTasksUpcomingSection({ tasks, onOpenTask }: MyTasksUpcomingSectionProps) {
  return (
    <section className="mb-8">
      <MyTasksSectionHeader title="Upcoming" count={tasks.length} accentClass="bg-sky-500" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => {
          const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
          const Icon = getTaskIcon(task.icon);

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task)}
              className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-feature-sync text-primary">
                  <Icon className="text-lg" />
                </span>

                <div className="min-w-0 flex-1">
                  <Text as="p" size="xs" weight="bold" color="muted" className="text-[11px]! tracking-[0.18em] uppercase">{task.project}</Text>
                  <Title level={5} color="default" className="mt-2 text-base!">{task.title}</Title>
                  <Paragraph size="sm" className="mt-2">{formatDate(task.dueDate, { year: undefined })}</Paragraph>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                        priorityConfig.badgeClass,
                      )}
                    >
                      {priorityConfig.label}
                    </span>
                    {task.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-semibold text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(MyTasksUpcomingSection);
