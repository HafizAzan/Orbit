export type SettingsSectionId = "general" | "branding" | "email" | "billing";

export type PlatformSettings = {
  platformName: string;
  defaultLanguage: string;
  timezone: string;
  brandColor: string;
  logoUrl: string;
  faviconUrl: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  defaultCurrency: string;
  taxId: string;
  invoicePrefix: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export const SETTINGS_TAB_SLUGS: Record<SettingsSectionId, string> = {
  general: "general-setting",
  branding: "branding",
  email: "email-configuration",
  billing: "billing-settings",
};

export const DEFAULT_SETTINGS_TAB: SettingsSectionId = "general";

export const SETTINGS_NAV_ITEMS: { id: SettingsSectionId; label: string; tab: string }[] = [
  { id: "general", label: "General Settings", tab: SETTINGS_TAB_SLUGS.general },
  { id: "branding", label: "Branding", tab: SETTINGS_TAB_SLUGS.branding },
  { id: "email", label: "Email Configuration", tab: SETTINGS_TAB_SLUGS.email },
  { id: "billing", label: "Billing Settings", tab: SETTINGS_TAB_SLUGS.billing },
];

export type BrandColorPreset = {
  label: string;
  colors: string[];
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: "Orbit",
  defaultLanguage: "en-US",
  timezone: "America/Los_Angeles",
  brandColor: "#4F46E5",
  logoUrl: "",
  faviconUrl: "",
  smtpHost: "smtp.sendgrid.net",
  smtpPort: "587",
  smtpUsername: "apikey",
  smtpPassword: "••••••••••••",
  defaultCurrency: "USD",
  taxId: "US-84-3928102",
  invoicePrefix: "OR-",
};

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

export const DEFAULT_PLATFORM_LOGO = "/orbit.svg";
