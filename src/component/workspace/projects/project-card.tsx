import { CalendarOutlined, CheckCircleOutlined, CommentOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React from "react";
import { getProjectDetailPath } from "../../../data/workspace-project-detail";
import {
  PROJECT_ICON_MAP,
  PROJECT_STATUS_CONFIG,
  type WorkspaceProject,
} from "../../../data/workspace-projects";
import { formatDate } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import WorkspaceNavLink from "../common/workspace-nav-link";
import ProjectTeamAvatars from "./project-team-avatars";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProjectCardProps = {
  project: WorkspaceProject;
  viewMode?: "grid" | "list";
  selectable?: boolean;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
};

function ProjectProgress({
  progress,
  progressClass,
  compact = false,
}: {
  progress: number;
  progressClass: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("w-full", compact && "min-w-0")}>
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <Text as="span" size="sm" weight="medium" color="muted">Progress</Text>
        <Text as="span" size="sm" weight="bold" className="shrink-0 tabular-nums">{progress}%</Text>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", progressClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ProjectStats({ taskCount, commentCount, className }: { taskCount: number; commentCount: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm text-muted", className)}>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <CheckCircleOutlined />
        {taskCount} Tasks
      </span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <CommentOutlined />
        {commentCount}
      </span>
    </div>
  );
}

type ProjectCardShellProps = {
  project: WorkspaceProject;
  selectable: boolean;
  selected: boolean;
  onSelectedChange?: (selected: boolean) => void;
  viewMode: "grid" | "list";
  children: React.ReactNode;
};

function ProjectCardShell({ project, selectable, selected, onSelectedChange, viewMode, children }: ProjectCardShellProps) {
  const contentPadding =
    viewMode === "grid" ? (selectable ? "p-5 pt-5 pl-12" : "p-5") : selectable ? "p-4 pt-4 pl-12 sm:p-5 sm:pt-5 sm:pl-12" : "p-4 sm:p-5";

  return (
    <article
      className={cn(
        "relative rounded-2xl border bg-card shadow-sm transition-all",
        selected ? "border-primary bg-feature-sync/40 ring-2 ring-primary/15" : "border-border hover:shadow-md",
      )}
    >
      {selectable ? (
        <div
          className={cn(
            "absolute top-4 left-4 z-10",
            viewMode === "list" && "lg:top-1/2 lg:-translate-y-1/2",
          )}
        >
          <Checkbox
            checked={selected}
            aria-label={`Select ${project.title}`}
            className="rounded-md bg-card/95 p-0.5 shadow-sm"
            onChange={(event) => onSelectedChange?.(event.target.checked)}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}

      <WorkspaceNavLink to={getProjectDetailPath(project.id)} className={cn("block text-inherit no-underline", contentPadding)}>
        {children}
      </WorkspaceNavLink>
    </article>
  );
}

function ProjectCardGrid({
  project,
  selectable,
  selected,
  onSelectedChange,
}: {
  project: WorkspaceProject;
  selectable: boolean;
  selected: boolean;
  onSelectedChange?: (selected: boolean) => void;
}) {
  const Icon = PROJECT_ICON_MAP[project.icon];
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <ProjectCardShell project={project} selectable={selectable} selected={selected} onSelectedChange={onSelectedChange} viewMode="grid">
      <div className="flex flex-col">
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

        <div className="mt-4 min-w-0">
          <Title level={5} color="default">{project.title}</Title>
          <Paragraph size="sm" className="mt-2 line-clamp-2 leading-relaxed">{project.description}</Paragraph>
        </div>

        <div className="mt-5">
          <ProjectProgress progress={project.progress} progressClass={statusConfig.progressClass} />
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <ProjectTeamAvatars members={project.members} />
          <Text as="span" size="sm" color="muted" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <CalendarOutlined className="text-xs" />
            {formatDate(project.dueDate)}
          </Text>
        </div>

        <div className="mt-5 flex items-center gap-5 border-t border-border pt-4">
          <ProjectStats taskCount={project.taskCount} commentCount={project.commentCount} className="flex-row gap-5" />
        </div>
      </div>
    </ProjectCardShell>
  );
}

function ProjectCardList({
  project,
  selectable,
  selected,
  onSelectedChange,
}: {
  project: WorkspaceProject;
  selectable: boolean;
  selected: boolean;
  onSelectedChange?: (selected: boolean) => void;
}) {
  const Icon = PROJECT_ICON_MAP[project.icon];
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <ProjectCardShell project={project} selectable={selectable} selected={selected} onSelectedChange={onSelectedChange} viewMode="list">
      <div className="lg:grid lg:grid-cols-[minmax(0,1.8fr)_148px_104px_132px_108px] lg:items-center lg:gap-x-5 xl:gap-x-6">
        <div className="flex min-w-0 items-start gap-4">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", project.iconBg, project.iconColor)}>
            <Icon className="text-lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Title level={5} color="default" className="truncate text-base! lg:text-lg!">{project.title}</Title>
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
                  statusConfig.badgeClass,
                )}
              >
                {statusConfig.label}
              </span>
            </div>
            <Paragraph size="sm" className="mt-1 line-clamp-1">{project.description}</Paragraph>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
          <ProjectProgress progress={project.progress} progressClass={statusConfig.progressClass} compact />
        </div>

        <div className="mt-4 flex items-center border-t border-border pt-4 lg:mt-0 lg:h-8 lg:border-t-0 lg:pt-0">
          <ProjectTeamAvatars members={project.members} className="min-w-[88px]" />
        </div>

        <div className="mt-4 flex items-center border-t border-border pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
          <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap text-muted">
            <CalendarOutlined className="shrink-0 text-xs" />
            {formatDate(project.dueDate)}
          </span>
        </div>

        <div className="mt-4 flex items-center border-t border-border pt-4 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
          <ProjectStats taskCount={project.taskCount} commentCount={project.commentCount} />
        </div>
      </div>
    </ProjectCardShell>
  );
}

function ProjectCard({
  project,
  viewMode = "grid",
  selectable = false,
  selected = false,
  onSelectedChange,
}: ProjectCardProps) {
  if (viewMode === "list") {
    return (
      <ProjectCardList
        project={project}
        selectable={selectable}
        selected={selected}
        onSelectedChange={onSelectedChange}
      />
    );
  }

  return (
    <ProjectCardGrid
      project={project}
      selectable={selectable}
      selected={selected}
      onSelectedChange={onSelectedChange}
    />
  );
}

export default React.memo(ProjectCard);
