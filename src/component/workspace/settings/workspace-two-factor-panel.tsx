import { Button, Input } from "antd";
import React, { useCallback, useState } from "react";
import {
  useConfirmOrganizationTwoFactor,
  useDisableOrganizationTwoFactor,
  useOrganizationTwoFactorStatus,
  useSetupOrganizationTwoFactor,
} from "../../../hooks/use-organization-two-factor";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import TwoFactorSetupModal from "../../auth/two-factor-setup-modal";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph, Text } from "../../ui/typography";

function WorkspaceTwoFactorPanel() {
  const { data: status, refetch } = useOrganizationTwoFactorStatus();
  const { mutateAsync: setupTwoFactor, isPending: settingUp } = useSetupOrganizationTwoFactor();
  const { mutateAsync: confirmTwoFactor, isPending: confirming } = useConfirmOrganizationTwoFactor();
  const { mutateAsync: disableTwoFactor, isPending: disabling } = useDisableOrganizationTwoFactor();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const resetSetupState = useCallback(() => {
    setSetupModalOpen(false);
    setSetupSecret(null);
    setOtpauthUrl(null);
    setVerificationCode("");
  }, []);

  const handleOpenSetup = useCallback(async () => {
    setSetupModalOpen(true);

    try {
      const result = await setupTwoFactor();
      setSetupSecret(result.secret);
      setOtpauthUrl(result.otpauthUrl);
    } catch (error) {
      showApiErrorToast(error);
      resetSetupState();
    }
  }, [resetSetupState, setupTwoFactor]);

  const handleConfirm = useCallback(async () => {
    try {
      const result = await confirmTwoFactor(verificationCode);
      showApiSuccessToast(result.message);
      resetSetupState();
      await refetch();
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [confirmTwoFactor, refetch, resetSetupState, verificationCode]);

  const handleDisable = useCallback(async () => {
    try {
      const result = await disableTwoFactor(disableCode);
      showApiSuccessToast(result.message);
      setDisableCode("");
      await refetch();
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [disableCode, disableTwoFactor, refetch]);

  return (
    <>
      <SettingsSection
        id="workspace-two-factor"
        title="Workspace authenticator"
        description="One shared authenticator for the whole organization. Every member enters this same 6-digit code at sign-in after org 2FA is enabled."
      >
        <div className="space-y-4 rounded-2xl border border-border bg-background/50 p-4">
          <Text as="p" weight="semibold">
            Status:{" "}
            {status?.configured
              ? "Configured"
              : status?.pendingSetup
                ? "Setup in progress"
                : "Not configured"}
          </Text>

          {!status?.configured ? (
            <>
              <Paragraph size="sm" className="text-muted">
                Scan the QR code in your authenticator app, confirm the code, then turn on
                &quot;Require Two-Factor Authentication&quot; above.
              </Paragraph>
              <Button type="primary" className="font-semibold!" onClick={() => void handleOpenSetup()}>
                {status?.pendingSetup ? "Continue workspace 2FA setup" : "Set up workspace authenticator"}
              </Button>
            </>
          ) : (
            <>
              <Paragraph size="sm" className="text-muted">
                Workspace authenticator is ready. Enter the current 6-digit code below to remove it
                or rotate to a new device.
              </Paragraph>
              <div className="flex max-w-sm flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={disableCode}
                  onChange={(event) => setDisableCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  maxLength={6}
                  inputMode="numeric"
                />
                <Button
                  danger
                  loading={disabling}
                  className="font-semibold!"
                  onClick={() => void handleDisable()}
                  disabled={disableCode.length !== 6}
                >
                  Remove authenticator
                </Button>
              </div>
            </>
          )}
        </div>
      </SettingsSection>

      <TwoFactorSetupModal
        open={setupModalOpen}
        onClose={resetSetupState}
        secret={setupSecret}
        otpauthUrl={otpauthUrl}
        loading={settingUp && !setupSecret}
        submitting={confirming}
        verificationCode={verificationCode}
        onVerificationCodeChange={setVerificationCode}
        onConfirm={() => void handleConfirm()}
        title="Set up workspace authenticator"
        description="This code is shared by everyone in the organization. Scan the QR code or add the setup key manually, then enter the 6-digit code to confirm."
      />
    </>
  );
}

export default React.memo(WorkspaceTwoFactorPanel);
