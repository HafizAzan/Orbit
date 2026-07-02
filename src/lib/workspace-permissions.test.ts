import { describe, expect, it } from "vitest";
import {
  getWorkspacePermissions,
  hasWorkspacePermission,
  type WorkspacePermission,
} from "./workspace-permissions";

const MANAGER_ALLOWED: WorkspacePermission[] = [
  "team.view",
  "team.remove_squad_member",
  "project.create",
  "project.edit",
  "project.delete",
  "task.create",
  "task.edit",
  "task.delete_any",
  "tasks.view_all",
  "reports.view",
  "activity.view",
];

const MANAGER_DENIED: WorkspacePermission[] = [
  "billing.view",
  "settings.view",
  "settings.general",
  "settings.members",
  "settings.billing",
  "settings.integrations",
  "settings.notifications",
  "settings.security",
  "team.invite",
  "team.change_role",
  "activity.delete",
  "my_tasks.view",
];

describe("manager workspace permissions", () => {
  it("grants delivery and reporting permissions", () => {
    for (const permission of MANAGER_ALLOWED) {
      expect(hasWorkspacePermission("manager", permission)).toBe(true);
    }
  });

  it("denies billing, settings, invites, and activity deletion", () => {
    for (const permission of MANAGER_DENIED) {
      expect(hasWorkspacePermission("manager", permission)).toBe(false);
    }
  });

  it("returns the expected permission set", () => {
    expect(getWorkspacePermissions("manager")).toEqual(MANAGER_ALLOWED);
  });
});
