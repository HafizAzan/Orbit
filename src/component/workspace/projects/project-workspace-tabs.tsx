import React from "react";
import { getProjectBoardPath, getProjectDetailPath } from "../../../data/workspace-project-detail";
import { cn } from "../../../lib/utils";
import WorkspaceNavLink from "../common/workspace-nav-link";

type ProjectWorkspaceTab = "overview" | "board";

type ProjectWorkspaceTabsProps = {
  projectId: string;
  active: ProjectWorkspaceTab;
};

const TABS: { key: ProjectWorkspaceTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "board", label: "Board" },
];

function resolveTabHref(projectId: string, tab: ProjectWorkspaceTab) {
  if (tab === "overview") return getProjectDetailPath(projectId);
  return getProjectBoardPath(projectId);
}

function ProjectWorkspaceTabs({ projectId, active }: ProjectWorkspaceTabsProps) {
  return (
    <nav className="mt-6 flex gap-1 border-b border-border">
      {TABS.map((tab) => (
        <WorkspaceNavLink
          key={tab.key}
          to={resolveTabHref(projectId, tab.key)}
          preserveReturn
          className={cn(
            "border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
            active === tab.key
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:border-border hover:text-foreground",
          )}
        >
          {tab.label}
        </WorkspaceNavLink>
      ))}
    </nav>
  );
}

export default React.memo(ProjectWorkspaceTabs);
