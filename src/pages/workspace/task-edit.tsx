import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import TaskFormScreen from "../../component/workspace/tasks/task-form/task-form-screen";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useTask } from "../../hooks/use-workspace-tasks";
import { mapApiTaskToFormValues } from "../../types/task.types";

function WorkspaceTaskEdit() {
  const { taskId = "" } = useParams();
  const { data: task, isLoading, isError } = useTask(taskId);

  const initialValues = useMemo(() => {
    if (!task) return undefined;
    return mapApiTaskToFormValues(task);
  }, [task]);

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={2} />;
  }

  if (isError || !task || !initialValues) {
    return (
      <WorkspaceNotFound
        title={isError ? "Unable to load task" : "Task not found"}
        description={
          isError
            ? "We could not load this task. The server may be unavailable or this task may no longer exist."
            : "This task does not exist or you do not have access to it."
        }
      />
    );
  }

  return (
    <WorkspaceRoleGate
      permission="task.edit"
      title="Task editing restricted"
      description="You do not have permission to edit tasks in this workspace."
    >
      <TaskFormScreen mode="edit" taskId={taskId} initialValues={initialValues} />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceTaskEdit);
