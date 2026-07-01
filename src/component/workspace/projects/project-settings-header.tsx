import React from "react";
import type { ApiWorkspaceProject } from "../../../types/project.types";
import { getProjectTheme } from "../../../data/project-themes";
import { PROJECT_STATUS_CONFIG } from "../../../data/workspace-projects";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import WorkspaceBackLink from "../common/workspace-back-link";
import ProjectWorkspaceTabs from "./project-workspace-tabs";
import { Paragraph, Title } from "../../ui/typography";

type ProjectSettingsHeaderProps = {
  project: ApiWorkspaceProject;
};

function ProjectSettingsHeader({ project }: ProjectSettingsHeaderProps) {
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const theme = getProjectTheme(project.theme);

  return (
    <div className="mb-6">
      <WorkspaceBackLink
        fallbackPath={WORKSPACE_ROUTES.PROJECTS}
        fallbackLabel="Projects"
        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
      />

      <div
        className={cn(
          "mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm",
          theme.cardBorder,
        )}
      >
        <div className={cn("h-2 bg-linear-to-r", theme.headerFrom, theme.headerTo)} />

        <div className="px-5 py-5 lg:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Project ID: {project.key}</span>
            <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", statusConfig.badgeClass)}>
              {statusConfig.label}
            </span>
            <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold", theme.pillBg)}>
              Your {theme.label.toLowerCase()} theme
            </span>
          </div>

          <Title level={2} className="mt-3 text-2xl text-foreground lg:text-3xl">
            {project.title} · Theme
          </Title>

          <Paragraph size="sm" className="mt-2 max-w-3xl text-muted">
            Personalize how this project looks for you. Theme changes are saved to your account only.
          </Paragraph>
        </div>
      </div>

      <ProjectWorkspaceTabs projectId={project.id} active="theme" />
    </div>
  );
}

export default React.memo(ProjectSettingsHeader);
