import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { useLogin } from "../../hooks/user-authentication";
import { AUTH_ERROR_CODES, ApiRequestError, showApiErrorToast, showApiInfoToast, showApiSuccessToast } from "../../lib/api-error";
import { getPostAuthRedirectPath } from "../../lib/auth-routing";
import { saveAuthSession } from "../../lib/auth-session";
import { saveOtpSession } from "../../lib/otp-session";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import API_ROUTES from "../../router/api-routes";
import { isTwoFactorChallengeResponse, type LoginFormValues } from "../../types/auth.types";
import TwoFactorChallengeScreen from "./two-factor-challenge-screen";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Text, Title } from "../ui/typography";

function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const app = useAppContext();
  const { mutateAsync: login, isPending: loggingIn } = useLogin();
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (!oauthError) return;
    showApiErrorToast(decodeURIComponent(oauthError));
    const next = new URLSearchParams(searchParams);
    next.delete("error");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const completeSession = (
    accessToken: string,
    refreshToken: string,
    user: Parameters<typeof saveAuthSession>[1],
    remember: boolean,
    message: string,
  ) => {
    saveAuthSession(accessToken, user, remember, refreshToken);
    app?.setUser(user);
    showApiSuccessToast(message);
    navigate(getPostAuthRedirectPath(user));
  };

  const resetTwoFactorState = () => {
    setChallengeToken(null);
  };

  const handleFinish = async (values: LoginFormValues) => {
    try {
      const remember = values.remember === true;
      setRememberMe(remember);

      const result = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        remember,
      });

      if (isTwoFactorChallengeResponse(result)) {
        setChallengeToken(result.challengeToken);
        showApiInfoToast(result.message);
        return;
      }

      completeSession(result.accessToken, result.refreshToken, result.user, remember, result.message);
    } catch (error) {
      if (error instanceof ApiRequestError && error.code === AUTH_ERROR_CODES.PENDING_EMAIL_VERIFICATION && error.email) {
        const normalizedEmail = error.email.trim().toLowerCase();
        const expiresAt = error.expiresAt ?? null;

        if (expiresAt) {
          saveOtpSession({
            email: normalizedEmail,
            flow: "register",
            expiresAt,
          });
        }

        showApiInfoToast(error.message);
        navigate(`${UN_AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(normalizedEmail)}&flow=register`, {
          state: {
            email: normalizedEmail,
            flow: "register",
            expiresAt: expiresAt ?? undefined,
          },
        });
        return;
      }

      showApiErrorToast(error);
    }
  };

  if (challengeToken) {
    return (
      <TwoFactorChallengeScreen
        challengeToken={challengeToken}
        onBack={resetTwoFactorState}
        onComplete={(session) => {
          completeSession(session.accessToken, session.refreshToken, session.user, rememberMe, session.message);
        }}
      />
    );
  }

  return (
    <AuthFormLayout>
      <AuthFormCard>
        <Title level={2} className="text-3xl text-foreground">
          Welcome back
        </Title>
        <Paragraph size="sm" className="mt-2 text-muted">
          Please enter your details to sign in.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-8 [&_.ant-form-item]:mb-5"
          initialValues={{ remember: true }}
          onFinish={handleFinish}
        >
          <Form.Item
            name="email"
            label={<Label>Email</Label>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="name@company.com" size="large" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Label>Password</Label>}
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" className="rounded-lg!" />
          </Form.Item>

          <div className="mb-6 flex items-center justify-between gap-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>
                <Text size="sm" color="muted">
                  Remember me
                </Text>
              </Checkbox>
            </Form.Item>

            <Link to={UN_AUTH_ROUTES.FORGOT_PASSWORD} className="text-sm font-medium text-primary hover:opacity-80">
              Forgot password?
            </Link>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loggingIn} className="h-11! font-semibold!">
            Log in
          </Button>
        </Form>

        <Divider plain className="my-8! text-xs! font-medium! tracking-wider! text-muted! uppercase">
          Or continue with
        </Divider>

        <div className="grid grid-cols-2 gap-3">
          <Button
            size="large"
            icon={<GoogleOutlined />}
            className="h-11! font-medium!"
            onClick={() => {
              window.location.assign(`${import.meta.env.VITE_API_URL}${API_ROUTES.AUTH.GOOGLE}`);
            }}
          >
            Google
          </Button>
          <Button
            size="large"
            icon={<GithubOutlined />}
            className="h-11! font-medium!"
            onClick={() => {
              window.location.assign(`${import.meta.env.VITE_API_URL}${API_ROUTES.AUTH.GITHUB}`);
            }}
          >
            GitHub
          </Button>
        </div>

        <Paragraph size="sm" className="mt-8 text-center text-muted">
          Don&apos;t have an account?{" "}
          <Link to={UN_AUTH_ROUTES.REGISTER} className="font-semibold text-primary hover:opacity-80">
            Sign up for free
          </Link>
        </Paragraph>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(LoginForm);
