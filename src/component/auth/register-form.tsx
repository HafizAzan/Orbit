import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSendRegisterOtp } from "../../hooks/user-authentication";
import { generateOrganizationSlug } from "../../lib/organization";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { saveOtpSession } from "../../lib/otp-session";
import { cn } from "../../lib/utils";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import type { RegisterFormValues } from "../../types/auth.types";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Text, Title } from "../ui/typography";

const WORKSPACE_DOMAIN = "Orbit.io";

function RegisterForm() {
  const [form] = Form.useForm<RegisterFormValues>();
  const navigate = useNavigate();
  const [slugTouched, setSlugTouched] = useState(false);
  const organizationName = Form.useWatch("organizationName", form) ?? "";
  const { mutateAsync: sendRegisterOtp, isPending: isSendingOtp } = useSendRegisterOtp();

  const previewSlug = useMemo(() => {
    if (!organizationName.trim()) {
      return "your-workspace";
    }

    return generateOrganizationSlug(organizationName);
  }, [organizationName]);

  useEffect(() => {
    if (!slugTouched && organizationName.trim()) {
      form.setFieldValue("organizationSlug", generateOrganizationSlug(organizationName));
    }
  }, [organizationName, slugTouched, form]);

  const handleFinish = async (values: RegisterFormValues) => {
    try {
      const normalizedEmail = values.email.trim().toLowerCase();

      const result = await sendRegisterOtp({
        fullName: values.fullName,
        organizationName: values.organizationName,
        organizationSlug: values.organizationSlug,
        email: normalizedEmail,
        password: values.password,
        authProvider: "email",
        signupSource: "direct",
        kindOfUser: "owner",
      });

      saveOtpSession({
        email: normalizedEmail,
        flow: "register",
        expiresAt: result.expiresAt,
      });

      showApiSuccessToast(result.message);

      const verifyUrl = `${UN_AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(normalizedEmail)}&flow=register`;
      navigate(verifyUrl, {
        state: {
          email: normalizedEmail,
          flow: "register",
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <AuthFormLayout>
      <AuthFormCard>
        <Title level={2} className="text-3xl text-foreground">
          Create your account
        </Title>
        <Paragraph size="sm" className="mt-2 text-muted">
          Start your 14-day free trial and set up your organization.
        </Paragraph>

        <Form form={form} layout="vertical" requiredMark={false} className="mt-8 [&_.ant-form-item]:mb-5" onFinish={handleFinish}>
          <Form.Item name="fullName" label={<Label>Full name</Label>} rules={[{ required: true, message: "Please enter your full name" }]}>
            <Input placeholder="John Doe" size="large" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="organizationName"
            label={<Label>Organization name</Label>}
            rules={[
              { required: true, message: "Please enter your organization name" },
              { min: 2, message: "Organization name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Acme Corp" size="large" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="organizationSlug"
            label={<Label>Workspace slug</Label>}
            rules={[
              { required: true, message: "Please enter a workspace slug" },
              { min: 2, message: "Slug must be at least 2 characters" },
              {
                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Use lowercase letters, numbers, and hyphens only",
              },
            ]}
          >
            {slugTouched ? (
              <Input
                placeholder="your-workspace"
                size="large"
                className="rounded-lg! font-mono"
                addonAfter={`.${WORKSPACE_DOMAIN}`}
                onChange={() => setSlugTouched(true)}
              />
            ) : (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-left transition-colors hover:border-primary/30"
                onClick={() => setSlugTouched(true)}
              >
                <span className="min-w-0 flex-1 truncate font-mono text-sm">
                  <Text className={cn("font-semibold", organizationName.trim() ? "text-primary" : "text-muted")}>{previewSlug}</Text>
                  <Text color="muted">.{WORKSPACE_DOMAIN}</Text>
                </span>
                <span className="shrink-0 rounded-full bg-feature-sync px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                  Auto
                </span>
              </button>
            )}
          </Form.Item>

          {!slugTouched ? (
            <Text size="xs" color="muted" className="-mt-3 mb-1 block">
              Generated from your organization name.{" "}
              <button type="button" className="font-medium text-primary hover:opacity-80" onClick={() => setSlugTouched(true)}>
                Customize
              </button>
            </Text>
          ) : (
            <Text size="xs" color="muted" className="-mt-3 mb-1 block">
              <button
                type="button"
                className="font-medium text-primary hover:opacity-80"
                onClick={() => {
                  setSlugTouched(false);
                  if (organizationName.trim()) {
                    form.setFieldValue("organizationSlug", generateOrganizationSlug(organizationName));
                  }
                }}
              >
                Use auto-generated slug
              </button>
            </Text>
          )}

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

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
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

            <Form.Item
              name="confirmPassword"
              label={<Label>Confirm password</Label>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="••••••••" size="large" className="rounded-lg!" />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={isSendingOtp} className="h-11! font-semibold!">
            Create Account
          </Button>
        </Form>

        <Divider plain className="my-8! text-xs! font-medium! tracking-wider! text-muted! uppercase">
          Or continue with
        </Divider>

        <div className="grid grid-cols-2 gap-3">
          <Button size="large" icon={<GoogleOutlined />} className="h-11! font-medium!">
            Google
          </Button>
          <Button size="large" icon={<GithubOutlined />} className="h-11! font-medium!">
            GitHub
          </Button>
        </div>

        <Paragraph size="sm" className="mt-8 text-center text-muted">
          Already have an account?{" "}
          <Link to={UN_AUTH_ROUTES.LOGIN} className="font-semibold text-primary hover:opacity-80">
            Log in
          </Link>
        </Paragraph>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(RegisterForm);
