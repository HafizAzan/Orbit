import React, { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import TaskFormScreen from "../../component/workspace/tasks/task-form/task-form-screen";
import { getWorkspaceTaskById, mapTaskToFormValues } from "../../data/workspace-task-form";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";

function WorkspaceTaskEdit() {
  const { taskId = "" } = useParams();
  const task = getWorkspaceTaskById(taskId);

  const initialValues = useMemo(() => {
    if (!task) return undefined;
    return mapTaskToFormValues(task);
  }, [task]);

  if (!task || !initialValues) {
    return <Navigate to={WORKSPACE_ROUTES.TASKS} replace />;
  }

  return <TaskFormScreen mode="edit" initialValues={initialValues} />;
}

export default React.memo(WorkspaceTaskEdit);
