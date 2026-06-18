import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProjectActivityFeed from "../../component/workspace/projects/project-activity-feed";
import ProjectAttachmentsCard from "../../component/workspace/projects/project-attachments-card";
import ProjectDetailHeader from "../../component/workspace/projects/project-detail-header";
import ProjectDiscussionCard from "../../component/workspace/projects/project-discussion-card";
import ProjectPhaseProgressCard from "../../component/workspace/projects/project-phase-progress-card";
import ProjectTeamCard from "../../component/workspace/projects/project-team-card";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useProject } from "../../hooks/use-workspace-projects";
import { useTasks } from "../../hooks/use-workspace-tasks";
import { useAppContext } from "../../context/app-context";
import type { WorkspaceProjectDetail } from "../../data/workspace-project-detail";
import type { ApiWorkspaceProject } from "../../types/project.types";
import { mapApiProjectToWorkspaceProject } from "../../types/project.types";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import {
  computeRemainingDays,
  formatProjectEstimatedHours,
  mapProjectTasksToActivities,
  mapProjectTasksToAttachments,
  resolveProjectPhaseLabel,
} from "../../lib/project-detail-utils";

function mapProjectToDetail(
  apiProject: ApiWorkspaceProject,
  projectTasks: import("../../types/task.types").ApiWorkspaceTask[],
): WorkspaceProjectDetail {
  const project = mapApiProjectToWorkspaceProject(apiProject);

  return {
    ...project,
    projectCode: apiProject.key,
    phaseLabel: resolveProjectPhaseLabel(project.status),
    tasksCompleted: apiProject.completedTaskCount,
    tasksTotal: project.taskCount,
    timeSpent: formatProjectEstimatedHours(apiProject.totalEstimatedHours),
    remainingDays: computeRemainingDays(apiProject.dueDate),
    teamMembers: apiProject.members.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.projectRole ?? "member",
      avatarColor: member.avatarColor,
    })),
    activities: mapProjectTasksToActivities(projectTasks),
    attachments: mapProjectTasksToAttachments(projectTasks),
    discussion: [],
  };
}

function WorkspaceProjectDetail() {
  const { projectId = "" } = useParams();
  const app = useAppContext();
  const projectQuery = useProject(projectId);
  const tasksQuery = useTasks();
  const { data: apiProject } = projectQuery;

  const projectTasks = useMemo(
    () => (tasksQuery.data ?? []).filter((task) => task.projectId === projectId),
    [projectId, tasksQuery.data],
  );

  const project = useMemo(
    () => (apiProject ? mapProjectToDetail(apiProject, projectTasks) : null),
    [apiProject, projectTasks],
  );

  return (
    <QueryPageGuard
      query={projectQuery}
      loading={<AdminListPageSkeleton tableColumns={3} />}
      errorTitle="Unable to load project"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!project ? (
        <WorkspaceNotFound
          title="Project not found"
          description="This project does not exist or you do not have access to it."
        />
      ) : (
        <div className="mx-auto max-w-8xl">
          <ProjectDetailHeader
            project={project}
            canDelete={apiProject!.viewerRole === "admin" || apiProject!.createdById === app?.user?.id}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <ProjectPhaseProgressCard project={project} />
              <ProjectActivityFeed items={project.activities} />
            </div>

            <div className="space-y-6">
              <ProjectTeamCard members={project.teamMembers} />
              <ProjectAttachmentsCard items={project.attachments} />
              <ProjectDiscussionCard messages={project.discussion} />
            </div>
          </div>
        </div>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjectDetail);
