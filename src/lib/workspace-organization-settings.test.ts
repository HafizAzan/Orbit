import { describe, expect, it } from "vitest";
import {
  buildOrganizationUpdatePayload,
  buildWorkspaceSettingsFromOrganization,
} from "./workspace-organization-settings";
import type { WorkspaceOrganization } from "../types/organization.types";

const organization: WorkspaceOrganization = {
  id: "org-1",
  name: "Acme Workspace",
  slug: "acme",
  ownerName: "Owner",
  ownerEmail: "owner@acme.com",
  billingEmail: "billing@acme.com",
  workspaceSettings: {
    dailyDigest: true,
    realtimePush: false,
    weeklyReport: true,
    twoFactorRequired: true,
    sessionTimeoutEnabled: true,
    sessionTimeoutMinutes: 30,
  },
  plan: {
    code: "PRO",
    name: "Pro",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    expiresAt: null,
  },
  users: 5,
  projects: 2,
  status: "active",
  createdAt: "2025-01-01T00:00:00.000Z",
};

describe("workspace organization settings", () => {
  it("maps organization fields into workspace settings", () => {
    expect(buildWorkspaceSettingsFromOrganization(organization)).toEqual({
      workspaceName: "Acme Workspace",
      workspaceSlug: "acme",
      billingEmail: "billing@acme.com",
      twoFactorEnabled: true,
      sessionTimeoutEnabled: true,
      sessionTimeoutMinutes: 30,
      dailyDigest: true,
      realtimePush: false,
      weeklyReport: true,
    });
  });

  it("builds organization update payload from workspace settings", () => {
    const settings = buildWorkspaceSettingsFromOrganization(organization);

    expect(buildOrganizationUpdatePayload(settings)).toEqual({
      name: "Acme Workspace",
      slug: "acme",
      billingEmail: "billing@acme.com",
      workspaceSettings: {
        dailyDigest: true,
        realtimePush: false,
        weeklyReport: true,
        twoFactorRequired: true,
        sessionTimeoutEnabled: true,
        sessionTimeoutMinutes: 30,
      },
    });
  });
});
