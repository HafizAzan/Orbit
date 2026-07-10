import { Button, Input } from "antd";
import React, { useMemo } from "react";
import type { WorkspaceSettings } from "../../../data/workspace-settings";
import { getWorkspaceSlugPreview } from "../../../lib/workspace-organization-settings";
import SettingsField from "../../admin/settings/settings-field";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph, Text } from "../../ui/typography";

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
  const previewSlug = useMemo(
    () => getWorkspaceSlugPreview(settings.workspaceSlug),
    [settings.workspaceSlug],
  );

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
          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <Paragraph size="sm">
              Orbit.io/workspace/
              <Text
                as="span"
                weight="semibold"
                color={settings.workspaceSlug.trim() ? "primary" : "muted"}
              >
                {previewSlug}
              </Text>
            </Paragraph>
          </div>
        </SettingsField>
      </div>

      <div className="mt-5">
        <SettingsField label="Workspace Slug" hint="Used in your public workspace URL. Lowercase letters, numbers, and dashes only.">
          <Input
            value={settings.workspaceSlug}
            onChange={(event) => onChange("workspaceSlug", event.target.value.toLowerCase())}
            placeholder="acme"
            size="large"
            className="rounded-xl! bg-background!"
          />
        </SettingsField>
      </div>

      <div className="mt-5">
        <SettingsField label="Billing Email" hint="Invoices and payment receipts are sent to this address.">
          <Input
            value={settings.billingEmail}
            onChange={(event) => onChange("billingEmail", event.target.value)}
            placeholder="billing@company.com"
            size="large"
            className="rounded-xl! bg-background!"
          />
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
