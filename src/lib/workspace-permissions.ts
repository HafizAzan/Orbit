import type { RegisterAs } from "../types/auth.types";
import type { WorkspaceSettingsSectionId } from "../data/workspace-settings";

export type WorkspacePermission =
  | "billing.view"
  | "settings.view"
  | "settings.general"
  | "settings.members"
  | "settings.usage"
  | "settings.billing"
  | "settings.notifications"
  | "settings.security"
  | "settings.transfer_ownership"
  | "team.view"
  | "team.invite"
  | "team.change_role"
  | "team.remove_squad_member"
  | "dashboard.view"
  | "project.view"
  | "project.create"
  | "project.edit"
  | "project.complete"
  | "project.delete"
  | "boards.view"
  | "calendar.view"
  | "calendar.manage"
  | "task.create"
  | "task.edit"
  | "task.delete_any"
  | "task.status_update"
  | "my_tasks.view"
  | "tasks.view_all"
  | "reports.view"
  | "activity.view"
  | "activity.delete";

type WorkspaceRole = Extract<RegisterAs, "owner" | "admin" | "manager" | "member">;

const ROLE_PERMISSIONS: Record<WorkspaceRole, readonly WorkspacePermission[]> = {
  owner: [
    "billing.view",
    "settings.view",
    "settings.general",
    "settings.members",
    "settings.usage",
    "settings.billing",
    "settings.notifications",
    "settings.security",
    "settings.transfer_ownership",
    "team.view",
    "team.invite",
    "team.change_role",
    "dashboard.view",
    "project.view",
    "project.create",
    "project.edit",
    "project.complete",
    "project.delete",
    "boards.view",
    "calendar.view",
    "calendar.manage",
    "tasks.view_all",
    "reports.view",
    "activity.view",
    "activity.delete",
  ],
  admin: [
    "billing.view",
    "settings.view",
    "settings.general",
    "settings.members",
    "settings.usage",
    "settings.billing",
    "settings.notifications",
    "settings.security",
    "team.view",
    "team.invite",
    "team.change_role",
    "dashboard.view",
    "project.view",
    "project.create",
    "project.edit",
    "project.complete",
    "project.delete",
    "boards.view",
    "calendar.view",
    "calendar.manage",
    "task.create",
    "task.edit",
    "task.delete_any",
    "tasks.view_all",
    "reports.view",
    "activity.view",
    "activity.delete",
  ],
  manager: [
    "team.view",
    "team.remove_squad_member",
    "dashboard.view",
    "project.view",
    "project.create",
    "project.edit",
    "project.complete",
    "project.delete",
    "boards.view",
    "calendar.view",
    "calendar.manage",
    "task.create",
    "task.edit",
    "task.delete_any",
    "tasks.view_all",
    "reports.view",
  ],
  member: [
    "my_tasks.view",
    "boards.view",
    "calendar.view",
    "project.view",
    "task.status_update",
  ],
};

export const SETTINGS_SECTION_PERMISSIONS: Record<WorkspaceSettingsSectionId, WorkspacePermission> = {
  general: "settings.general",
  members: "settings.members",
  usage: "settings.usage",
  billing: "settings.billing",
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

export function canTransferOwnership(role: RegisterAs | undefined) {
  return hasWorkspacePermission(role, "settings.transfer_ownership");
}

export function canUpdateTaskStatus(role: RegisterAs | undefined) {
  return hasWorkspacePermission(role, "task.status_update");
}
