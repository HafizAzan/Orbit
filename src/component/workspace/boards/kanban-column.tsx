import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
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
  projectId: string;
};

function getColumnVariant(columnId: string): "default" | "pending" | "completed" {
  if (columnId === "review") return "pending";
  if (columnId === "done") return "completed";
  return "default";
}

function KanbanColumn({ column, showAddTask = false, projectId }: KanbanColumnProps) {
  const variant = getColumnVariant(column.id);

  return (
    <section className="flex w-[min(100%,320px)] shrink-0 snap-start flex-col rounded-2xl bg-slate-50/80 p-4 sm:w-[300px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <Text as="p" size="sm" weight="bold" color="muted" className="tracking-[0.12em]">
          {column.title} <Text as="span" className="text-slate-400">({column.tasks.length})</Text>
        </Text>
        <Button
          type="text"
          size="small"
          aria-label={`${column.title} column options`}
          icon={<MoreOutlined />}
          className="text-muted hover:text-foreground!"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {column.tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} variant={variant} />
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
