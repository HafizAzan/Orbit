import { FilterOutlined, PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import type { WorkspaceKanbanBoard } from "../../../data/workspace-board";
import { getProjectDetailPath } from "../../../data/workspace-project-detail";
import ProjectTeamAvatars from "../projects/project-team-avatars";
import ProjectWorkspaceTabs from "../projects/project-workspace-tabs";
import { Title } from "../../ui/typography";

type KanbanBoardHeaderProps = {
  board: WorkspaceKanbanBoard;
};

function KanbanBoardHeader({ board }: KanbanBoardHeaderProps) {
  return (
    <div className="mb-6">
      <nav className="text-sm text-muted">
        <Link to="/projects" className="font-medium transition-colors hover:text-primary">
          Projects
        </Link>
        <span className="mx-2 text-slate-300">›</span>
        <Link to={getProjectDetailPath(board.projectId)} className="font-medium transition-colors hover:text-primary">
          {board.projectName}
        </Link>
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

        <div className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <Button icon={<FilterOutlined />} size="large" className="w-full font-semibold! sm:w-auto">
            Filters
          </Button>
          <Button icon={<ShareAltOutlined />} size="large" className="w-full font-semibold! sm:w-auto">
            Share
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full font-semibold! sm:w-auto">
            Create Task
          </Button>
        </div>
      </div>

      <ProjectWorkspaceTabs projectId={board.projectId} active="board" />
    </div>
  );
}

export default React.memo(KanbanBoardHeader);
