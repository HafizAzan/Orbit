import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import TaskFormScreen from "../../component/workspace/tasks/task-form/task-form-screen";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useTask } from "../../hooks/use-workspace-tasks";
import { useAppContext } from "../../context/app-context";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import { mapApiTaskToFormValues } from "../../types/task.types";

function WorkspaceTaskEdit() {
  const { taskId = "" } = useParams();
  const app = useAppContext();
  const taskQuery = useTask(taskId);
  const { data: task } = taskQuery;

  const initialValues = useMemo(() => {
    if (!task) return undefined;
    return mapApiTaskToFormValues(task);
  }, [task]);

  return (
    <QueryPageGuard
      query={taskQuery}
      loading={<AdminListPageSkeleton tableColumns={2} />}
      errorTitle="Unable to load task"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!task || !initialValues ? (
        <WorkspaceNotFound
          title="Task not found"
          description="This task does not exist or you do not have access to it."
        />
      ) : (
        <WorkspaceRoleGate
          permission="task.edit"
          title="Task editing restricted"
          description="You do not have permission to edit tasks in this workspace."
        >
          <TaskFormScreen mode="edit" taskId={taskId} initialValues={initialValues} />
        </WorkspaceRoleGate>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceTaskEdit);
