import { Switch } from "antd";
import React from "react";
import type { WorkspaceSettings } from "../../../data/workspace-settings";
import SettingsSection from "../../admin/settings/settings-section";

type WorkspaceNotificationsSectionProps = {
  settings: WorkspaceSettings;
  onChange: <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => void;
  expanded?: boolean;
};

function WorkspaceNotificationsSection({ settings, onChange, expanded = false }: WorkspaceNotificationsSectionProps) {
  return (
    <SettingsSection
      id="workspace-notifications"
      title="Notification Preferences"
      description="Choose how your team receives workspace updates."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">Daily digest summary</p>
            <p className="mt-1 text-sm text-muted">Receive a morning recap of tasks, deadlines, and team activity.</p>
          </div>
          <Switch checked={settings.dailyDigest} onChange={(checked) => onChange("dailyDigest", checked)} />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">Real-time push notifications</p>
            <p className="mt-1 text-sm text-muted">Get instant alerts for mentions, assignments, and status changes.</p>
          </div>
          <Switch checked={settings.realtimePush} onChange={(checked) => onChange("realtimePush", checked)} />
        </div>

        {expanded ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">Weekly workspace report</p>
              <p className="mt-1 text-sm text-muted">Summary email every Monday with project health metrics.</p>
            </div>
            <Switch defaultChecked onChange={() => undefined} />
          </div>
        ) : null}
      </div>
    </SettingsSection>
  );
}

export default React.memo(WorkspaceNotificationsSection);
