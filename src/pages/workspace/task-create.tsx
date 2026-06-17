import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TaskFormScreen from "../../component/workspace/tasks/task-form/task-form-screen";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { DEFAULT_TASK_FORM_VALUES } from "../../data/workspace-task-form";

function WorkspaceTaskCreate() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");

  const initialValues = useMemo(
    () => ({
      ...DEFAULT_TASK_FORM_VALUES,
      projectId: projectId && projectId.length > 0 ? projectId : DEFAULT_TASK_FORM_VALUES.projectId,
    }),
    [projectId],
  );

  return (
    <WorkspaceRoleGate
      permission="task.create"
      title="Task creation restricted"
      description="You do not have permission to create tasks in this workspace."
    >
      <TaskFormScreen mode="create" initialValues={initialValues} />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceTaskCreate);
