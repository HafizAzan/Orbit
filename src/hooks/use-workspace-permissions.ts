import { useMemo } from "react";
import { useAppContext } from "../context/app-context";
import type { WorkspaceSettingsSectionId } from "../data/workspace-settings";
import { canAccessSettingsSection, getWorkspacePermissions, hasWorkspacePermission, type WorkspacePermission } from "../lib/workspace-permissions";

function useWorkspacePermissions() {
  const app = useAppContext();
  const role = app?.user?.role;

  return useMemo(
    () => ({
      role,
      permissions: getWorkspacePermissions(role),
      can: (permission: WorkspacePermission) => hasWorkspacePermission(role, permission),
      canAccessSettingsTab: (sectionId: WorkspaceSettingsSectionId) => canAccessSettingsSection(role, sectionId),
    }),
    [role],
  );
}

export default useWorkspacePermissions;
