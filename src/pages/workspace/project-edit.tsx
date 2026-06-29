import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProjectFormScreen from "../../component/workspace/projects/project-form/project-form-screen";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { FormPageSkeleton } from "../../component/skeletons";
import { useProject } from "../../hooks/use-workspace-projects";
import { useAppContext } from "../../context/app-context";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import { mapApiProjectToFormValues } from "../../types/project.types";

function WorkspaceProjectEdit() {
  const { projectId = "" } = useParams();
  const app = useAppContext();
  const projectQuery = useProject(projectId);
  const { data: project } = projectQuery;

  const initialValues = useMemo(() => {
    if (!project) return undefined;
    return mapApiProjectToFormValues(project);
  }, [project]);

  const canDelete = project?.viewerRole === "admin" || project?.createdById === project?.leadUserId;

  return (
    <QueryPageGuard
      query={projectQuery}
      loading={<FormPageSkeleton />}
      errorTitle="Unable to load project"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!project || !initialValues ? (
        <WorkspaceNotFound
          title="Project not found"
          description="This project does not exist or you do not have access to it."
        />
      ) : (
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
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjectEdit);
