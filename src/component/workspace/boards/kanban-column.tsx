import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import type { KanbanColumn as KanbanColumnType } from "../../../data/workspace-board";
import KanbanTaskCard from "./kanban-task-card";

type KanbanColumnProps = {
  column: KanbanColumnType;
  showAddTask?: boolean;
};

function getColumnVariant(columnId: string): "default" | "pending" | "completed" {
  if (columnId === "review") return "pending";
  if (columnId === "done") return "completed";
  return "default";
}

function KanbanColumn({ column, showAddTask = false }: KanbanColumnProps) {
  const variant = getColumnVariant(column.id);

  return (
    <section className="flex w-[min(100%,320px)] shrink-0 snap-start flex-col rounded-2xl bg-slate-50/80 p-4 sm:w-[300px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold tracking-[0.12em] text-muted">
          {column.title}{" "}
          <span className="text-slate-400">({column.tasks.length})</span>
        </h2>
        <button
          type="button"
          aria-label={`${column.title} column options`}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-foreground"
        >
          <MoreOutlined />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {column.tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} variant={variant} />
        ))}
      </div>

      {showAddTask ? (
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white/60 py-3 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
        >
          <PlusOutlined className="text-xs" />
          Add Task
        </button>
      ) : null}
    </section>
  );
}

export default React.memo(KanbanColumn);
