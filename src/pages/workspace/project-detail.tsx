import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import MemberProjectDetailHeader from "../../component/workspace/projects/member-project-detail-header";
import ProjectActivityFeed from "../../component/workspace/projects/project-activity-feed";
import ProjectAiHealthCard from "../../component/workspace/projects/project-ai-health-card";
import ProjectAttachmentsCard from "../../component/workspace/projects/project-attachments-card";
import ProjectDetailHeader from "../../component/workspace/projects/project-detail-header";
import ProjectDiscussionCard from "../../component/workspace/projects/project-discussion-card";
import ProjectNetworkPulseCard from "../../component/workspace/projects/project-network-pulse-card";
import ProjectPhaseProgressCard from "../../component/workspace/projects/project-phase-progress-card";
import ProjectTasksCard from "../../component/workspace/projects/project-tasks-card";
import ProjectTeamCard from "../../component/workspace/projects/project-team-card";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { ProjectDetailSkeleton } from "../../component/skeletons";
import { useProject } from "../../hooks/use-workspace-projects";
import {
  useCreateProjectComment,
  useDeleteProjectComment,
  useProjectComments,
} from "../../hooks/use-project-comments";
import { useMyTasks, useTasks } from "../../hooks/use-workspace-tasks";
import useProjectDiscussionSocket from "../../hooks/use-project-discussion-socket";
import { useAppContext } from "../../context/app-context";
import type { WorkspaceProjectDetail } from "../../data/workspace-project-detail";
import type { ApiWorkspaceProject } from "../../types/project.types";
import { mapApiProjectToWorkspaceProject } from "../../types/project.types";
import { mapApiProjectCommentToMessage } from "../../types/project-comment.types";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { canDeleteWorkspaceProject } from "../../lib/project-access";
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
  const isMember = app?.user?.role === "member";
  const projectQuery = useProject(projectId);
  const commentsQuery = useProjectComments(projectId);
  const allTasksQuery = useTasks({ limit: 100 });
  const myTasksQuery = useMyTasks();
  const { mutateAsync: createComment, isPending: isCreatingComment } = useCreateProjectComment(projectId);
  const { mutateAsync: deleteComment } = useDeleteProjectComment(projectId);
  const { data: apiProject } = projectQuery;

  useProjectDiscussionSocket(projectId);

  const projectTasks = useMemo(() => {
    if (isMember) {
      return (myTasksQuery.data ?? []).filter((task) => task.projectId === projectId);
    }

    return (allTasksQuery.data?.data ?? []).filter((task) => task.projectId === projectId);
  }, [allTasksQuery.data, isMember, myTasksQuery.data, projectId]);

  const project = useMemo(
    () => (apiProject ? mapProjectToDetail(apiProject, projectTasks) : null),
    [apiProject, projectTasks],
  );

  const discussionMessages = useMemo(
    () => (commentsQuery.data ?? []).map(mapApiProjectCommentToMessage),
    [commentsQuery.data],
  );

  const handleSubmitComment = async (message: string) => {
    try {
      await createComment({ body: message });
      showApiSuccessToast("Comment posted.");
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      showApiSuccessToast("Comment deleted.");
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const discussionCardProps = {
    messages: discussionMessages,
    currentUserId: app?.user?.id,
    loading: commentsQuery.isLoading,
    refreshing: commentsQuery.isFetching && !commentsQuery.isLoading,
    submitting: isCreatingComment,
    onSubmit: handleSubmitComment,
    onDelete: handleDeleteComment,
    onRefresh: () => {
      void commentsQuery.refetch();
    },
    messagesClassName: "max-h-80 lg:max-h-96",
  };

  const projectCollaborationSection = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ProjectAttachmentsCard items={project?.attachments ?? []} />
      <ProjectDiscussionCard {...discussionCardProps} className="flex h-full flex-col" />
    </div>
  );

  return (
    <QueryPageGuard
      query={projectQuery}
      loading={<ProjectDetailSkeleton />}
      errorTitle="Unable to load project"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!project ? (
        <WorkspaceNotFound
          title="Project not found"
          description="This project does not exist or you do not have access to it."
        />
      ) : isMember ? (
        <div className="mx-auto max-w-8xl">
          <MemberProjectDetailHeader
            project={project}
            themeId={apiProject!.theme}
            themeMeta={apiProject!.themeMeta}
            assignedTaskCount={projectTasks.length}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <ProjectTasksCard
                projectId={projectId}
                tasks={projectTasks}
                loading={myTasksQuery.isLoading}
              />

              {projectCollaborationSection}
            </div>

            <div className="space-y-6">
              <ProjectTeamCard members={project.teamMembers} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-8xl">
          <ProjectDetailHeader
            project={project}
            themeId={apiProject!.theme}
            themeMeta={apiProject!.themeMeta}
            completedTaskCount={apiProject!.completedTaskCount}
            canDelete={
              apiProject
                ? canDeleteWorkspaceProject(
                    app?.user ? { id: app.user.id, role: app.user.role } : null,
                    apiProject,
                  )
                : false
            }
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <ProjectPhaseProgressCard project={project} />
              <ProjectAiHealthCard projectId={projectId} projectName={project.title} />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ProjectActivityFeed items={project.activities} />
                <ProjectTasksCard
                  projectId={projectId}
                  tasks={projectTasks}
                  loading={allTasksQuery.isLoading}
                />
              </div>

              {projectCollaborationSection}
            </div>

            <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <ProjectNetworkPulseCard members={project.teamMembers} tasks={projectTasks} />
              <ProjectTeamCard members={project.teamMembers} />
            </div>
          </div>
        </div>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjectDetail);
