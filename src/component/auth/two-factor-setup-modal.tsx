import { CopyOutlined } from "@ant-design/icons";
import { Button, Input, QRCode, Spin } from "antd";
import React, { useCallback } from "react";
import { toast } from "../../lib/toast";
import Modal from "../ui/modal";
import { Paragraph, Text, Title } from "../ui/typography";

type TwoFactorSetupModalProps = {
  open: boolean;
  onClose: () => void;
  secret: string | null;
  otpauthUrl: string | null;
  loading?: boolean;
  submitting?: boolean;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.");
  } catch {
    toast.error("Unable to copy. Please copy manually.");
  }
}

function TwoFactorSetupModal({
  open,
  onClose,
  secret,
  otpauthUrl,
  loading = false,
  submitting = false,
  verificationCode,
  onVerificationCodeChange,
  onConfirm,
  title = "Set up authenticator app",
  description = "Scan the QR code or enter the setup key in Google Authenticator, Authy, or another TOTP app.",
}: TwoFactorSetupModalProps) {
  const handleCopySecret = useCallback(() => {
    if (!secret) return;
    void copyToClipboard(secret);
  }, [secret]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnHidden
      maskClosable={!submitting}
      closable={!submitting}
    >
      <div className="space-y-5">
        <div>
          <Title level={4} className="mb-1! text-foreground">
            {title}
          </Title>
          <Paragraph size="sm" color="muted" className="mb-0!">
            {description}
          </Paragraph>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/50 p-5">
              {otpauthUrl ? (
                <QRCode
                  value={otpauthUrl}
                  size={192}
                  bordered={false}
                  className="rounded-xl bg-white p-3"
                />
              ) : null}

              <Paragraph size="sm" className="mb-0! text-center text-muted">
                Can&apos;t scan? Use this setup key instead:
              </Paragraph>

              <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                <code className="min-w-0 flex-1 truncate text-sm">{secret ?? "—"}</code>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  aria-label="Copy setup key"
                  disabled={!secret}
                  onClick={handleCopySecret}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Text as="p" size="sm" weight="semibold">
                Enter the 6-digit code from your app
              </Text>
              <Input
                value={verificationCode}
                onChange={(event) =>
                  onVerificationCodeChange(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                size="large"
                className="rounded-xl! text-center tracking-[0.4em]!"
                maxLength={6}
                inputMode="numeric"
                autoFocus
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button size="large" className="rounded-xl! font-medium!" disabled={submitting} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                className="rounded-xl! font-semibold!"
                loading={submitting}
                disabled={!secret || verificationCode.length !== 6}
                onClick={onConfirm}
              >
                Verify and enable
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default React.memo(TwoFactorSetupModal);
