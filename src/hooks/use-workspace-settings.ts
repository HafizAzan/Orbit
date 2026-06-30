import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_WORKSPACE_SETTINGS,
  DEFAULT_WORKSPACE_SETTINGS_TAB,
  type WorkspaceSettings,
  type WorkspaceSettingsSectionId,
  getWorkspaceSettingsSectionFromTab,
  getWorkspaceSettingsTabSlug,
  isValidWorkspaceSettingsTab,
} from "../data/workspace-settings";
import { countObjectChanges, delay } from "../lib/helper";
import { setSearchParamValue } from "../lib/url-tab";
import { toast } from "../lib/toast";

type UseWorkspaceSettingsOptions = {
  initialSettings?: WorkspaceSettings;
  onSave?: (settings: WorkspaceSettings) => Promise<void> | void;
};

function useWorkspaceSettings({
  initialSettings = DEFAULT_WORKSPACE_SETTINGS,
  onSave,
}: UseWorkspaceSettingsOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [savedSettings, setSavedSettings] = useState<WorkspaceSettings>(initialSettings);
  const [settings, setSettings] = useState<WorkspaceSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  const activeTab = useMemo(() => getWorkspaceSettingsSectionFromTab(tabParam), [tabParam]);
  const changeCount = useMemo(() => countObjectChanges(settings, savedSettings), [settings, savedSettings]);

  useEffect(() => {
    setSavedSettings(initialSettings);
    setSettings(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    if (!isValidWorkspaceSettingsTab(tabParam)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, "tab", getWorkspaceSettingsTabSlug(DEFAULT_WORKSPACE_SETTINGS_TAB));
          return next;
        },
        { replace: true },
      );
    }
  }, [tabParam, setSearchParams]);

  const handleChange = useCallback(<K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => {
    setSettings((current) => {
      if (current[key] === value) return current;
      return { ...current, [key]: value };
    });
  }, []);

  const handleTabChange = useCallback(
    (sectionId: WorkspaceSettingsSectionId) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setSearchParamValue(next, "tab", getWorkspaceSettingsTabSlug(sectionId));
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

      if (!onSave) {
        toast.success("Workspace settings saved successfully");
      }
    } finally {
      setSaving(false);
    }
  }, [onSave, settings]);

  return {
    settings,
    activeTab,
    changeCount,
    saving,
    handleChange,
    handleTabChange,
    handleDiscard,
    handleSave,
  };
}

export default useWorkspaceSettings;
