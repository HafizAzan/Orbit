export type SettingsSectionId =
  | "general"
  | "branding"
  | "email"
  | "security"
  | "notifications"
  | "billing";

export type PlatformSettings = {
  platformName: string;
  defaultLanguage: string;
  timezone: string;
  brandColor: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  enforce2fa: boolean;
  highPasswordComplexity: boolean;
  autoSessionTimeout: boolean;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  slackWebhook: string;
  stripeEnabled: boolean;
  sendgridEnabled: boolean;
  webhookUrl: string;
  defaultCurrency: string;
  taxId: string;
  invoicePrefix: string;
};

export type ApiKeyRecord = {
  id: string;
  label: string;
  keyHint: string;
  createdAt: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export const SETTINGS_TAB_SLUGS: Record<SettingsSectionId, string> = {
  general: "general-setting",
  branding: "branding",
  email: "email-configuration",
  security: "security",
  notifications: "notifications",
  billing: "billing-settings",
};

export const DEFAULT_SETTINGS_TAB: SettingsSectionId = "general";

export const SETTINGS_NAV_ITEMS: { id: SettingsSectionId; label: string; tab: string }[] = [
  { id: "general", label: "General Settings", tab: SETTINGS_TAB_SLUGS.general },
  { id: "branding", label: "Branding", tab: SETTINGS_TAB_SLUGS.branding },
  { id: "email", label: "Email Configuration", tab: SETTINGS_TAB_SLUGS.email },
  { id: "security", label: "Security", tab: SETTINGS_TAB_SLUGS.security },
  { id: "notifications", label: "Notifications", tab: SETTINGS_TAB_SLUGS.notifications },
  { id: "billing", label: "Billing Settings", tab: SETTINGS_TAB_SLUGS.billing },
];

export type BrandColorPreset = {
  label: string;
  colors: string[];
};

export type SettingsToggleItem<K extends keyof PlatformSettings = keyof PlatformSettings> = {
  key: K;
  title: string;
  description: string;
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: "FlowSync",
  defaultLanguage: "en-US",
  timezone: "America/Los_Angeles",
  brandColor: "#4F46E5",
  smtpHost: "smtp.sendgrid.net",
  smtpPort: "587",
  smtpUsername: "apikey",
  smtpPassword: "••••••••••••",
  enforce2fa: true,
  highPasswordComplexity: true,
  autoSessionTimeout: false,
  emailNotifications: true,
  weeklyDigest: true,
  slackWebhook: "",
  stripeEnabled: true,
  sendgridEnabled: true,
  webhookUrl: "https://api.flowsync.io/webhooks/platform",
  defaultCurrency: "USD",
  taxId: "US-84-3928102",
  invoicePrefix: "FS-",
};

export const API_KEYS: ApiKeyRecord[] = [
  { id: "1", label: "Production Analytics", keyHint: "pk_live_...4f2e", createdAt: "2 hours ago" },
  { id: "2", label: "Staging Integration", keyHint: "sk_test_...8f0b", createdAt: "Oct 12, 2023" },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
];

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "America/Denver", label: "(GMT-07:00) Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "(GMT-06:00) Central Time (US & Canada)" },
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "Asia/Karachi", label: "(GMT+05:00) Karachi" },
];

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
];

export const BRAND_COLOR_PRESETS: BrandColorPreset[] = [
  {
    label: "Recommended",
    colors: ["#4F46E5", "#0EA5E9", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#0F172A"],
  },
];

export const BRANDING_HINTS = {
  logo: "Recommended size: 512x512px. SVG or PNG.",
  brandColor: "Pick a primary color for buttons, links, and accents across the platform.",
  favicon: "Upload a square image to appear in browser tabs.",
} as const;

export const DEFAULT_PLATFORM_LOGO = "/flow-sync.svg";

export const NOTIFICATION_TOGGLES: SettingsToggleItem<"emailNotifications" | "weeklyDigest">[] = [
  {
    key: "emailNotifications",
    title: "Email Notifications",
    description: "Send critical platform alerts to admin inboxes.",
  },
  {
    key: "weeklyDigest",
    title: "Weekly Digest",
    description: "Summary of growth, churn, and system events every Monday.",
  },
];

export const NOTIFICATION_SLACK_PLACEHOLDER = "https://hooks.slack.com/services/...";

export const SECURITY_POLICIES = [
  {
    key: "enforce2fa" as const,
    title: "Enforce 2FA for all Administrators",
    description: "Require multi-factor authentication for high-privilege accounts.",
  },
  {
    key: "highPasswordComplexity" as const,
    title: "High Password Complexity",
    description: "Require special characters, numbers, and case variation.",
  },
  {
    key: "autoSessionTimeout" as const,
    title: "Automatic Session Timeout",
    description: "Logout users after 30 minutes of inactivity.",
  },
];
