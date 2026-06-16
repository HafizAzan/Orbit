import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TaskFormScreen from "../../component/workspace/tasks/task-form/task-form-screen";
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

  return <TaskFormScreen mode="create" initialValues={initialValues} />;
}

export default React.memo(WorkspaceTaskCreate);
