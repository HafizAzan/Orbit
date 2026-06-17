import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProjectActivityFeed from "../../component/workspace/projects/project-activity-feed";
import ProjectAttachmentsCard from "../../component/workspace/projects/project-attachments-card";
import ProjectDetailHeader from "../../component/workspace/projects/project-detail-header";
import ProjectDiscussionCard from "../../component/workspace/projects/project-discussion-card";
import ProjectNetworkPulseCard from "../../component/workspace/projects/project-network-pulse-card";
import ProjectPhaseProgressCard from "../../component/workspace/projects/project-phase-progress-card";
import ProjectTeamCard from "../../component/workspace/projects/project-team-card";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useProject } from "../../hooks/use-workspace-projects";
import { useAppContext } from "../../context/app-context";
import type { WorkspaceProjectDetail } from "../../data/workspace-project-detail";
import type { ApiWorkspaceProject } from "../../types/project.types";
import { mapApiProjectToWorkspaceProject } from "../../types/project.types";

function mapProjectToDetail(apiProject: ApiWorkspaceProject): WorkspaceProjectDetail {
  const project = mapApiProjectToWorkspaceProject(apiProject);

  return {
    ...project,
    projectCode: apiProject.key,
    phaseLabel: project.status === "on_track" ? "Execution Phase" : "Planning Phase",
    tasksCompleted: 0,
    tasksTotal: project.taskCount,
    timeSpent: "0h",
    remainingDays: 0,
    teamMembers: apiProject.members.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.projectRole ?? "member",
      avatarColor: member.avatarColor,
    })),
    activities: [],
    attachments: [],
    discussion: [],
  };
}

function WorkspaceProjectDetail() {
  const { projectId = "" } = useParams();
  const app = useAppContext();
  const { data: apiProject, isLoading, isError } = useProject(projectId);

  const project = useMemo(
    () => (apiProject ? mapProjectToDetail(apiProject) : null),
    [apiProject],
  );

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={3} />;
  }

  if (isError || !project) {
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
    <div className="mx-auto max-w-8xl">
      <ProjectDetailHeader
        project={project}
        canDelete={apiProject!.viewerRole === "admin" || apiProject!.createdById === app?.user?.id}
      />

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
