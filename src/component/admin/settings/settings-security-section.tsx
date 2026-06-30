import { PlusOutlined } from "@ant-design/icons";
import { Button, Switch } from "antd";
import React, { useState } from "react";
import { API_KEYS, SECURITY_POLICIES, type ApiKeyRecord, type PlatformSettings } from "../../../data/admin-settings";
import { toast } from "../../../lib/toast";
import SettingsSection from "./settings-section";
import { Paragraph, Text, Title } from "../../ui/typography";

type SettingsSecuritySectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsSecuritySection({ settings, onChange }: SettingsSecuritySectionProps) {
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(API_KEYS);

  const handleRevoke = (id: string) => {
    setApiKeys((current) => current.filter((key) => key.id !== id));
    toast.success("API key revoked successfully");
  };

  return (
    <SettingsSection
      id="security"
      title="Security"
      description="Control access and protect sensitive platform data."
    >
      <div className="space-y-8">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Title level={5} color="muted" className="text-sm tracking-wide uppercase">Active API Keys</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => toast.info("API key creation coming soon")} className="font-semibold!">
              Create Key
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-xs font-semibold tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Label</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Key Hint</th>
                  <th className="hidden px-4 py-3 md:table-cell">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="bg-card">
                    <td className="px-4 py-3 font-medium text-foreground">{key.label}</td>
                    <td className="hidden px-4 py-3 font-mono text-muted sm:table-cell">{key.keyHint}</td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">{key.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRevoke(key.id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <Title level={5} color="muted" className="mb-4 text-sm tracking-wide uppercase">Security Policies</Title>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {SECURITY_POLICIES.map((policy) => (
              <li key={policy.key} className="flex items-center justify-between gap-4 bg-card px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <Text as="p" weight="semibold">{policy.title}</Text>
                  <Paragraph size="sm" className="mt-0.5 mb-0!">{policy.description}</Paragraph>
                </div>
                <Switch
                  checked={settings[policy.key]}
                  onChange={(checked) => onChange(policy.key, checked)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SettingsSection>
  );
}

export default React.memo(SettingsSecuritySection);
