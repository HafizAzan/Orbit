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
import {
  loginAccount,
  sendOtp,
  verifyOtp,
  type AuthFlow,
} from "../../lib/auth";
import { getPostAuthRedirectPath } from "../../lib/auth-routing";
import { saveAuthSession } from "../../lib/auth-session";
import { clearOtpSession, getOtpSession, saveOtpSession } from "../../lib/otp-session";
import { toast } from "../../lib/toast";
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
  const flowFromQuery = searchParams.get("flow") as AuthFlow | null;
  const email = emailFromQuery || state?.email?.trim().toLowerCase() || "";
  const flow = flowFromQuery || state?.flow;
  const isRegisterFlow = flow === "register";

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
  } = useRegisterPending(email, isRegisterFlow);

  const { mutateAsync: verifyRegister, isPending: isVerifying } = useVerifyRegister();
  const { mutateAsync: resendRegisterOtp, isPending: isResendingRegister } = useResendRegisterOtp();
  const [isResendingLogin, setIsResendingLogin] = useState(false);

  useEffect(() => {
    if (!email || !flow) {
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

  if (!email || !flow) {
    return null;
  }

  const handleResend = async () => {
    try {
      if (isRegisterFlow) {
        const result = await resendRegisterOtp(email);
        setExpiresAt(result.expiresAt);
        saveOtpSession({ email, flow: "register", expiresAt: result.expiresAt });
        toast.success(
          import.meta.env.DEV && result.devOtp
            ? `${result.message}. Demo code: ${result.devOtp}`
            : result.message,
        );
        await refetchPending();
        return;
      }

      setIsResendingLogin(true);
      const code = await sendOtp(email);
      toast.success(
        import.meta.env.DEV
          ? `A new verification code was sent to ${email}. Demo code: ${code}`
          : `A new verification code was sent to ${email}`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to resend the code. Please try again.");
    } finally {
      setIsResendingLogin(false);
    }
  };

  const handleFinish = async (values: VerifyOtpFormValues) => {
    try {
      if (isRegisterFlow) {
        if (isExpired) {
          toast.error("Verification code has expired. Please resend a new code.");
          return;
        }

        const result = await verifyRegister({ email, otp: values.otp });
        clearOtpSession(email);
        saveAuthSession(result.accessToken, result.user);
        app?.setUser(result.user);
        toast.success(result.message);
        navigate(getPostAuthRedirectPath(result.user));
        return;
      }

      app?.setIsLoading(true);

      const isValid = await verifyOtp(email, values.otp);
      if (!isValid) {
        toast.error("Invalid or expired code. Please try again.");
        return;
      }

      const mockUser = await loginAccount(email);
      const sessionUser = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        isPlatformAdmin: false,
        emailVerificationStatus: "verified" as const,
        accountStatus: "active" as const,
        organization: mockUser.organization,
      };
      app?.setUser(sessionUser);
      toast.success(`Welcome back! Signed in as ${mockUser.email}`);
      navigate(getPostAuthRedirectPath(sessionUser));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to verify your code. Please try again.");
    } finally {
      app?.setIsLoading(false);
    }
  };

  const isResending = isRegisterFlow ? isResendingRegister : isResendingLogin;
  const isSubmitting = isRegisterFlow ? isVerifying : app?.isLoading;
  const showExpiredState = isRegisterFlow && (isExpired || Boolean(pendingExpiredMessage));

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
          <span className="font-medium text-foreground">{email}</span>. Enter it below to{" "}
          {flow === "register" ? "complete your signup" : "sign in"}.
        </Paragraph>

        {isRegisterFlow && expiresAt ? (
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

        {showExpiredState ? (
          <Paragraph size="sm" className="mt-3 text-center text-danger">
            {pendingExpiredMessage ?? "Your verification code has expired. Resend a new code to continue."}
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
            loading={isSubmitting}
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
            loading={isResending}
            onClick={handleResend}
            className="h-auto! p-0! font-medium! text-muted! hover:text-primary!"
          >
            Resend code
          </Button>
        </div>

        <Divider className="my-8!" />

        <div className="text-center">
          <Link
            to={flow === "register" ? UN_AUTH_ROUTES.REGISTER : UN_AUTH_ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeftOutlined className="text-xs" />
            Back to {flow === "register" ? "sign up" : "login"}
          </Link>
        </div>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(VerifyOtpForm);
