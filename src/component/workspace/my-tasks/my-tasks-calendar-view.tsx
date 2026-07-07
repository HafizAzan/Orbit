import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo, useState } from "react";
import type { MyTask } from "../../../data/workspace-my-tasks";
import { formatCalendarHeading, shiftCalendarDate } from "../../../lib/calendar-utils";
import { mapMyTaskToCalendarEvent } from "../../../lib/workspace-my-tasks-utils";
import CalendarMonthGrid from "../calendar/calendar-month-grid";
import { Paragraph, Text, Title } from "../../ui/typography";

type MyTasksCalendarViewProps = {
  tasks: MyTask[];
  onOpenTask: (task: MyTask) => void;
};

function MyTasksCalendarView({ tasks, onOpenTask }: MyTasksCalendarViewProps) {
  const [activeDate, setActiveDate] = useState(() => new Date());
  const [selectedIso, setSelectedIso] = useState<string | null>(null);

  const events = useMemo(() => tasks.map(mapMyTaskToCalendarEvent), [tasks]);
  const heading = formatCalendarHeading(activeDate, "month");

  const selectedTasks = useMemo(() => {
    if (!selectedIso) return [];

    return tasks.filter((task) => {
      const date = task.dueDate.includes("T") ? task.dueDate.slice(0, 10) : task.dueDate;
      return date === selectedIso;
    });
  }, [selectedIso, tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setActiveDate((current) => shiftCalendarDate(current, "month", -1))}
            className="text-muted!"
            aria-label="Previous month"
          />
          <Text as="span" weight="semibold" className="min-w-[9rem] px-2 text-center text-sm text-foreground sm:min-w-[11rem] sm:text-base">
            {heading}
          </Text>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => setActiveDate((current) => shiftCalendarDate(current, "month", 1))}
            className="text-muted!"
            aria-label="Next month"
          />
        </div>

        <Button onClick={() => setActiveDate(new Date())} className="rounded-xl! font-semibold!">
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <CalendarMonthGrid
          activeDate={activeDate}
          events={events}
          onSelectDate={(date) => {
            const localIso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            setSelectedIso(localIso);
          }}
        />

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
          <Title level={5} className="text-sm! text-foreground">
            {selectedIso ? "Tasks on selected day" : "Your schedule"}
          </Title>
          <Paragraph size="sm" className="mt-1">
            {selectedIso
              ? `${selectedTasks.length} ${selectedTasks.length === 1 ? "task" : "tasks"} due on this day.`
              : "Select a day on the calendar to see your due tasks."}
          </Paragraph>

          {selectedIso ? (
            <ul className="mt-4 space-y-2">
              {selectedTasks.length === 0 ? (
                <Paragraph size="sm" className="rounded-xl border border-dashed border-border bg-background/50 px-3 py-3">
                  No tasks due on this day.
                </Paragraph>
              ) : (
                selectedTasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => onOpenTask(task)}
                      className="w-full rounded-xl border border-border bg-background/70 px-3 py-3 text-left transition-colors hover:border-primary/30 hover:bg-feature-sync"
                    >
                      <Text as="p" size="sm" weight="semibold" className="truncate">
                        {task.title}
                      </Text>
                      <Paragraph size="xs" className="mt-1 truncate">
                        {task.project}
                      </Paragraph>
                      <Text as="span" size="xs" color="muted" className="mt-1 block capitalize">
                        {task.status.replace("_", " ")}
                      </Text>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <Paragraph size="sm" className="mt-4 rounded-xl border border-dashed border-border bg-background/50 px-3 py-3">
              {events.length > 0
                ? `${events.length} tasks with due dates across your assignments.`
                : "No due dates yet. Tasks you are assigned will appear here."}
            </Paragraph>
          )}
        </aside>
      </div>
    </div>
  );
}

export default React.memo(MyTasksCalendarView);
