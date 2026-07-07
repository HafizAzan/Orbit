import { describe, expect, it } from "vitest";
import {
  getWorkspacePermissions,
  hasWorkspacePermission,
  type WorkspacePermission,
} from "./workspace-permissions";

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
