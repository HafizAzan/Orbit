import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppstoreOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { WorkspaceProjectDetail } from "../../../data/workspace-project-detail";
import { getProjectTheme, type ProjectThemeId } from "../../../data/project-themes";
import { getProjectBoardPath } from "../../../data/workspace-project-detail";
import { PROJECT_STATUS_CONFIG } from "../../../data/workspace-projects";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import type { ApiProjectThemeMeta } from "../../../types/project.types";
import WorkspaceBackLink from "../common/workspace-back-link";
import { Paragraph, Title } from "../../ui/typography";

type MemberProjectDetailHeaderProps = {
  project: WorkspaceProjectDetail;
  themeId?: ProjectThemeId;
  themeMeta?: ApiProjectThemeMeta;
  assignedTaskCount: number;
};

function MemberProjectDetailHeader({
  project,
  themeId = "classic",
  themeMeta,
  assignedTaskCount,
}: MemberProjectDetailHeaderProps) {
  const location = useLocation();
  const theme = getProjectTheme(themeId);
  const accent = themeMeta ?? theme;
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  useEffect(() => {
    if (location.hash !== "#discussion") return;

    const target = document.getElementById("project-discussion");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <div className="mb-6">
      <WorkspaceBackLink
        fallbackPath={WORKSPACE_ROUTES.BOARDS}
        fallbackLabel="Boards"
        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
      />

      <div className={cn("mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm", accent.cardBorder)}>
        <div className={cn("h-2 bg-linear-to-r", accent.headerFrom, accent.headerTo)} />

        <div className="px-5 py-5 lg:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold tracking-[0.18em] text-muted uppercase">
                  {project.projectCode}
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
                {project.description || "You are assigned to this project. Track your tasks, join discussions, and open the board when you need the full workflow view."}
              </Paragraph>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-semibold text-primary">
                  {assignedTaskCount} assigned {assignedTaskCount === 1 ? "task" : "tasks"}
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted">
                  {project.teamMembers.length} team {project.teamMembers.length === 1 ? "member" : "members"}
                </span>
              </div>
            </div>

            <Link to={getProjectBoardPath(project.id)}>
              <Button type="primary" size="large" icon={<AppstoreOutlined />} className="font-semibold!">
                Open board
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MemberProjectDetailHeader);
