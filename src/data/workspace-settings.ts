export type WorkspaceSettingsSectionId =
  | "general"
  | "members"
  | "billing"
  | "integrations"
  | "notifications"
  | "security";

export type WorkspaceSettings = {
  workspaceName: string;
  workspaceUrl: string;
  twoFactorEnabled: boolean;
  ssoEnabled: boolean;
  dailyDigest: boolean;
  realtimePush: boolean;
};

export type WorkspaceIntegration = {
  id: string;
  name: string;
  description: string;
  status: "connected" | "available";
  iconBg: string;
  iconText: string;
};

export type WorkspaceMemberPreview = {
  id: string;
  name: string;
  avatarColor: string;
};

export const WORKSPACE_SETTINGS_TAB_SLUGS: Record<WorkspaceSettingsSectionId, string> = {
  general: "general",
  members: "members",
  billing: "billing",
  integrations: "integrations",
  notifications: "notifications",
  security: "security",
};

export const DEFAULT_WORKSPACE_SETTINGS_TAB: WorkspaceSettingsSectionId = "general";

export const WORKSPACE_SETTINGS_NAV_ITEMS: { id: WorkspaceSettingsSectionId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "members", label: "Members" },
  { id: "billing", label: "Billing" },
  { id: "integrations", label: "Integrations" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
];

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  workspaceName: "Acme Workspace",
  workspaceUrl: "flowsync.io/workspace/acme",
  twoFactorEnabled: true,
  ssoEnabled: false,
  dailyDigest: true,
  realtimePush: false,
};

export const WORKSPACE_SEAT_USAGE = {
  occupied: 124,
  total: 250,
};

export const WORKSPACE_MEMBER_PREVIEWS: WorkspaceMemberPreview[] = [
  { id: "1", name: "Sarah Mitchell", avatarColor: "bg-violet-100 text-violet-700" },
  { id: "2", name: "Marcus Chen", avatarColor: "bg-sky-100 text-sky-700" },
  { id: "3", name: "Elena Rodriguez", avatarColor: "bg-amber-100 text-amber-700" },
];

export const WORKSPACE_BILLING_SUMMARY = {
  planName: "Enterprise",
  priceLabel: "$1,299/year",
  nextPaymentDate: "Dec 12, 2025",
  cardBrand: "Visa",
  cardLast4: "4242",
  cardExpiry: "08/27",
};

export const WORKSPACE_INTEGRATIONS: WorkspaceIntegration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Connected · #project-updates",
    status: "connected",
    iconBg: "bg-fuchsia-100 text-fuchsia-700",
    iconText: "S",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connected · 12 repositories",
    status: "connected",
    iconBg: "bg-slate-900 text-white",
    iconText: "G",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Syncing issues every hour",
    status: "connected",
    iconBg: "bg-sky-100 text-sky-700",
    iconText: "J",
  },
];

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
