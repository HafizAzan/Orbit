import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import KanbanBoardHeader from "../../component/workspace/boards/kanban-board-header";
import KanbanColumn from "../../component/workspace/boards/kanban-column";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { KanbanBoardSkeleton } from "../../component/skeletons";
import { useAppContext } from "../../context/app-context";
import { useBoard } from "../../hooks/use-workspace-tasks";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import { mapApiBoardToKanbanBoard } from "../../types/task.types";

function WorkspaceProjectBoard() {
  const { projectId = "" } = useParams();
  const app = useAppContext();
  const boardQuery = useBoard(projectId);
  const { data } = boardQuery;

  const board = useMemo(() => (data ? mapApiBoardToKanbanBoard(data) : null), [data]);

  return (
    <QueryPageGuard
      query={boardQuery}
      loading={<KanbanBoardSkeleton />}
      errorTitle="Unable to load board"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!board ? (
        <WorkspaceNotFound
          title="Board not found"
          description="This board does not exist or you do not have access to it."
        />
      ) : (
        <div className="mx-auto max-w-8xl">
          <KanbanBoardHeader board={board} />

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {board.columns.map((column, index) => (
              <KanbanColumn key={column.id} column={column} showAddTask={index === 0} />
            ))}
          </div>
        </div>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjectBoard);
