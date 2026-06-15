import React from "react";
import { WORKSPACE_PROFILE_TABS, type WorkspaceProfileTab } from "../../../data/workspace-profile";
import type { RegisterAs } from "../../../types/auth.types";
import { cn } from "../../../lib/utils";

type WorkspaceProfileTabsProps = {
  activeTab: WorkspaceProfileTab;
  role: RegisterAs;
  onChange: (tab: WorkspaceProfileTab) => void;
};

function WorkspaceProfileTabs({ activeTab, role, onChange }: WorkspaceProfileTabsProps) {
  const visibleTabs = WORKSPACE_PROFILE_TABS.filter((tab) => tab.roles.includes(role));

  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
      {visibleTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
            activeTab === tab.key
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:border-border hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default React.memo(WorkspaceProfileTabs);
