import React, { useCallback, useEffect, useMemo } from "react";
import useWorkspaceSettings from "../../hooks/use-workspace-settings";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import {
  useUpdateWorkspaceOrganization,
  useWorkspaceOrganization,
} from "../../hooks/use-workspace-organization";
import WorkspaceBillingSection from "../../component/workspace/settings/workspace-billing-section";
import WorkspaceGeneralSection from "../../component/workspace/settings/workspace-general-section";
import WorkspaceIntegrationsSection from "../../component/workspace/settings/workspace-integrations-section";
import WorkspaceMembersSection from "../../component/workspace/settings/workspace-members-section";
import WorkspaceNotificationsSection from "../../component/workspace/settings/workspace-notifications-section";
import WorkspaceSecuritySection from "../../component/workspace/settings/workspace-security-section";
import WorkspaceSettingsNav from "../../component/workspace/settings/workspace-settings-nav";
import WorkspaceAccessDenied from "../../component/workspace/workspace-access-denied";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import SettingsSaveBar from "../../component/admin/settings/settings-save-bar";
import { Paragraph, Title } from "../../component/ui/typography";
import { DEFAULT_WORKSPACE_SETTINGS, WORKSPACE_SETTINGS_NAV_ITEMS } from "../../data/workspace-settings";
import {
  buildOrganizationUpdatePayload,
  buildWorkspaceSettingsFromOrganization,
} from "../../lib/workspace-organization-settings";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { useAppContext } from "../../context/app-context";

function WorkspaceSettingsContent() {
  const app = useAppContext();
  const { data: organization, isLoading } = useWorkspaceOrganization();
  const { mutateAsync: updateOrganization } = useUpdateWorkspaceOrganization();
  const { canAccessSettingsTab } = useWorkspacePermissions();

  const initialSettings = useMemo(() => {
    if (!organization) return DEFAULT_WORKSPACE_SETTINGS;

    return {
      ...DEFAULT_WORKSPACE_SETTINGS,
      ...buildWorkspaceSettingsFromOrganization(organization),
    };
  }, [organization]);

  const {
    settings,
    activeTab,
    changeCount,
    saving,
    handleChange,
    handleTabChange,
    handleDiscard,
    handleSave,
  } = useWorkspaceSettings({
    initialSettings,
    onSave: async (nextSettings) => {
      await updateOrganization(buildOrganizationUpdatePayload(nextSettings));
      showApiSuccessToast("Workspace settings saved successfully.");
      await app?.refreshUser?.();
    },
  });

  const firstAllowedTab = WORKSPACE_SETTINGS_NAV_ITEMS.find((item) => canAccessSettingsTab(item.id))?.id;

  useEffect(() => {
    if (!canAccessSettingsTab(activeTab) && firstAllowedTab) {
      handleTabChange(firstAllowedTab);
    }
  }, [activeTab, canAccessSettingsTab, firstAllowedTab, handleTabChange]);

  const handleSaveWithError = useCallback(async () => {
    try {
      await handleSave();
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [handleSave]);

  const renderContent = () => {
    if (isLoading && activeTab === "general") {
      return <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted">Loading organization settings...</div>;
    }

    if (!canAccessSettingsTab(activeTab)) {
      return (
        <WorkspaceAccessDenied
          title="Settings section restricted"
          description="You do not have permission to view this settings section."
        />
      );
    }

    if (activeTab === "general") {
      return (
        <WorkspaceGeneralSection
          settings={settings}
          onChange={handleChange}
          onDiscard={handleDiscard}
          onSave={handleSaveWithError}
          saving={saving}
        />
      );
    }

    if (activeTab === "members") {
      return <WorkspaceMembersSection expanded />;
    }

    if (activeTab === "billing") {
      return <WorkspaceBillingSection expanded />;
    }

    if (activeTab === "integrations") {
      return <WorkspaceIntegrationsSection expanded />;
    }

    if (activeTab === "notifications") {
      return <WorkspaceNotificationsSection settings={settings} onChange={handleChange} expanded />;
    }

    return <WorkspaceSecuritySection settings={settings} onChange={handleChange} expanded />;
  };

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          Workspace Settings
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage your workspace&apos;s identity, billing, and team security settings.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 lg:w-60 xl:w-64">
          <WorkspaceSettingsNav activeSection={activeTab} onNavigate={handleTabChange} />
        </div>

        <div className="min-w-0 flex-1">
          {renderContent()}

          {activeTab !== "general" && canAccessSettingsTab(activeTab) ? (
            <SettingsSaveBar
              changeCount={changeCount}
              onDiscard={handleDiscard}
              onSave={handleSaveWithError}
              saving={saving}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WorkspaceSettings() {
  return (
    <WorkspaceRoleGate
      permission="settings.view"
      title="Settings access restricted"
      description="Only workspace owners and admins can manage organization settings."
    >
      <WorkspaceSettingsContent />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceSettings);
