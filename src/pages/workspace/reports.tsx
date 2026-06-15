import React from "react";
import WorkspacePlaceholderPage from "../../component/workspace/workspace-placeholder-page";

function WorkspaceReports() {
  return (
    <WorkspacePlaceholderPage
      title="Reports"
      description="Review workspace performance, velocity, and delivery insights."
    />
  );
}

export default React.memo(WorkspaceReports);
