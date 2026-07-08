import { InputNumber, Switch } from "antd";
import React from "react";
import type { WorkspaceSettings } from "../../../data/workspace-settings";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph, Text } from "../../ui/typography";
import WorkspaceTwoFactorPanel from "./workspace-two-factor-panel";

type WorkspaceSecuritySectionProps = {
  settings: WorkspaceSettings;
  onChange: <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => void;
  expanded?: boolean;
};

function WorkspaceSecuritySection({ settings, onChange, expanded = false }: WorkspaceSecuritySectionProps) {
  return (
    <>
      <SettingsSection
        id="workspace-security"
        title="Security & Access"
        description="Only workspace owners and admins manage security for the organization."
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text as="p" weight="semibold">
                Require Two-Factor Authentication
              </Text>
              <Paragraph size="sm" className="mt-1">
                Only owners and admins can turn this on or off. Set up your authenticator below before enabling it.
                Managers and members cannot sign in while this is on unless an owner or admin turns it off for them.
              </Paragraph>
            </div>
            <Switch checked={settings.twoFactorEnabled} onChange={(checked) => onChange("twoFactorEnabled", checked)} />
          </div>

          {expanded ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Text as="p" weight="semibold">
                  Session Timeout
                </Text>
                <Paragraph size="sm" className="mt-1">
                  Automatically sign out inactive users after a period of inactivity.
                </Paragraph>
              </div>
              <Switch checked={settings.sessionTimeoutEnabled} onChange={(checked) => onChange("sessionTimeoutEnabled", checked)} />
            </div>
          ) : null}

          {expanded && settings.sessionTimeoutEnabled ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Text as="p" weight="semibold">
                  Timeout duration
                </Text>
                <Paragraph size="sm" className="mt-1">
                  Minutes of inactivity before a session expires.
                </Paragraph>
              </div>
              <InputNumber
                min={5}
                max={480}
                value={settings.sessionTimeoutMinutes}
                onChange={(value) => onChange("sessionTimeoutMinutes", value ?? 30)}
                addonAfter="min"
                className="w-32!"
              />
            </div>
          ) : null}
        </div>
      </SettingsSection>

      {expanded ? <WorkspaceTwoFactorPanel /> : null}
    </>
  );
}

export default React.memo(WorkspaceSecuritySection);
