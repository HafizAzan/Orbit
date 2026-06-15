import React from "react";
import WorkspacePlaceholderPage from "../../component/workspace/workspace-placeholder-page";

function WorkspaceCalendar() {
  return (
    <WorkspacePlaceholderPage
      title="Calendar"
      description="Track deadlines, meetings, and project milestones."
    />
  );
}

export default React.memo(WorkspaceCalendar);
