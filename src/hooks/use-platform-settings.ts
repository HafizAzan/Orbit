import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_PLATFORM_SETTINGS,
  DEFAULT_SETTINGS_TAB,
  type PlatformSettings,
  type SettingsSectionId,
} from "../data/admin-settings";
import { countObjectChanges, delay, getSettingsSectionFromTab, getSettingsTabSlug, isValidSettingsTab } from "../lib/helper";
import { setSearchParamValue } from "../lib/url-tab";
import { toast } from "../lib/toast";

type UsePlatformSettingsOptions = {
  initialSettings?: PlatformSettings;
  onSave?: (settings: PlatformSettings) => Promise<void> | void;
};

function usePlatformSettings({ initialSettings = DEFAULT_PLATFORM_SETTINGS, onSave }: UsePlatformSettingsOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [savedSettings, setSavedSettings] = useState<PlatformSettings>(initialSettings);
  const [settings, setSettings] = useState<PlatformSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  const activeTab = useMemo(() => getSettingsSectionFromTab(tabParam), [tabParam]);
  const changeCount = useMemo(() => countObjectChanges(settings, savedSettings), [settings, savedSettings]);

  useEffect(() => {
    if (!isValidSettingsTab(tabParam)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, "tab", getSettingsTabSlug(DEFAULT_SETTINGS_TAB));
          return next;
        },
        { replace: true },
      );
    }
  }, [tabParam, setSearchParams]);

  const handleChange = useCallback(<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setSettings((current) => {
      if (current[key] === value) return current;
      return { ...current, [key]: value };
    });
  }, []);

  const handleTabChange = useCallback(
    (sectionId: SettingsSectionId) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, "tab", getSettingsTabSlug(sectionId));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleDiscard = useCallback(() => {
    setSettings(savedSettings);
    toast.info("Unsaved changes discarded");
  }, [savedSettings]);

  const handleSave = useCallback(async () => {
    setSaving(true);

    try {
      if (onSave) {
        await onSave(settings);
      } else {
        await delay(600);
      }

      setSavedSettings(settings);
      toast.success("Platform settings saved successfully");
    } finally {
      setSaving(false);
    }
  }, [onSave, settings]);

  return {
    settings,
    savedSettings,
    activeTab,
    changeCount,
    saving,
    handleChange,
    handleTabChange,
    handleDiscard,
    handleSave,
  };
}

export default usePlatformSettings;
