import React from "react";
import WorkspacePlaceholderPage from "../../component/workspace/workspace-placeholder-page";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";

function WorkspaceReports() {
  return (
    <WorkspaceRoleGate
      permission="reports.view"
      title="Reports access restricted"
      description="Reports are available to owners, admins, and managers."
    >
      <WorkspacePlaceholderPage
        title="Reports"
        description="Review workspace performance, velocity, and delivery insights."
      />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceReports);
