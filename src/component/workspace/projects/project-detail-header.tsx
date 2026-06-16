import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { WorkspaceProjectDetail } from "../../../data/workspace-project-detail";
import { getProjectEditPath } from "../../../data/workspace-project-form";
import { PROJECT_STATUS_CONFIG } from "../../../data/workspace-projects";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { useWorkspaceReturnTo } from "../../../lib/workspace-navigation";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import WorkspaceBackLink from "../common/workspace-back-link";
import WorkspaceNavLink from "../common/workspace-nav-link";
import DeleteProjectButton from "./delete-project-button";
import ProjectWorkspaceTabs from "./project-workspace-tabs";
import { Paragraph, Title } from "../../ui/typography";

type ProjectDetailHeaderProps = {
  project: WorkspaceProjectDetail;
};

function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const navigate = useNavigate();

  const { returnPath } = useWorkspaceReturnTo(WORKSPACE_ROUTES.PROJECTS, "Projects");

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  const handleDeleteProject = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success(`"${project.title}" deleted successfully`);

    navigate(returnPath);
  }, [navigate, project.title, returnPath]);

  return (
    <div className="mb-6">
      <WorkspaceBackLink
        fallbackPath={WORKSPACE_ROUTES.PROJECTS}
        fallbackLabel="Projects"
        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
      />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Project ID: {project.projectCode}</span>

            <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", statusConfig.badgeClass)}>
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
          <WorkspaceNavLink to={getProjectEditPath(project.id)} preserveReturn>
            <Button type="primary" icon={<EditOutlined />} size="large" className="font-semibold!">
              Edit Project
            </Button>
          </WorkspaceNavLink>

          <DeleteProjectButton projectName={project.title} onDelete={handleDeleteProject} className="font-semibold!" />
        </div>
      </div>

      <ProjectWorkspaceTabs projectId={project.id} active="overview" />
    </div>
  );
}

export default React.memo(ProjectDetailHeader);
