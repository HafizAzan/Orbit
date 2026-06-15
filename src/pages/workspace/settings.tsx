import React from "react";
import WorkspacePlaceholderPage from "../../component/workspace/workspace-placeholder-page";

function WorkspaceSettings() {
  return (
    <WorkspacePlaceholderPage
      title="Settings"
      description="Configure workspace preferences, billing, and integrations."
    />
  );
}

export default React.memo(WorkspaceSettings);
