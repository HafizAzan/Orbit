import { describe, expect, it } from "vitest";
import { getWorkspacePermissions, hasWorkspacePermission, type WorkspacePermission } from "./workspace-permissions";

const MEMBER_ALLOWED: WorkspacePermission[] = ["my_tasks.view"];

const MEMBER_DENIED: WorkspacePermission[] = [
  "billing.view",
  "settings.view",
  "tasks.view_all",
  "team.view",
  "reports.view",
  "activity.view",
  "project.create",
  "task.create",
  "task.edit",
  "task.delete_any",
];

const ADMIN_ALLOWED: WorkspacePermission[] = [
  "billing.view",
  "settings.view",
  "settings.general",
  "settings.members",
  "settings.billing",
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
  "tasks.view_all",
  "reports.view",
  "activity.view",
  "activity.delete",
];

const ADMIN_DENIED: WorkspacePermission[] = ["my_tasks.view", "team.remove_squad_member"];

describe("member workspace permissions", () => {
  it("grants personal task permissions", () => {
    for (const permission of MEMBER_ALLOWED) {
      expect(hasWorkspacePermission("member", permission)).toBe(true);
    }
  });

  it("denies org management and global task views", () => {
    for (const permission of MEMBER_DENIED) {
      expect(hasWorkspacePermission("member", permission)).toBe(false);
    }
  });

  it("returns the expected permission set", () => {
    expect(getWorkspacePermissions("member")).toEqual(MEMBER_ALLOWED);
  });
});

describe("admin workspace permissions", () => {
  it("grants org administration and task management permissions", () => {
    for (const permission of ADMIN_ALLOWED) {
      expect(hasWorkspacePermission("admin", permission)).toBe(true);
    }
  });

  it("denies member-only and manager squad permissions", () => {
    for (const permission of ADMIN_DENIED) {
      expect(hasWorkspacePermission("admin", permission)).toBe(false);
    }
  });

  it("returns the expected permission set", () => {
    expect(getWorkspacePermissions("admin")).toEqual(ADMIN_ALLOWED);
  });
});
