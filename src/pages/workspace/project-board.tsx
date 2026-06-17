import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import KanbanBoardHeader from "../../component/workspace/boards/kanban-board-header";
import KanbanColumn from "../../component/workspace/boards/kanban-column";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useBoard } from "../../hooks/use-workspace-tasks";
import { mapApiBoardToKanbanBoard } from "../../types/task.types";

function WorkspaceProjectBoard() {
  const { projectId = "" } = useParams();
  const { data, isLoading, isError } = useBoard(projectId);

  const board = useMemo(() => (data ? mapApiBoardToKanbanBoard(data) : null), [data]);

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={4} />;
  }

  if (isError || !board) {
    return (
      <WorkspaceNotFound
        title={isError ? "Unable to load board" : "Board not found"}
        description={
          isError
            ? "We could not load this project board. The server may be unavailable or you may not have access."
            : "This board does not exist or you do not have access to it."
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-8xl">
      <KanbanBoardHeader board={board} />

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {board.columns.map((column, index) => (
          <KanbanColumn key={column.id} column={column} showAddTask={index === 0} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(WorkspaceProjectBoard);
