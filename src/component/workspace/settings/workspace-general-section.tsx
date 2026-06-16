import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";
import type { WorkspaceSettings } from "../../../data/workspace-settings";
import SettingsField from "../../admin/settings/settings-field";
import SettingsSection from "../../admin/settings/settings-section";

type WorkspaceGeneralSectionProps = {
  settings: WorkspaceSettings;
  onChange: <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => void;
  onDiscard: () => void;
  onSave: () => void;
  saving?: boolean;
  showActions?: boolean;
};

function WorkspaceGeneralSection({
  settings,
  onChange,
  onDiscard,
  onSave,
  saving = false,
  showActions = true,
}: WorkspaceGeneralSectionProps) {
  return (
    <SettingsSection
      id="workspace-general"
      title="General Information"
      description="Update your workspace identity and public profile details."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="Workspace Name">
          <Input
            value={settings.workspaceName}
            onChange={(event) => onChange("workspaceName", event.target.value)}
            placeholder="Acme Workspace"
            size="large"
            className="rounded-xl! bg-background!"
          />
        </SettingsField>

        <SettingsField label="Workspace URL">
          <Input
            value={settings.workspaceUrl}
            onChange={(event) => onChange("workspaceUrl", event.target.value)}
            placeholder="flowsync.io/workspace/acme"
            size="large"
            className="rounded-xl! bg-background!"
          />
        </SettingsField>
      </div>

      <div className="mt-5">
        <SettingsField label="Workspace Logo" hint="PNG or SVG. Max file size 2MB.">
          <button
            type="button"
            className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 px-6 py-8 text-center transition-colors hover:border-primary/30 hover:bg-background"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-feature-sync text-primary">
              <CloudUploadOutlined className="text-xl" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-muted">Recommended size 256×256px</p>
          </button>
        </SettingsField>
      </div>

      {showActions ? (
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button size="large" onClick={onDiscard} disabled={saving} className="font-medium!">
            Discard
          </Button>
          <Button type="primary" size="large" onClick={onSave} loading={saving} className="font-semibold!">
            Save Changes
          </Button>
        </div>
      ) : null}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceGeneralSection);
