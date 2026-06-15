import React from "react";
import { Navigate, useParams } from "react-router-dom";
import KanbanBoardHeader from "../../component/workspace/boards/kanban-board-header";
import KanbanColumn from "../../component/workspace/boards/kanban-column";
import { getProjectKanbanBoard } from "../../data/workspace-board";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";

function WorkspaceProjectBoard() {
  const { projectId = "" } = useParams();
  const board = getProjectKanbanBoard(projectId);

  if (!board) {
    return <Navigate to={WORKSPACE_ROUTES.PROJECTS} replace />;
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
