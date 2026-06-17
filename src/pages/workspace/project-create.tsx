import React from "react";
import ProjectFormScreen from "../../component/workspace/projects/project-form/project-form-screen";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";

function WorkspaceProjectCreate() {
  return (
    <WorkspaceRoleGate
      permission="project.create"
      title="Project creation restricted"
      description="Members cannot create projects. Contact your workspace admin if you need access."
    >
      <ProjectFormScreen mode="create" />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceProjectCreate);
