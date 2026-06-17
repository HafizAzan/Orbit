import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProjectFormScreen from "../../component/workspace/projects/project-form/project-form-screen";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useProject } from "../../hooks/use-workspace-projects";
import { mapApiProjectToFormValues } from "../../types/project.types";

function WorkspaceProjectEdit() {
  const { projectId = "" } = useParams();
  const { data: project, isLoading, isError } = useProject(projectId);

  const initialValues = useMemo(() => {
    if (!project) return undefined;
    return mapApiProjectToFormValues(project);
  }, [project]);

  const canDelete = project?.viewerRole === "admin" || project?.createdById === project?.leadUserId;

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={2} />;
  }

  if (isError || !project || !initialValues) {
    return (
      <WorkspaceNotFound
        title={isError ? "Unable to load project" : "Project not found"}
        description={
          isError
            ? "We could not load this project. The server may be unavailable or this project may no longer exist."
            : "This project does not exist or you do not have access to it."
        }
      />
    );
  }

  return (
    <WorkspaceRoleGate
      permission="project.edit"
      title="Project editing restricted"
      description="You do not have permission to edit projects in this workspace."
    >
      <ProjectFormScreen
        mode="edit"
        projectId={projectId}
        initialValues={initialValues}
        canDelete={canDelete || project.viewerRole === "admin"}
      />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceProjectEdit);
