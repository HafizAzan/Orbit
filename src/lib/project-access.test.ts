import { describe, expect, it } from "vitest";
import { canDeleteWorkspaceProject, getDeletableProjectIds } from "./project-access";

describe("canDeleteWorkspaceProject", () => {
  const createdById = "creator-1";

  it("allows owner and admin to delete any project", () => {
    const project = { createdById, viewerRole: "member" as const };

    expect(canDeleteWorkspaceProject({ id: "owner-1", role: "owner" }, project)).toBe(true);
    expect(canDeleteWorkspaceProject({ id: "admin-1", role: "admin" }, project)).toBe(true);
  });

  describe("manager role", () => {
    it("allows delete when manager is project admin", () => {
      expect(
        canDeleteWorkspaceProject(
          { id: "manager-1", role: "manager" },
          { createdById, viewerRole: "admin" },
        ),
      ).toBe(true);
    });

    it("allows delete when manager created the project", () => {
      expect(
        canDeleteWorkspaceProject(
          { id: "manager-1", role: "manager" },
          { createdById: "manager-1", viewerRole: "member" },
        ),
      ).toBe(true);
    });

    it("denies delete for projects where manager is only a member", () => {
      expect(
        canDeleteWorkspaceProject(
          { id: "manager-2", role: "manager" },
          { createdById, viewerRole: "member" },
        ),
      ).toBe(false);
    });
  });

  it("denies delete for members", () => {
    expect(
      canDeleteWorkspaceProject(
        { id: "member-1", role: "member" },
        { createdById: "member-1", viewerRole: "admin" },
      ),
    ).toBe(false);
  });
});

describe("getDeletableProjectIds", () => {
  it("returns only projects the user can delete", () => {
    const projects = [
      { id: "p1", createdById: "manager-1", viewerRole: "admin" as const },
      { id: "p2", createdById: "other", viewerRole: "member" as const },
      { id: "p3", createdById: "manager-1", viewerRole: "member" as const },
    ];

    expect(getDeletableProjectIds({ id: "manager-1", role: "manager" }, projects)).toEqual([
      "p1",
      "p3",
    ]);
  });
});
