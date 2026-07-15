import type { ComponentType } from "react";
import type { PlatformSettings, SettingsSectionId } from "../../../data/admin-settings";
import SettingsBillingSection from "./settings-billing-section";
import SettingsBrandingSection from "./settings-branding-section";
import SettingsEmailSection from "./settings-email-section";
import SettingsGeneralSection from "./settings-general-section";

export type SettingsSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

export const SETTINGS_SECTION_REGISTRY: Record<SettingsSectionId, ComponentType<SettingsSectionProps>> = {
  general: SettingsGeneralSection,
  branding: SettingsBrandingSection,
  email: SettingsEmailSection,
  billing: SettingsBillingSection,
};
