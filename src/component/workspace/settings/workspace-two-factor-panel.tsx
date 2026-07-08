import { Button } from "antd";
import React, { useCallback, useState } from "react";
import { useEnableTwoFactor, useSetupTwoFactor, useTwoFactorStatus } from "../../../hooks/use-two-factor";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import TwoFactorSetupModal from "../../auth/two-factor-setup-modal";
import SettingsSection from "../../admin/settings/settings-section";
import { Paragraph, Text } from "../../ui/typography";

function WorkspaceTwoFactorPanel() {
  const { data: status, refetch } = useTwoFactorStatus();
  const { mutateAsync: setupTwoFactor, isPending: settingUp } = useSetupTwoFactor();
  const { mutateAsync: enableTwoFactor, isPending: enabling } = useEnableTwoFactor();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

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

  const handleEnable = useCallback(async () => {
    try {
      const result = await enableTwoFactor(verificationCode);
      showApiSuccessToast(result.message);
      resetSetupState();
      await refetch();
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [enableTwoFactor, refetch, resetSetupState, verificationCode]);

  return (
    <>
      <SettingsSection
        id="workspace-two-factor"
        title="Owner / admin authenticator"
        description="Set up your personal authenticator here before turning on workspace 2FA. Other roles must contact an owner or admin if they cannot sign in."
      >
        <div className="space-y-4 rounded-2xl border border-border bg-background/50 p-4">
          <Text as="p" weight="semibold">
            Status: {status?.enabled ? "Enabled" : status?.pendingSetup ? "Setup in progress" : "Not enabled"}
          </Text>

          {!status?.enabled ? (
            <>
              <Paragraph size="sm" className="text-muted">
                Scan the QR code in your authenticator app, then save the workspace setting to require 2FA.
              </Paragraph>
              <Button type="primary" className="font-semibold!" onClick={() => void handleOpenSetup()}>
                {status?.pendingSetup ? "Continue 2FA setup" : "Set up authenticator"}
              </Button>
            </>
          ) : (
            <Paragraph size="sm" className="text-muted">
              Your authenticator is ready. After workspace 2FA is enabled, sign-in will ask for your 6-digit code.
            </Paragraph>
          )}
        </div>
      </SettingsSection>

      <TwoFactorSetupModal
        open={setupModalOpen}
        onClose={resetSetupState}
        secret={setupSecret}
        otpauthUrl={otpauthUrl}
        loading={settingUp && !setupSecret}
        submitting={enabling}
        verificationCode={verificationCode}
        onVerificationCodeChange={setVerificationCode}
        onConfirm={() => void handleEnable()}
        title="Set up authenticator app"
        description="Scan the QR code or add the setup key manually, then enter the 6-digit code to finish."
      />
    </>
  );
}

export default React.memo(WorkspaceTwoFactorPanel);
