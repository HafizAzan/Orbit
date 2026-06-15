import { AppstoreOutlined, EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import type { WorkspaceProjectDetail } from "../../../data/workspace-project-detail";
import { getProjectBoardPath } from "../../../data/workspace-project-detail";
import { PROJECT_STATUS_CONFIG } from "../../../data/workspace-projects";
import { cn } from "../../../lib/utils";
import ProjectWorkspaceTabs from "./project-workspace-tabs";
import { Paragraph, Title } from "../../ui/typography";

type ProjectDetailHeaderProps = {
  project: WorkspaceProjectDetail;
};

function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <div className="mb-6">
      <Link to="/projects" className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
        ← Back to Projects
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-[0.18em] text-muted uppercase">
              Project ID: {project.projectCode}
            </span>
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
                statusConfig.badgeClass,
              )}
            >
              {statusConfig.label}
            </span>
          </div>

          <Title level={2} className="mt-3 text-2xl text-foreground lg:text-3xl">
            {project.title}
          </Title>
          <Paragraph size="sm" className="mt-2 max-w-3xl text-muted">
            {project.description}
          </Paragraph>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to={getProjectBoardPath(project.id)}>
            <Button icon={<AppstoreOutlined />} size="large" className="font-semibold!">
              Open Board
            </Button>
          </Link>
          <Button icon={<ShareAltOutlined />} size="large" className="font-semibold!">
            Share
          </Button>
          <Button type="primary" icon={<EditOutlined />} size="large" className="font-semibold!">
            Edit Project
          </Button>
        </div>
      </div>

      <ProjectWorkspaceTabs projectId={project.id} active="overview" />
    </div>
  );
}

export default React.memo(ProjectDetailHeader);
