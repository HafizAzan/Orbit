import { Switch } from "antd";
import React from "react";
import type { PlatformSettings, SettingsToggleItem } from "../../../data/admin-settings";
import { Paragraph, Text } from "../../ui/typography";

type SettingsToggleListProps<K extends keyof PlatformSettings> = {
  items: SettingsToggleItem<K>[];
  settings: PlatformSettings;
  onChange: <P extends keyof PlatformSettings>(key: P, value: PlatformSettings[P]) => void;
};

function SettingsToggleList<K extends keyof PlatformSettings>({ items, settings, onChange }: SettingsToggleListProps<K>) {
  return (
    <ul className="divide-y divide-border rounded-xl border border-border">
      {items.map((item) => (
        <li key={String(item.key)} className="flex items-center justify-between gap-4 bg-card px-4 py-4 sm:px-5">
          <div>
            <Text as="p" weight="semibold">{item.title}</Text>
            <Paragraph size="sm" className="mt-0.5 mb-0!">{item.description}</Paragraph>
          </div>
          <Switch
            checked={Boolean(settings[item.key])}
            onChange={(checked) => onChange(item.key, checked as PlatformSettings[K])}
          />
        </li>
      ))}
    </ul>
  );
}

export default React.memo(SettingsToggleList) as typeof SettingsToggleList;
