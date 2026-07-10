import { describe, expect, it } from "vitest";
import {
  canTransferOwnership,
  canUpdateTaskStatus,
  getWorkspacePermissions,
  hasWorkspacePermission,
  type WorkspacePermission,
} from "./workspace-permissions";

const MEMBER_ALLOWED: WorkspacePermission[] = [
  "my_tasks.view",
  "boards.view",
  "calendar.view",
  "project.view",
  "task.status_update",
];

const OWNER_ALLOWED: WorkspacePermission[] = [
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
];

describe("member workspace permissions", () => {
  it("grants collaboration and status update permissions", () => {
    for (const permission of MEMBER_ALLOWED) {
      expect(hasWorkspacePermission("member", permission)).toBe(true);
    }
  });

  it("denies org management and task management permissions", () => {
    expect(hasWorkspacePermission("member", "dashboard.view")).toBe(false);
    expect(hasWorkspacePermission("member", "project.create")).toBe(false);
    expect(hasWorkspacePermission("member", "task.create")).toBe(false);
  });

  it("returns the expected permission set", () => {
    expect(getWorkspacePermissions("member")).toEqual(MEMBER_ALLOWED);
  });
});

describe("owner workspace permissions", () => {
  it("grants oversight permissions without hands-on task work", () => {
    for (const permission of OWNER_ALLOWED) {
      expect(hasWorkspacePermission("owner", permission)).toBe(true);
    }
  });

  it("denies task operations and member-only routes", () => {
    expect(hasWorkspacePermission("owner", "task.create")).toBe(false);
    expect(hasWorkspacePermission("owner", "my_tasks.view")).toBe(false);
  });

  it("supports ownership transfer permission helper", () => {
    expect(canTransferOwnership("owner")).toBe(true);
    expect(canTransferOwnership("admin")).toBe(false);
  });
});

describe("task status helpers", () => {
  it("allows members to update status only", () => {
    expect(canUpdateTaskStatus("member")).toBe(true);
    expect(canUpdateTaskStatus("manager")).toBe(false);
  });
});
