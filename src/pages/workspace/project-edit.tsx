import React, { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import ProjectFormScreen from "../../component/workspace/projects/project-form/project-form-screen";
import { getWorkspaceProjectById } from "../../data/workspace-project-detail";
import { mapProjectToFormValues } from "../../data/workspace-project-form";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";

function WorkspaceProjectEdit() {
  const { projectId = "" } = useParams();
  const project = getWorkspaceProjectById(projectId);

  const initialValues = useMemo(() => {
    if (!project) return undefined;
    return mapProjectToFormValues(project);
  }, [project]);

  if (!project || !initialValues) {
    return <Navigate to={WORKSPACE_ROUTES.PROJECTS} replace />;
  }

  return <ProjectFormScreen mode="edit" projectId={projectId} initialValues={initialValues} />;
}

export default React.memo(WorkspaceProjectEdit);
