import React from "react";
import { Navigate, useParams } from "react-router-dom";
import ProjectActivityFeed from "../../component/workspace/projects/project-activity-feed";
import ProjectAttachmentsCard from "../../component/workspace/projects/project-attachments-card";
import ProjectDetailHeader from "../../component/workspace/projects/project-detail-header";
import ProjectDiscussionCard from "../../component/workspace/projects/project-discussion-card";
import ProjectNetworkPulseCard from "../../component/workspace/projects/project-network-pulse-card";
import ProjectPhaseProgressCard from "../../component/workspace/projects/project-phase-progress-card";
import ProjectTeamCard from "../../component/workspace/projects/project-team-card";
import { getWorkspaceProjectDetail } from "../../data/workspace-project-detail";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";

function WorkspaceProjectDetail() {
  const { projectId = "" } = useParams();
  const project = getWorkspaceProjectDetail(projectId);

  if (!project) {
    return <Navigate to={WORKSPACE_ROUTES.PROJECTS} replace />;
  }

  return (
    <div className="mx-auto max-w-8xl">
      <ProjectDetailHeader project={project} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ProjectPhaseProgressCard project={project} />
          <ProjectActivityFeed items={project.activities} />
          <ProjectNetworkPulseCard />
        </div>

        <div className="space-y-6">
          <ProjectTeamCard members={project.teamMembers} />
          <ProjectAttachmentsCard items={project.attachments} />
          <ProjectDiscussionCard messages={project.discussion} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(WorkspaceProjectDetail);
