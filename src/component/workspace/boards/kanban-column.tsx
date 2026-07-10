import { CheckCircleOutlined, InboxOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import type { KanbanColumn as KanbanColumnType } from "../../../data/workspace-board";
import KanbanTaskCard from "./kanban-task-card";
import WorkspaceNavLink from "../common/workspace-nav-link";
import { getTaskCreatePath } from "../../../data/workspace-task-form";
import { Paragraph, Text } from "../../ui/typography";

type KanbanColumnProps = {
  column: KanbanColumnType;
  showAddTask?: boolean;
  showDoneTaskDelete?: boolean;
  projectId: string;
  onDeleteTask?: (taskId: string) => void;
};

const EMPTY_COPY: Record<string, { icon: React.ReactNode; title: string; description: string }> = {
  todo: {
    icon: <InboxOutlined className="text-lg" />,
    title: "No tasks yet",
    description: "Drop work here when you are ready to start planning.",
  },
  in_progress: {
    icon: <SyncOutlined className="text-lg" />,
    title: "Nothing in progress",
    description: "Move a task here when someone starts working on it.",
  },
  review: {
    icon: <InboxOutlined className="text-lg" />,
    title: "Queue is clear",
    description: "Tasks waiting for review will show up in this column.",
  },
  done: {
    icon: <CheckCircleOutlined className="text-lg" />,
    title: "No completed work",
    description: "Finished tasks will land here when marked done.",
  },
};

function getColumnVariant(columnId: string): "default" | "pending" | "completed" {
  if (columnId === "review") return "pending";
  if (columnId === "done") return "completed";
  return "default";
}

function KanbanColumn({
  column,
  showAddTask = false,
  showDoneTaskDelete = false,
  projectId,
  onDeleteTask,
}: KanbanColumnProps) {
  const variant = getColumnVariant(column.id);
  const canDeleteTask = showDoneTaskDelete && column.id === "done";
  const emptyCopy = EMPTY_COPY[column.id] ?? EMPTY_COPY.todo;
  const isEmpty = column.tasks.length === 0;

  return (
    <section className="flex h-[min(70vh,640px)] w-[min(100%,320px)] shrink-0 snap-start flex-col rounded-2xl bg-muted-surface/80 p-4 sm:w-[300px]">
      <div className="mb-4 shrink-0 px-1">
        <Text as="p" size="sm" weight="bold" color="muted" className="tracking-[0.12em]">
          {column.title}{" "}
          <Text as="span" color="muted">
            ({column.tasks.length})
          </Text>
        </Text>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1">
        {isEmpty ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/30 px-4 py-8 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-background text-muted">
              {emptyCopy.icon}
            </span>
            <Text as="p" size="sm" weight="semibold">
              {emptyCopy.title}
            </Text>
            <Paragraph size="xs" color="muted" className="mt-1 mb-0! max-w-56">
              {emptyCopy.description}
            </Paragraph>
          </div>
        ) : (
          column.tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              variant={variant}
              showDelete={canDeleteTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>

      {showAddTask ? (
        <WorkspaceNavLink to={getTaskCreatePath(projectId)} preserveReturn className="mt-4 shrink-0">
          <Button type="dashed" block icon={<PlusOutlined />} className="h-auto rounded-xl border-dashed py-3 font-medium!">
            Add Task
          </Button>
        </WorkspaceNavLink>
      ) : null}
    </section>
  );
}

export default React.memo(KanbanColumn);
