import { CalendarOutlined, CommentOutlined, CheckCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import { getProjectDetailPath } from "../../../data/workspace-project-detail";
import {
  PROJECT_ICON_MAP,
  PROJECT_STATUS_CONFIG,
  type WorkspaceProject,
} from "../../../data/workspace-projects";
import { formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import ProjectTeamAvatars from "./project-team-avatars";

type ProjectCardProps = {
  project: WorkspaceProject;
  viewMode?: "grid" | "list";
};

function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  const Icon = PROJECT_ICON_MAP[project.icon];
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <Link
      to={getProjectDetailPath(project.id)}
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        viewMode === "list" && "lg:flex-row lg:items-center lg:gap-6",
      )}
    >
      <div className={cn("min-w-0 flex-1", viewMode === "list" && "lg:flex lg:items-start lg:gap-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", project.iconBg, project.iconColor)}>
            <Icon className="text-lg" />
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
              statusConfig.badgeClass,
            )}
          >
            {statusConfig.label}
          </span>
        </div>

        <div className={cn("mt-4", viewMode === "list" && "lg:mt-0 lg:flex-1")}>
          <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
        </div>

        <div className={cn("mt-5", viewMode === "list" && "lg:mt-3 lg:max-w-md")}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-muted">Progress</span>
            <span className="font-bold text-foreground">{project.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn("h-full rounded-full transition-all duration-500", statusConfig.progressClass)}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <ProjectTeamAvatars members={project.members} />
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <CalendarOutlined className="text-xs" />
            {formatDate(project.dueDate)}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "mt-5 flex items-center gap-5 border-t border-border pt-4 text-sm text-muted",
          viewMode === "list" && "lg:mt-0 lg:w-48 lg:flex-col lg:items-start lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <CheckCircleOutlined />
          {project.taskCount} Tasks
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CommentOutlined />
          {project.commentCount}
        </span>
      </div>
    </Link>
  );
}

export default React.memo(ProjectCard);
