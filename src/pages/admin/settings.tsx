import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageSeo from "../../component/seo/page-seo";
import SettingsConfigNav from "../../component/admin/settings/settings-config-nav";
import SettingsSaveBar from "../../component/admin/settings/settings-save-bar";
import { SETTINGS_SECTION_REGISTRY } from "../../component/admin/settings/settings-section-registry";
import { Paragraph, Text, Title } from "../../component/ui/typography";
import { AdminListPageSkeleton } from "../../component/skeletons";
import usePlatformSettings from "../../hooks/use-platform-settings";
import { getPlatformSettings, updatePlatformSettings } from "../../api-services/admin-settings.service";
import type { PlatformSettings } from "../../data/admin-settings";

function AdminSettingsInner({ initialSettings }: { initialSettings: PlatformSettings }) {
  const { settings, activeTab, changeCount, saving, handleChange, handleTabChange, handleDiscard, handleSave } =
    usePlatformSettings({
      initialSettings,
      onSave: async (next) => {
        await updatePlatformSettings(next);
      },
    });

  const ActiveSection = SETTINGS_SECTION_REGISTRY[activeTab];

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Platform Settings" description="Configure platform-wide preferences, branding, and security." noIndex />
      <div className="mb-6">
        <Text as="p" size="xs" color="muted" weight="medium">Platform Settings · Workspace · Admin Console</Text>
        <Title level={2} className="mt-1 text-2xl text-foreground lg:text-3xl">
          Platform Settings
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Configure platform-wide preferences, branding, security, and billing.
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

function AdminSettings() {
  const { data: remoteSettings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getPlatformSettings,
  });

  if (isLoading || !remoteSettings) {
    return <AdminListPageSkeleton />;
  }

  return <AdminSettingsInner initialSettings={remoteSettings} />;
}

export default React.memo(AdminSettings);
