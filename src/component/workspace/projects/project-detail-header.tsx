import React, { useCallback } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { WorkspaceProjectDetail } from "../../../data/workspace-project-detail";
import { getProjectEditPath } from "../../../data/workspace-project-form";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { useDeleteProject } from "../../../hooks/use-workspace-projects";
import { PROJECT_STATUS_CONFIG } from "../../../data/workspace-projects";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { cn } from "../../../lib/utils";import { useWorkspaceReturnTo } from "../../../lib/workspace-navigation";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import WorkspaceBackLink from "../common/workspace-back-link";
import WorkspaceNavLink from "../common/workspace-nav-link";
import DeleteProjectButton from "./delete-project-button";
import ProjectWorkspaceTabs from "./project-workspace-tabs";
import { Paragraph, Title } from "../../ui/typography";

type ProjectDetailHeaderProps = {
  project: WorkspaceProjectDetail;
  canDelete?: boolean;
};

function ProjectDetailHeader({ project, canDelete = false }: ProjectDetailHeaderProps) {
  const navigate = useNavigate();
  const { can } = useWorkspacePermissions();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const canEditProject = can("project.edit");
  const canDeleteProject = can("project.delete") || canDelete;
  const { returnPath } = useWorkspaceReturnTo(WORKSPACE_ROUTES.PROJECTS, "Projects");

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  const handleDeleteProject = useCallback(async () => {
    try {
      const result = await deleteProject(project.id);
      showApiSuccessToast(result.message);
      navigate(returnPath);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [deleteProject, navigate, project.id, returnPath]);
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
          {canEditProject ? (
            <WorkspaceNavLink to={getProjectEditPath(project.id)} preserveReturn>
              <Button type="primary" icon={<EditOutlined />} size="large" className="font-semibold!">
                Edit Project
              </Button>
            </WorkspaceNavLink>
          ) : null}

          {canDeleteProject ? (
            <DeleteProjectButton projectName={project.title} onDelete={handleDeleteProject} className="font-semibold!" />
          ) : null}
        </div>
      </div>

      <ProjectWorkspaceTabs projectId={project.id} active="overview" />
    </div>
  );
}

export default React.memo(ProjectDetailHeader);
