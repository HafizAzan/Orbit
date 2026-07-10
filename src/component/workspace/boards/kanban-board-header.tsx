import { PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { WorkspaceKanbanBoard } from "../../../data/workspace-board";
import { getProjectBoardPath, getProjectDetailPath } from "../../../data/workspace-project-detail";
import { getTaskCreatePath } from "../../../data/workspace-task-form";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { useWorkspaceReturnTo } from "../../../lib/workspace-navigation";
import { getWorkspaceHomePath } from "../../../lib/workspace-routing";
import WorkspaceBackLink from "../common/workspace-back-link";
import WorkspaceNavLink from "../common/workspace-nav-link";
import ProjectTeamAvatars from "../projects/project-team-avatars";
import ProjectWorkspaceTabs from "../projects/project-workspace-tabs";
import WorkBreakdownModal from "../projects/work-breakdown-modal";
import { Title } from "../../ui/typography";

type KanbanBoardHeaderProps = {
  board: WorkspaceKanbanBoard;
};

function KanbanBoardHeader({ board }: KanbanBoardHeaderProps) {
  const { can, role } = useWorkspacePermissions();
  const canCreateTask = can("task.create");
  const canWorkBreakdown = canCreateTask && (role === "admin" || role === "manager");
  const [workBreakdownOpen, setWorkBreakdownOpen] = useState(false);
  const memberHomePath = getWorkspaceHomePath(role);
  const { returnPath, returnLabel } = useWorkspaceReturnTo(memberHomePath, role === "member" ? "My Tasks" : "Projects");
  const projectLink = role === "member" ? getProjectBoardPath(board.projectId) : getProjectDetailPath(board.projectId);

  return (
    <div className="mb-6">
      <WorkspaceBackLink
        fallbackPath={memberHomePath}
        fallbackLabel={role === "member" ? "My Tasks" : "Projects"}
        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
      />

      <nav className="mt-4 text-sm text-muted">
        <Link to={returnPath} className="font-medium transition-colors hover:text-primary">
          {returnLabel}
        </Link>
        <span className="mx-2 text-slate-300">›</span>
        <WorkspaceNavLink to={projectLink} preserveReturn className="font-medium transition-colors hover:text-primary">
          {board.projectName}
        </WorkspaceNavLink>
        <span className="mx-2 text-slate-300">›</span>
        <span>Board</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <Title level={2} className="text-xl text-foreground sm:text-2xl lg:text-3xl">
            {board.title}
          </Title>
          <ProjectTeamAvatars members={board.teamMembers} maxVisible={3} />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {canWorkBreakdown ? (
            <Button
              icon={<ThunderboltOutlined />}
              size="large"
              className="w-full font-semibold! sm:w-auto"
              onClick={() => setWorkBreakdownOpen(true)}
            >
              AI Breakdown
            </Button>
          ) : null}
          {canCreateTask ? (
            <WorkspaceNavLink to={getTaskCreatePath(board.projectId)} preserveReturn>
              <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full font-semibold! sm:w-auto">
                Create Task
              </Button>
            </WorkspaceNavLink>
          ) : null}
        </div>
      </div>

      <ProjectWorkspaceTabs projectId={board.projectId} active="board" />

      <WorkBreakdownModal
        open={workBreakdownOpen}
        projectId={board.projectId}
        projectName={board.projectName}
        onClose={() => setWorkBreakdownOpen(false)}
      />
    </div>
  );
}

export default React.memo(KanbanBoardHeader);
