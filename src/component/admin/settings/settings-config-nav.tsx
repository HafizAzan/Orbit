import React from "react";
import { SETTINGS_NAV_ITEMS, type SettingsSectionId } from "../../../data/admin-settings";
import { cn } from "../../../lib/utils";

type SettingsConfigNavProps = {
  activeSection: SettingsSectionId;
  onNavigate: (sectionId: SettingsSectionId) => void;
};

function SettingsConfigNav({ activeSection, onNavigate }: SettingsConfigNavProps) {
  return (
    <nav className="rounded-2xl border border-border bg-card p-3 shadow-sm lg:sticky lg:top-28">
      <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">Configuration</p>
      <ul className="space-y-1">
        {SETTINGS_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-feature-sync text-primary"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default React.memo(SettingsConfigNav);
