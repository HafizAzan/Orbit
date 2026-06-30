import React from "react";
import {
  WORKSPACE_SETTINGS_NAV_ITEMS,
  type WorkspaceSettingsSectionId,
} from "../../../data/workspace-settings";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { cn } from "../../../lib/utils";
import { Text } from "../../ui/typography";

type WorkspaceSettingsNavProps = {
  activeSection: WorkspaceSettingsSectionId;
  onNavigate: (sectionId: WorkspaceSettingsSectionId) => void;
};

function WorkspaceSettingsNav({ activeSection, onNavigate }: WorkspaceSettingsNavProps) {
  const { canAccessSettingsTab } = useWorkspacePermissions();
  const visibleItems = WORKSPACE_SETTINGS_NAV_ITEMS.filter((item) => canAccessSettingsTab(item.id));
  return (
    <nav className="rounded-2xl border border-border bg-card p-3 shadow-sm lg:sticky lg:top-28">
      <Text as="p" size="xs" weight="semibold" color="muted" className="mb-3 px-3 text-[10px]! tracking-[0.2em] uppercase">Settings</Text>
      <ul className="space-y-1">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-feature-sync text-primary"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default React.memo(WorkspaceSettingsNav);
