import { Input, Select } from "antd";
import React from "react";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS, type PlatformSettings } from "../../../data/admin-settings";
import SettingsField from "./settings-field";
import SettingsSection from "./settings-section";

type SettingsGeneralSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsGeneralSection({ settings, onChange }: SettingsGeneralSectionProps) {
  return (
    <SettingsSection
      id="general"
      title="General Settings"
      description="Core identification and localization for your FlowSync instance."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="Platform Name">
          <Input
            size="large"
            value={settings.platformName}
            onChange={(event) => onChange("platformName", event.target.value)}
            className="rounded-xl! bg-background!"
          />
        </SettingsField>

        <SettingsField label="Default Language">
          <Select
            size="large"
            value={settings.defaultLanguage}
            onChange={(value) => onChange("defaultLanguage", value)}
            options={LANGUAGE_OPTIONS}
            className="w-full [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-background!"
          />
        </SettingsField>

        <SettingsField label="Timezone" className="md:col-span-2">
          <Select
            size="large"
            value={settings.timezone}
            onChange={(value) => onChange("timezone", value)}
            options={TIMEZONE_OPTIONS}
            className="w-full [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-background!"
          />
        </SettingsField>
      </div>
    </SettingsSection>
  );
}

export default React.memo(SettingsGeneralSection);
