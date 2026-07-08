import { DEFAULT_WORKSPACE_SETTINGS, type WorkspaceSettings } from "../data/workspace-settings";
import type { WorkspaceOrganization } from "../types/organization.types";

export const SETTINGS_TABS_WITH_SAVE = ["general", "notifications", "security"] as const;

export type PersistableSettingsTab = (typeof SETTINGS_TABS_WITH_SAVE)[number];

export function buildWorkspaceSettingsFromOrganization(
  organization: WorkspaceOrganization,
): WorkspaceSettings {
  const workspaceSettings = organization.workspaceSettings;

  return {
    workspaceName: organization.name,
    workspaceSlug: organization.slug,
    billingEmail: organization.billingEmail ?? "",
    twoFactorEnabled: workspaceSettings.twoFactorRequired,
    sessionTimeoutEnabled: workspaceSettings.sessionTimeoutEnabled,
    sessionTimeoutMinutes: workspaceSettings.sessionTimeoutMinutes ?? 30,
    dailyDigest: workspaceSettings.dailyDigest,
    realtimePush: workspaceSettings.realtimePush,
    weeklyReport: workspaceSettings.weeklyReport,
  };
}

export function buildOrganizationUpdatePayload(settings: WorkspaceSettings) {
  return {
    name: settings.workspaceName.trim(),
    slug: settings.workspaceSlug.trim(),
    billingEmail: settings.billingEmail.trim() || undefined,
    workspaceSettings: {
      dailyDigest: settings.dailyDigest,
      realtimePush: settings.realtimePush,
      weeklyReport: settings.weeklyReport,
      twoFactorRequired: settings.twoFactorEnabled,
      sessionTimeoutEnabled: settings.sessionTimeoutEnabled,
      sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
    },
  };
}

export function getDefaultWorkspaceSettings(): WorkspaceSettings {
  return { ...DEFAULT_WORKSPACE_SETTINGS };
}

export function getWorkspaceSlugPreview(slug: string) {
  return slug.trim() || "your-workspace";
}

export function isPersistableSettingsTab(tab: string): tab is PersistableSettingsTab {
  return SETTINGS_TABS_WITH_SAVE.includes(tab as PersistableSettingsTab);
}
