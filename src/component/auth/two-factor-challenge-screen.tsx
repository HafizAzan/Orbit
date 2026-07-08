import { Button, Input } from "antd";
import React, { useState } from "react";
import { useVerifyTwoFactor } from "../../hooks/use-two-factor";
import { showApiErrorToast } from "../../lib/api-error";
import type { AuthSessionResponse } from "../../types/auth.types";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Paragraph, Title } from "../ui/typography";

type TwoFactorChallengeScreenProps = {
  challengeToken: string;
  onComplete: (session: AuthSessionResponse) => void;
  onBack: () => void;
};

function TwoFactorChallengeScreen({
  challengeToken,
  onComplete,
  onBack,
}: TwoFactorChallengeScreenProps) {
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const { mutateAsync: verifyTwoFactor, isPending: verifyingTwoFactor } = useVerifyTwoFactor();

  const handleSubmit = async () => {
    if (twoFactorCode.length !== 6) return;

    try {
      const result = await verifyTwoFactor({
        challengeToken,
        code: twoFactorCode,
      });

      onComplete(result);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <AuthFormLayout>
      <AuthFormCard>
        <Title level={2} className="text-3xl text-foreground">
          Two-factor verification
        </Title>
        <Paragraph size="sm" className="mt-2 text-muted">
          Enter the 6-digit workspace authentication code.
        </Paragraph>

        <div className="mt-8 space-y-4">
          <Input
            value={twoFactorCode}
            onChange={(event) =>
              setTwoFactorCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            size="large"
            className="rounded-lg! text-center tracking-[0.4em]!"
            maxLength={6}
            inputMode="numeric"
            autoFocus
          />

          <Button
            type="primary"
            block
            size="large"
            loading={verifyingTwoFactor}
            disabled={twoFactorCode.length !== 6}
            className="h-11! font-semibold!"
            onClick={() => void handleSubmit()}
          >
            Verify and continue
          </Button>

          <Button block size="large" className="h-11! font-medium!" onClick={onBack}>
            Back to login
          </Button>
        </div>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(TwoFactorChallengeScreen);
