import React from "react";
import SettingsConfigNav from "../../component/admin/settings/settings-config-nav";
import SettingsSaveBar from "../../component/admin/settings/settings-save-bar";
import { SETTINGS_SECTION_REGISTRY } from "../../component/admin/settings/settings-section-registry";
import { Paragraph, Title } from "../../component/ui/typography";
import usePlatformSettings from "../../hooks/use-platform-settings";

function AdminSettings() {
  const { settings, activeTab, changeCount, saving, handleChange, handleTabChange, handleDiscard, handleSave } =
    usePlatformSettings();

  const ActiveSection = SETTINGS_SECTION_REGISTRY[activeTab];

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <p className="text-xs font-medium text-muted">Platform Settings · Workspace · Admin Console</p>
        <Title level={2} className="mt-1 text-2xl text-foreground lg:text-3xl">
          Platform Settings
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Configure platform-wide preferences, branding, security, and integrations.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 lg:w-60 xl:w-64">
          <SettingsConfigNav activeSection={activeTab} onNavigate={handleTabChange} />
        </div>

        <div className="min-w-0 flex-1">
          <ActiveSection settings={settings} onChange={handleChange} />

          <SettingsSaveBar changeCount={changeCount} onDiscard={handleDiscard} onSave={handleSave} saving={saving} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(AdminSettings);
