import React from "react";
import { getProjectBoardPath } from "../../data/workspace-project-detail";
import ProjectTeamAvatars from "../../component/workspace/projects/project-team-avatars";
import WorkspaceNavLink from "../../component/workspace/common/workspace-nav-link";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { AdminListPageSkeleton } from "../../component/skeletons";
import { useBoards } from "../../hooks/use-workspace-tasks";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceBoards() {
  const { data: boardSummaries = [], isLoading, isError } = useBoards();

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={2} />;
  }

  if (isError) {
    return (
      <WorkspaceNotFound
        title="Unable to load boards"
        description="We could not load your project boards. Please try again shortly."
      />
    );
  }

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Boards
        </Title>
        <Paragraph size="sm" className="mt-1 max-w-2xl text-muted">
          Each board belongs to a project. Open a project board to manage tasks by status — the same tasks you see in the Tasks table.
        </Paragraph>
      </div>

      {boardSummaries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Paragraph size="sm" className="text-muted">
            No project boards yet. Create a project and add tasks to see boards here.
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
                  <p className="text-xs font-bold tracking-[0.14em] text-primary uppercase">Project Board</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{board.projectName}</h3>
                  <p className="mt-1 text-sm text-muted">{board.title}</p>
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
                <div className="text-right text-sm">
                  <p className="font-semibold text-foreground">{board.taskCount} tasks</p>
                  <p className="text-muted">{board.inProgressCount} in progress</p>
                </div>
              </div>
            </WorkspaceNavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(WorkspaceBoards);
