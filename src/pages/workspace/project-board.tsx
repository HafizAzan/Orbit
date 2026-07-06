import { DeleteOutlined } from "@ant-design/icons";
import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import KanbanBoardHeader from "../../component/workspace/boards/kanban-board-header";
import KanbanColumn from "../../component/workspace/boards/kanban-column";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { KanbanBoardSkeleton } from "../../component/skeletons";
import { ConfirmModal } from "../../component/ui/modal";
import { useAppContext } from "../../context/app-context";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useBoard, useDeleteTask } from "../../hooks/use-workspace-tasks";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import { mapApiBoardToKanbanBoard } from "../../types/task.types";
import { Text } from "../../component/ui/typography";

function WorkspaceProjectBoard() {
  const { projectId = "" } = useParams();
  const app = useAppContext();
  const { can } = useWorkspacePermissions();
  const canCreateTask = can("task.create");
  const canDeleteDoneTask = can("task.delete_any");
  const boardQuery = useBoard(projectId);
  const { data } = boardQuery;
  const { mutateAsync: deleteTask, isPending: isDeletingTask } = useDeleteTask();
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<string | null>(null);

  const board = useMemo(() => (data ? mapApiBoardToKanbanBoard(data) : null), [data]);

  const pendingDeleteTask = useMemo(() => {
    if (!board || !pendingDeleteTaskId) return null;

    for (const column of board.columns) {
      const task = column.tasks.find((item) => item.id === pendingDeleteTaskId);
      if (task) return task;
    }

    return null;
  }, [board, pendingDeleteTaskId]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setPendingDeleteTaskId(taskId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteTaskId) return;

    try {
      const result = await deleteTask(pendingDeleteTaskId);
      showApiSuccessToast(result.message ?? "Task deleted.");
      setPendingDeleteTaskId(null);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [deleteTask, pendingDeleteTaskId]);

  return (
    <QueryPageGuard
      query={boardQuery}
      loading={<KanbanBoardSkeleton />}
      errorTitle="Unable to load board"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!board ? (
        <WorkspaceNotFound title="Board not found" description="This board does not exist or you do not have access to it." />
      ) : (
        <div className="mx-auto max-w-8xl">
          <KanbanBoardHeader board={board} />

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {board.columns.map((column, index) => (
              <KanbanColumn
                key={column.id}
                column={column}
                showAddTask={index === 0 && canCreateTask}
                showDoneTaskDelete={canDeleteDoneTask}
                projectId={board.projectId}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          <ConfirmModal
            open={pendingDeleteTask !== null}
            onClose={() => setPendingDeleteTaskId(null)}
            onConfirm={handleConfirmDelete}
            title="Delete task"
            description={
              pendingDeleteTask ? (
                <>
                  Delete <Text as="span" weight="semibold">{pendingDeleteTask.title}</Text> from this board? This cannot be
                  undone.
                </>
              ) : null
            }
            confirmText="Delete task"
            confirmDanger
            confirmLoading={isDeletingTask}
            icon={<DeleteOutlined />}
          />
        </div>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjectBoard);
