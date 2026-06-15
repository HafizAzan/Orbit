import React from "react";
import { Link } from "react-router-dom";
import { getProjectBoardPath, getProjectDetailPath } from "../../../data/workspace-project-detail";
import { cn } from "../../../lib/utils";

type ProjectWorkspaceTab = "overview" | "board";

type ProjectWorkspaceTabsProps = {
  projectId: string;
  active: ProjectWorkspaceTab;
};

const TABS: { key: ProjectWorkspaceTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "board", label: "Board" },
];

function ProjectWorkspaceTabs({ projectId, active }: ProjectWorkspaceTabsProps) {
  return (
    <nav className="mt-6 flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        const href = tab.key === "overview" ? getProjectDetailPath(projectId) : getProjectBoardPath(projectId);

        return (
          <Link
            key={tab.key}
            to={href}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              active === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:border-border hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default React.memo(ProjectWorkspaceTabs);
