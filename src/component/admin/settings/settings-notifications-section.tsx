import { Input } from "antd";
import React from "react";
import { NOTIFICATION_SLACK_PLACEHOLDER, NOTIFICATION_TOGGLES, type PlatformSettings } from "../../../data/admin-settings";
import SettingsField from "./settings-field";
import SettingsSection from "./settings-section";
import SettingsToggleList from "./settings-toggle-list";

type SettingsNotificationsSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsNotificationsSection({ settings, onChange }: SettingsNotificationsSectionProps) {
  return (
    <SettingsSection
      id="notifications"
      title="Notifications"
      description="Configure how platform alerts and digests are delivered to your team."
    >
      <div className="mb-6">
        <SettingsToggleList items={NOTIFICATION_TOGGLES} settings={settings} onChange={onChange} />
      </div>

      <SettingsField label="Slack Webhook URL" hint="Optional. Post high-priority alerts to a Slack channel.">
        <Input
          size="large"
          value={settings.slackWebhook}
          onChange={(event) => onChange("slackWebhook", event.target.value)}
          placeholder={NOTIFICATION_SLACK_PLACEHOLDER}
          className="rounded-xl! bg-background!"
        />
      </SettingsField>
    </SettingsSection>
  );
}

export default React.memo(SettingsNotificationsSection);
