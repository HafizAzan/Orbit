import React from "react";
import useWorkspaceSettings from "../../hooks/use-workspace-settings";
import WorkspaceBillingSection from "../../component/workspace/settings/workspace-billing-section";
import WorkspaceGeneralSection from "../../component/workspace/settings/workspace-general-section";
import WorkspaceIntegrationsSection from "../../component/workspace/settings/workspace-integrations-section";
import WorkspaceMembersSection from "../../component/workspace/settings/workspace-members-section";
import WorkspaceNotificationsSection from "../../component/workspace/settings/workspace-notifications-section";
import WorkspaceSecuritySection from "../../component/workspace/settings/workspace-security-section";
import WorkspaceSettingsNav from "../../component/workspace/settings/workspace-settings-nav";
import SettingsSaveBar from "../../component/admin/settings/settings-save-bar";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceSettings() {
  const {
    settings,
    activeTab,
    changeCount,
    saving,
    handleChange,
    handleTabChange,
    handleDiscard,
    handleSave,
  } = useWorkspaceSettings();

  const renderContent = () => {
    if (activeTab === "general") {
      return (
        <WorkspaceGeneralSection
          settings={settings}
          onChange={handleChange}
          onDiscard={handleDiscard}
          onSave={handleSave}
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

          {activeTab !== "general" ? (
            <SettingsSaveBar
              changeCount={changeCount}
              onDiscard={handleDiscard}
              onSave={handleSave}
              saving={saving}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default React.memo(WorkspaceSettings);
