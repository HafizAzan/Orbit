import React from "react";
import WorkspacePlaceholderPage from "../../component/workspace/workspace-placeholder-page";

function WorkspaceTeams() {
  return (
    <WorkspacePlaceholderPage
      title="Teams"
      description="Organize members, roles, and collaboration groups."
    />
  );
}

export default React.memo(WorkspaceTeams);
