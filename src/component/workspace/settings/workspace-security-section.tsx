import { Button, Switch } from "antd";
import React from "react";
import type { WorkspaceSettings } from "../../../data/workspace-settings";
import { toast } from "../../../lib/toast";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph, Text } from "../../ui/typography";

type WorkspaceSecuritySectionProps = {
  settings: WorkspaceSettings;
  onChange: <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => void;
  expanded?: boolean;
};

function WorkspaceSecuritySection({ settings, onChange, expanded = false }: WorkspaceSecuritySectionProps) {
  return (
    <SettingsSection
      id="workspace-security"
      title="Security & Access"
      description="Protect your workspace with authentication and access controls."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text as="p" weight="semibold">Two-Factor Authentication</Text>
            <Paragraph size="sm" className="mt-1">Require an additional verification step for all workspace members.</Paragraph>
          </div>
          <Switch checked={settings.twoFactorEnabled} onChange={(checked) => onChange("twoFactorEnabled", checked)} />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text as="p" weight="semibold">Single Sign-On (SSO)</Text>
            <Paragraph size="sm" className="mt-1">Connect your identity provider for enterprise login.</Paragraph>
          </div>
          <Button className="font-semibold!" onClick={() => toast.info("SSO configuration — coming soon")}>
            Configure
          </Button>
        </div>

        {expanded ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text as="p" weight="semibold">Session Timeout</Text>
              <Paragraph size="sm" className="mt-1">Automatically sign out inactive users after 30 minutes.</Paragraph>
            </div>
            <Switch defaultChecked onChange={() => toast.info("Session policy — coming soon")} />
          </div>
        ) : null}
      </div>
    </SettingsSection>
  );
}

export default React.memo(WorkspaceSecuritySection);
