export type WorkspaceSettingsSectionId =
  | "general"
  | "members"
  | "billing"
  | "notifications"
  | "security";

export type WorkspaceSettings = {
  workspaceName: string;
  workspaceSlug: string;
  billingEmail: string;
  twoFactorEnabled: boolean;
  sessionTimeoutEnabled: boolean;
  sessionTimeoutMinutes: number;
  dailyDigest: boolean;
  realtimePush: boolean;
  weeklyReport: boolean;
};

export const WORKSPACE_SETTINGS_TAB_SLUGS: Record<WorkspaceSettingsSectionId, string> = {
  general: "general",
  members: "members",
  billing: "billing",
  notifications: "notifications",
  security: "security",
};

export const DEFAULT_WORKSPACE_SETTINGS_TAB: WorkspaceSettingsSectionId = "general";

export const WORKSPACE_SETTINGS_NAV_ITEMS: { id: WorkspaceSettingsSectionId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "members", label: "Members" },
  { id: "billing", label: "Billing" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
];

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  workspaceName: "Acme Workspace",
  workspaceSlug: "acme",
  billingEmail: "",
  twoFactorEnabled: true,
  sessionTimeoutEnabled: true,
  sessionTimeoutMinutes: 30,
  dailyDigest: true,
  realtimePush: false,
  weeklyReport: true,
};

export function getWorkspaceSettingsTabSlug(sectionId: WorkspaceSettingsSectionId) {
  return WORKSPACE_SETTINGS_TAB_SLUGS[sectionId];
}

export function getWorkspaceSettingsSectionFromTab(tab: string | null): WorkspaceSettingsSectionId {
  if (!tab) return DEFAULT_WORKSPACE_SETTINGS_TAB;

  const match = Object.entries(WORKSPACE_SETTINGS_TAB_SLUGS).find(([, slug]) => slug === tab);
  return match ? (match[0] as WorkspaceSettingsSectionId) : DEFAULT_WORKSPACE_SETTINGS_TAB;
}

export function isValidWorkspaceSettingsTab(tab: string | null) {
  if (!tab) return false;
  return Object.values(WORKSPACE_SETTINGS_TAB_SLUGS).includes(tab);
}
