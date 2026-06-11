import { Input, Select } from "antd";
import React from "react";
import { CURRENCY_OPTIONS, type PlatformSettings } from "../../../data/admin-settings";
import SettingsField from "./settings-field";
import SettingsSection from "./settings-section";

type SettingsBillingSectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsBillingSection({ settings, onChange }: SettingsBillingSectionProps) {
  return (
    <SettingsSection id="billing" title="Billing Settings" description="Default billing preferences applied across new organization subscriptions.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="Default Currency">
          <Select
            size="large"
            value={settings.defaultCurrency}
            onChange={(value) => onChange("defaultCurrency", value)}
            options={CURRENCY_OPTIONS}
            className="w-full [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-background!"
          />
        </SettingsField>

        <SettingsField label="Tax ID">
          <Input
            size="large"
            value={settings.taxId}
            onChange={(event) => onChange("taxId", event.target.value)}
            className="rounded-xl! bg-background!"
          />
        </SettingsField>

        <SettingsField label="Invoice Prefix" className="md:col-span-2">
          <Input
            size="large"
            value={settings.invoicePrefix}
            onChange={(event) => onChange("invoicePrefix", event.target.value)}
            className="max-w-xs rounded-xl! bg-background! ml-2!"
          />
        </SettingsField>
      </div>
    </SettingsSection>
  );
}

export default React.memo(SettingsBillingSection);
