import React from "react";
import ProjectFormScreen from "../../component/workspace/projects/project-form/project-form-screen";

function WorkspaceProjectCreate() {
  return <ProjectFormScreen mode="create" />;
}

export default React.memo(WorkspaceProjectCreate);
