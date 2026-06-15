import { ArrowLeftOutlined, ClockCircleOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { useOtpCountdown } from "../../hooks/use-otp-countdown";
import {
  useRegisterPending,
  useResendRegisterOtp,
  useVerifyRegister,
} from "../../hooks/user-authentication";
import { getPostAuthRedirectPath } from "../../lib/auth-routing";
import { saveAuthSession } from "../../lib/auth-session";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { clearOtpSession, getOtpSession, saveOtpSession } from "../../lib/otp-session";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import type { VerifyOtpLocationState } from "../../types/auth.types";
import AnimateOnScroll from "../common/animate-on-scroll";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Text, Title } from "../ui/typography";

type VerifyOtpFormValues = {
  otp: string;
};

function VerifyOtpForm() {
  const [form] = Form.useForm<VerifyOtpFormValues>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const app = useAppContext();

  const state = (location.state as VerifyOtpLocationState | null) ?? null;
  const emailFromQuery = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const flowFromQuery = searchParams.get("flow");
  const email = emailFromQuery || state?.email?.trim().toLowerCase() || "";
  const flow = flowFromQuery || state?.flow;

  const session = email ? getOtpSession(email) : null;
  const [expiresAt, setExpiresAt] = useState<string | null>(
    state?.expiresAt ?? session?.expiresAt ?? null,
  );

  const {
    data: pendingRegistration,
    isLoading: isPendingLoading,
    isError: isPendingError,
    error: pendingError,
    refetch: refetchPending,
  } = useRegisterPending(email, flow === "register");

  const { mutateAsync: verifyRegister, isPending: isVerifying } = useVerifyRegister();
  const { mutateAsync: resendRegisterOtp, isPending: isResendingRegister } = useResendRegisterOtp();

  useEffect(() => {
    if (!email || flow !== "register") {
      navigate(UN_AUTH_ROUTES.LOGIN, { replace: true });
    }
  }, [email, flow, navigate]);

  useEffect(() => {
    if (pendingRegistration?.expiresAt) {
      setExpiresAt(pendingRegistration.expiresAt);
      saveOtpSession({
        email: pendingRegistration.email,
        flow: "register",
        expiresAt: pendingRegistration.expiresAt,
      });
    }
  }, [pendingRegistration]);

  const { formattedTime, isExpired } = useOtpCountdown(expiresAt);

  const pendingExpiredMessage = useMemo(() => {
    if (!isPendingError || !pendingError) return null;
    return pendingError.message;
  }, [isPendingError, pendingError]);

  if (!email || flow !== "register") {
    return null;
  }

  const handleResend = async () => {
    try {
      const result = await resendRegisterOtp(email);
      setExpiresAt(result.expiresAt);
      saveOtpSession({ email, flow: "register", expiresAt: result.expiresAt });
      showApiSuccessToast(result.message);
      await refetchPending();
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const handleFinish = async (values: VerifyOtpFormValues) => {
    try {
      const result = await verifyRegister({ email, otp: values.otp });
      clearOtpSession(email);
      saveAuthSession(result.accessToken, result.user);
      app?.setUser(result.user);
      showApiSuccessToast(result.message);
      navigate(getPostAuthRedirectPath(result.user));
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const showExpiredState = isExpired || Boolean(pendingExpiredMessage);

  return (
    <AuthFormLayout centeredLogo>
      <AuthFormCard>
        <AnimateOnScroll immediate variant="scale-in" delay={150}>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <SafetyCertificateOutlined className="text-xl text-primary" />
          </div>
        </AnimateOnScroll>

        <Title level={2} className="text-center text-3xl text-foreground">
          Verify your email
        </Title>

        <Paragraph size="sm" className="mt-2 text-center text-muted">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>. Enter it below to complete
          your signup.
        </Paragraph>

        {expiresAt ? (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <ClockCircleOutlined className={isExpired ? "text-danger" : "text-primary"} />
            <Text size="sm" className={isExpired ? "text-danger font-medium" : "text-muted"}>
              {isPendingLoading
                ? "Checking code expiry..."
                : isExpired
                  ? "Code expired"
                  : `Code expires in ${formattedTime}`}
            </Text>
          </div>
        ) : null}

        {pendingExpiredMessage ? (
          <Paragraph size="sm" className="mt-3 text-center text-danger">
            {pendingExpiredMessage}
          </Paragraph>
        ) : null}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-8 [&_.ant-form-item]:mb-5"
          onFinish={handleFinish}
        >
          <Form.Item
            name="otp"
            label={<Label className="block text-center">Verification code</Label>}
            className="[&_.ant-form-item-label]:text-center"
            rules={[
              { required: true, message: "Please enter the verification code" },
              { len: 6, message: "Code must be 6 digits" },
              { pattern: /^\d{6}$/, message: "Code must contain only numbers" },
            ]}
          >
            <Input.OTP
              length={6}
              size="large"
              className="justify-center!"
              formatter={(value) => value.replace(/\D/g, "")}
              disabled={showExpiredState}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isVerifying}
            disabled={showExpiredState}
            className="h-11! font-semibold!"
          >
            Verify &amp; continue
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <Button
            type="link"
            icon={<MailOutlined />}
            loading={isResendingRegister}
            onClick={handleResend}
            className="h-auto! p-0! font-medium! text-muted! hover:text-primary!"
          >
            Resend code
          </Button>
        </div>

        <Divider className="my-8!" />

        <div className="text-center">
          <Link
            to={UN_AUTH_ROUTES.REGISTER}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeftOutlined className="text-xs" />
            Back to sign up
          </Link>
        </div>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(VerifyOtpForm);
