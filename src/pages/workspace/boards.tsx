import React from "react";
import PageSeo from "../../component/seo/page-seo";
import { getProjectBoardPath } from "../../data/workspace-project-detail";
import ProjectTeamAvatars from "../../component/workspace/projects/project-team-avatars";
import WorkspaceNavLink from "../../component/workspace/common/workspace-nav-link";
import QueryPageGuard from "../../component/common/query-page-guard";
import { BoardsPageSkeleton } from "../../component/skeletons";
import { useAppContext } from "../../context/app-context";
import { useBoards } from "../../hooks/use-workspace-tasks";
import { Paragraph, Text, Title } from "../../component/ui/typography";

function WorkspaceBoards() {
  const app = useAppContext();
  const isMember = app?.user?.role === "member";
  const boardsQuery = useBoards();
  const { data: boardSummaries = [] } = boardsQuery;

  const description = isMember
    ? "Open the Kanban board for each project you are on. Tap a task to update its status from the detail view."
    : "Each board belongs to a project. Open a project board to manage tasks by status — the same tasks you see in the Tasks table.";

  const emptyMessage = isMember
    ? "No project boards yet. Once you are added to a project, its board will appear here."
    : "No project boards yet. Create a project and add tasks to see boards here.";

  return (
    <QueryPageGuard
      query={boardsQuery}
      loading={<BoardsPageSkeleton />}
      errorTitle="Unable to load boards"
    >
      <div className="mx-auto max-w-8xl">
        <PageSeo title="Boards" description="Manage project tasks on Kanban boards." noIndex />
        <div className="mb-6">
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Boards
          </Title>
          <Paragraph size="sm" className="mt-1 max-w-2xl text-muted">
            {description}
          </Paragraph>
        </div>

        {boardSummaries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Paragraph size="sm" className="text-muted">
              {emptyMessage}
            </Paragraph>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {boardSummaries.map((board) => (
              <WorkspaceNavLink
                key={board.projectId}
                to={getProjectBoardPath(board.projectId)}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="p" size="xs" weight="bold" color="primary" className="tracking-[0.14em] uppercase">Project Board</Text>
                    <Title level={5} color="default" className="mt-2">{board.projectName}</Title>
                    <Paragraph size="sm" className="mt-1">{board.title}</Paragraph>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
                  <ProjectTeamAvatars
                    members={board.members.map((member) => ({
                      id: member.id,
                      name: member.name,
                      avatarColor: member.avatarColor,
                    }))}
                    maxVisible={4}
                  />
                  <div className="text-right">
                    <Text as="p" size="sm" weight="semibold">{board.taskCount} tasks</Text>
                    <Paragraph size="sm">{board.inProgressCount} in progress</Paragraph>
                  </div>
                </div>
              </WorkspaceNavLink>
            ))}
          </div>
        )}
      </div>
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceBoards);
