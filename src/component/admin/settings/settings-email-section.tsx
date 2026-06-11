import { Button, Input } from "antd";
import React from "react";
import type { PlatformSettings } from "../../../data/admin-settings";
import { toast } from "../../../lib/toast";
import SettingsField from "./settings-field";
import SettingsSection from "./settings-section";

type SettingsEmailSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsEmailSection({ settings, onChange }: SettingsEmailSectionProps) {
  const handleTestConnection = () => {
    toast.success("SMTP connection test successful");
  };

  return (
    <SettingsSection
      id="email"
      title="Email Configuration"
      description="SMTP settings for system notifications and user invites."
      action={
        <Button onClick={handleTestConnection} className="font-medium!">
          Test Connection
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="SMTP Host">
          <Input
            size="large"
            value={settings.smtpHost}
            onChange={(event) => onChange("smtpHost", event.target.value)}
            className="rounded-xl! bg-background!"
          />
        </SettingsField>

        <SettingsField label="Port">
          <Input
            size="large"
            value={settings.smtpPort}
            onChange={(event) => onChange("smtpPort", event.target.value)}
            className="rounded-xl! bg-background!"
          />
        </SettingsField>

        <SettingsField label="Username">
          <Input
            size="large"
            value={settings.smtpUsername}
            onChange={(event) => onChange("smtpUsername", event.target.value)}
            className="rounded-xl! bg-background!"
          />
        </SettingsField>

        <SettingsField label="Password">
          <Input.Password
            size="large"
            value={settings.smtpPassword}
            onChange={(event) => onChange("smtpPassword", event.target.value)}
            className="rounded-xl! bg-background!"
          />
        </SettingsField>
      </div>
    </SettingsSection>
  );
}

export default React.memo(SettingsEmailSection);
