import { ArrowLeftOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import {
  loginAccount,
  registerAccount,
  sendOtp,
  verifyOtp,
  type AuthFlow,
  type RegisterAccountInput,
} from "../../lib/auth";
import { toast } from "../../lib/toast";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import AnimateOnScroll from "../common/animate-on-scroll";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Title } from "../ui/typography";

type VerifyOtpFormValues = {
  otp: string;
};

export type VerifyOtpLocationState = {
  email: string;
  flow: AuthFlow;
  registerData?: RegisterAccountInput;
};

function VerifyOtpForm() {
  const [form] = Form.useForm<VerifyOtpFormValues>();
  const location = useLocation();
  const navigate = useNavigate();
  const app = useAppContext();
  const [isResending, setIsResending] = useState(false);

  const state = (location.state as VerifyOtpLocationState | null) ?? null;
  const email = state?.email;
  const flow = state?.flow;
  const registerData = state?.registerData;

  useEffect(() => {
    if (!email || !flow) {
      navigate(UN_AUTH_ROUTES.LOGIN, { replace: true });
    }
  }, [email, flow, navigate]);

  if (!email || !flow) {
    return null;
  }

  const handleResend = async () => {
    try {
      setIsResending(true);
      const code = await sendOtp(email);
      toast.success(
        import.meta.env.DEV
          ? `A new verification code was sent to ${email}. Demo code: ${code}`
          : `A new verification code was sent to ${email}`,
      );
    } catch {
      toast.error("Unable to resend the code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleFinish = async (values: VerifyOtpFormValues) => {
    try {
      app?.setIsLoading(true);

      const isValid = await verifyOtp(email, values.otp);
      if (!isValid) {
        toast.error("Invalid or expired code. Please try again.");
        return;
      }

      if (flow === "register") {
        if (!registerData) {
          toast.error("Registration details are missing. Please sign up again.");
          navigate(UN_AUTH_ROUTES.REGISTER, { replace: true });
          return;
        }

        const user = await registerAccount(registerData);
        app?.setUser(user);
        toast.success(`${user.organization.name} created successfully. You are now the organization owner.`);
      } else {
        const user = await loginAccount(email);
        app?.setUser(user);
        toast.success(`Welcome back! Signed in as ${user.email}`);
      }

      navigate(UN_AUTH_ROUTES.HOME);
    } catch {
      toast.error("Unable to verify your code. Please try again.");
    } finally {
      app?.setIsLoading(false);
    }
  };

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
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={app?.isLoading}
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
