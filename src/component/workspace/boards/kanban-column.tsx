import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import type { KanbanColumn as KanbanColumnType } from "../../../data/workspace-board";
import KanbanTaskCard from "./kanban-task-card";
import WorkspaceNavLink from "../common/workspace-nav-link";
import { getTaskCreatePath } from "../../../data/workspace-task-form";
import { Text } from "../../ui/typography";

type KanbanColumnProps = {
  column: KanbanColumnType;
  showAddTask?: boolean;
  showDoneTaskDelete?: boolean;
  projectId: string;
  onDeleteTask?: (taskId: string) => void;
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

  return (
    <section className="flex w-[min(100%,320px)] shrink-0 snap-start flex-col rounded-2xl bg-muted-surface/80 p-4 sm:w-[300px]">
      <div className="mb-4 px-1">
        <Text as="p" size="sm" weight="bold" color="muted" className="tracking-[0.12em]">
          {column.title} <Text as="span" color="muted">({column.tasks.length})</Text>
        </Text>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {column.tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            variant={variant}
            showDelete={canDeleteTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {showAddTask ? (
        <WorkspaceNavLink to={getTaskCreatePath(projectId)} preserveReturn>
          <Button type="dashed" block icon={<PlusOutlined />} className="mt-4 h-auto rounded-xl border-dashed py-3 font-medium!">
            Add Task
          </Button>
        </WorkspaceNavLink>
      ) : null}
    </section>
  );
}

export default React.memo(KanbanColumn);
