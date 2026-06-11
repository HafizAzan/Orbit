import { Input } from "antd";
import React from "react";
import { INTEGRATION_TOGGLES, type PlatformSettings } from "../../../data/admin-settings";
import SettingsField from "./settings-field";
import SettingsSection from "./settings-section";
import SettingsToggleList from "./settings-toggle-list";

type SettingsIntegrationsSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsIntegrationsSection({ settings, onChange }: SettingsIntegrationsSectionProps) {
  return (
    <SettingsSection
      id="integrations"
      title="Integrations"
      description="Manage third-party services connected to your FlowSync platform."
    >
      <div className="mb-6">
        <SettingsToggleList items={INTEGRATION_TOGGLES} settings={settings} onChange={onChange} />
      </div>

      <SettingsField label="Platform Webhook URL" hint="Receive outbound events from FlowSync to your systems.">
        <Input
          size="large"
          value={settings.webhookUrl}
          onChange={(event) => onChange("webhookUrl", event.target.value)}
          className="rounded-xl! bg-background! font-mono text-sm"
        />
      </SettingsField>
    </SettingsSection>
  );
}

export default React.memo(SettingsIntegrationsSection);
