import type { RegisterAs } from "../types/auth.types";
import type { WorkspaceSettingsSectionId } from "../data/workspace-settings";

export type WorkspacePermission =
  | "billing.view"
  | "settings.view"
  | "settings.general"
  | "settings.members"
  | "settings.billing"
  | "settings.integrations"
  | "settings.notifications"
  | "settings.security"
  | "team.view"
  | "team.invite"
  | "team.change_role"
  | "project.create"
  | "project.edit"
  | "project.delete"
  | "task.create"
  | "task.edit"
  | "task.delete_any"
  | "reports.view";

type WorkspaceRole = Extract<RegisterAs, "owner" | "admin" | "manager" | "member">;

const ROLE_PERMISSIONS: Record<WorkspaceRole, readonly WorkspacePermission[]> = {
  owner: [
    "billing.view",
    "settings.view",
    "settings.general",
    "settings.members",
    "settings.billing",
    "settings.integrations",
    "settings.notifications",
    "settings.security",
    "team.view",
    "team.invite",
    "team.change_role",
    "project.create",
    "project.edit",
    "project.delete",
    "task.create",
    "task.edit",
    "task.delete_any",
    "reports.view",
  ],
  admin: [
    "billing.view",
    "settings.view",
    "settings.general",
    "settings.members",
    "settings.billing",
    "settings.integrations",
    "settings.notifications",
    "settings.security",
    "team.view",
    "team.invite",
    "team.change_role",
    "project.create",
    "project.edit",
    "project.delete",
    "task.create",
    "task.edit",
    "task.delete_any",
    "reports.view",
  ],
  manager: [
    "team.view",
    "project.create",
    "project.edit",
    "task.create",
    "task.edit",
    "task.delete_any",
    "reports.view",
  ],
  member: ["task.create", "task.edit"],
};

export const SETTINGS_SECTION_PERMISSIONS: Record<WorkspaceSettingsSectionId, WorkspacePermission> = {
  general: "settings.general",
  members: "settings.members",
  billing: "settings.billing",
  integrations: "settings.integrations",
  notifications: "settings.notifications",
  security: "settings.security",
};

export function isWorkspaceRole(role: RegisterAs): role is WorkspaceRole {
  return role === "owner" || role === "admin" || role === "manager" || role === "member";
}

export function hasWorkspacePermission(role: RegisterAs | undefined, permission: WorkspacePermission) {
  if (!role || !isWorkspaceRole(role)) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getWorkspacePermissions(role: RegisterAs | undefined) {
  if (!role || !isWorkspaceRole(role)) return [] as WorkspacePermission[];
  return ROLE_PERMISSIONS[role];
}

export function canAccessSettingsSection(role: RegisterAs | undefined, sectionId: WorkspaceSettingsSectionId) {
  if (!hasWorkspacePermission(role, "settings.view")) return false;
  return hasWorkspacePermission(role, SETTINGS_SECTION_PERMISSIONS[sectionId]);
}
