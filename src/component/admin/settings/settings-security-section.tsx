import { CopyOutlined, DeleteOutlined, KeyOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Skeleton, Switch, Tooltip } from "antd";
import React, { useState } from "react";
import { SECURITY_POLICIES, type PlatformSettings } from "../../../data/admin-settings";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "../../../hooks/use-admin-api-keys";
import { showApiErrorToast } from "../../../lib/api-error";
import { toast } from "../../../lib/toast";
import { Paragraph, Text, Title } from "../../ui/typography";
import { ConfirmModal } from "../../ui/modal";
import SettingsSection from "./settings-section";

type SettingsSecuritySectionProps = {
  settings: PlatformSettings;
  onChange: <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => void;
};

function SettingsSecuritySection({ settings, onChange }: SettingsSecuritySectionProps) {
  const { data: apiKeys = [], isLoading: keysLoading } = useApiKeys();
  const { mutateAsync: createKey, isPending: creating } = useCreateApiKey();
  const { mutateAsync: revokeKey, isPending: revoking } = useRevokeApiKey();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [revealedLabel, setRevealedLabel] = useState<string>("");
  const [pendingRevoke, setPendingRevoke] = useState<string | null>(null);

  const [createForm] = Form.useForm<{ label: string }>();

  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const result = await createKey({ label: values.label });
      createForm.resetFields();
      setCreateModalOpen(false);
      setRevealedSecret(result.key.secret);
      setRevealedLabel(result.key.label);
      setSecretModalOpen(true);
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) return;
      showApiErrorToast(error);
    }
  };

  const handleCopySecret = () => {
    if (!revealedSecret) return;
    void navigator.clipboard.writeText(revealedSecret);
    toast.success("API key copied to clipboard.");
  };

  const handleRevokeConfirm = async () => {
    if (!pendingRevoke) return;
    try {
      await revokeKey(pendingRevoke);
      toast.success("API key revoked successfully.");
      setPendingRevoke(null);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
            <Title level={5} color="muted" className="text-sm tracking-wide uppercase">
              Active API Keys
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
              className="font-semibold!"
            >
              Create Key
            </Button>
          </div>

          {keysLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : apiKeys.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
              <Text as="p" weight="semibold" className="mb-1!">
                No API keys yet
              </Text>
              <Paragraph size="sm" color="muted" className="mb-0!">
                Create a platform API key to authenticate external integrations.
              </Paragraph>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border">
              {apiKeys.map((key) => (
                <li key={key.id} className="flex flex-wrap items-center justify-between gap-4 bg-card px-4 py-4 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <KeyOutlined />
                    </span>
                    <div className="min-w-0">
                      <Text as="p" weight="semibold" className="truncate">
                        {key.label}
                      </Text>
                      <Paragraph size="xs" color="muted" className="mb-0! font-mono">
                        {key.keyHint} · Created {formatDate(key.createdAt)} · Last used {formatDate(key.lastUsedAt)}
                      </Paragraph>
                    </div>
                  </div>
                  <Tooltip title="Revoke key">
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      loading={revoking && pendingRevoke === key.id}
                      onClick={() => setPendingRevoke(key.id)}
                      className="shrink-0"
                    >
                      Revoke
                    </Button>
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Title level={5} color="muted" className="mb-4 text-sm tracking-wide uppercase">
            Security Policies
          </Title>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {SECURITY_POLICIES.map((policy) => (
              <li key={policy.key} className="flex items-center justify-between gap-4 bg-card px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <Text as="p" weight="semibold">
                    {policy.title}
                  </Text>
                  <Paragraph size="sm" className="mt-0.5 mb-0!">
                    {policy.description}
                  </Paragraph>
                </div>
                <Switch checked={settings[policy.key]} onChange={(checked) => onChange(policy.key, checked)} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Create API key modal */}
      <Modal
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={() => void handleCreate()}
        okText="Create key"
        cancelText="Cancel"
        title="Create API key"
        confirmLoading={creating}
        centered
        classNames={{
          container: "rounded-2xl! overflow-hidden! shadow-xl!",
          header: "mb-0! border-b border-border px-6! py-4!",
          body: "px-6! py-5!",
          footer: "mt-0! border-t border-border px-6! py-4!",
        }}
      >
        <Paragraph size="sm" color="muted" className="mb-4!">
          Give this key a descriptive label so you can identify it later. The full secret is shown only once after creation.
        </Paragraph>
        <Form form={createForm} layout="vertical" requiredMark={false}>
          <Form.Item
            name="label"
            label={<Text size="sm" weight="medium">Label</Text>}
            rules={[{ required: true, message: "Please enter a label for this key" }]}
          >
            <Input placeholder="e.g. CI pipeline, Zapier integration" className="rounded-xl! border-border! bg-background!" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reveal secret modal */}
      <Modal
        open={secretModalOpen}
        onCancel={() => {
          setSecretModalOpen(false);
          setRevealedSecret(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button icon={<CopyOutlined />} onClick={handleCopySecret}>
              Copy
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSecretModalOpen(false);
                setRevealedSecret(null);
              }}
            >
              Done
            </Button>
          </div>
        }
        title={`API key created: ${revealedLabel}`}
        centered
        classNames={{
          container: "rounded-2xl! overflow-hidden! shadow-xl!",
          header: "mb-0! border-b border-border px-6! py-4!",
          body: "px-6! py-5!",
          footer: "mt-0! border-t border-border px-6! py-4!",
        }}
      >
        <Paragraph size="sm" color="muted" className="mb-3!">
          Copy this key now. For security, it will not be shown again.
        </Paragraph>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
          <code className="flex-1 break-all font-mono text-sm text-foreground">{revealedSecret}</code>
          <Button size="small" icon={<CopyOutlined />} onClick={handleCopySecret} className="shrink-0" />
        </div>
      </Modal>

      {/* Revoke confirm modal */}
      <ConfirmModal
        open={pendingRevoke !== null}
        onClose={() => setPendingRevoke(null)}
        onConfirm={() => void handleRevokeConfirm()}
        title="Revoke API key"
        description="This key will be permanently revoked and any integrations using it will stop working immediately. This cannot be undone."
        confirmText="Revoke key"
        confirmDanger
        confirmLoading={revoking}
        icon={<DeleteOutlined />}
      />
    </SettingsSection>
  );
}

export default React.memo(SettingsSecuritySection);
