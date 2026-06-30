import {
  ClockCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Skeleton } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { useAcceptInvite, useValidateInviteToken } from "../../hooks/user-authentication";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { getPostAuthRedirectPath } from "../../lib/auth-routing";
import { saveAuthSession } from "../../lib/auth-session";
import { getInitial } from "../../lib/helper";
import { cn } from "../../lib/utils";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import type { AcceptInviteFormValues } from "../../types/auth.types";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Text, Title } from "../ui/typography";

function resolveInviteToken(searchParams: URLSearchParams) {
  return searchParams.get("token")?.trim() || searchParams.get("invite")?.trim() || "";
}

function AcceptInviteLoadingState() {
  return (
    <AuthFormLayout>
      <AuthFormCard className="overflow-hidden">
        <Skeleton active paragraph={{ rows: 8 }} title={{ width: "60%" }} />
        <Paragraph size="sm" className="mt-4 text-center text-muted">
          Validating your invitation...
        </Paragraph>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

function AcceptInviteExpiredState({ message }: { message?: string }) {
  return (
    <AuthFormLayout centeredLogo>
      <AuthFormCard className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <ClockCircleOutlined className="text-3xl" />
        </span>

        <Title level={2} className="mt-6 text-3xl text-foreground">
          Invitation unavailable
        </Title>
        <Paragraph size="sm" className="mx-auto mt-3 max-w-md text-muted">
          {message ??
            "This invitation link is invalid or has expired. Ask your workspace admin to send a fresh invite."}
        </Paragraph>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to={UN_AUTH_ROUTES.LOGIN}>
            <Button size="large" className="h-11! min-w-36 font-semibold!">
              Go to login
            </Button>
          </Link>
        </div>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

function AcceptInviteForm() {
  const [form] = Form.useForm<AcceptInviteFormValues>();
  const navigate = useNavigate();
  const app = useAppContext();
  const [searchParams] = useSearchParams();
  const token = resolveInviteToken(searchParams);

  const inviteQuery = useValidateInviteToken(token);
  const { data: invite, isPending: isValidatingInvite, isError, error } = inviteQuery;
  const { mutateAsync: acceptInvite, isPending: isAcceptingInvite } = useAcceptInvite();

  useEffect(() => {
    if (!token) {
      navigate(UN_AUTH_ROUTES.LOGIN, { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!invite) return;
    form.setFieldsValue({ fullName: invite.fullName });
  }, [form, invite]);

  const handleFinish = async (values: AcceptInviteFormValues) => {
    if (!token) return;

    try {
      const result = await acceptInvite({
        token,
        password: values.password,
        fullName: values.fullName.trim(),
      });

      saveAuthSession(result.accessToken, result.user, false);
      app?.setUser(result.user);
      showApiSuccessToast(result.message);
      navigate(getPostAuthRedirectPath(result.user));
    } catch (submitError) {
      showApiErrorToast(submitError);
    }
  };

  if (!token) {
    return null;
  }

  if (isValidatingInvite) {
    return <AcceptInviteLoadingState />;
  }

  if (isError || !invite) {
    return <AcceptInviteExpiredState message={error?.message} />;
  }

  return (
    <AuthFormLayout>
      <AuthFormCard className="overflow-hidden border-primary/10 shadow-md">
        <div className="-mx-6 -mt-6 mb-6 border-b border-border bg-linear-to-br from-feature-sync via-background to-sky-50 px-6 py-5 sm:-mx-8 sm:-mt-8 sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-lg font-bold text-primary shadow-sm">
              {getInitial(invite.organizationName)}
            </span>
            <div className="min-w-0">
              <Text as="p" size="xs" weight="semibold" className="tracking-wide text-primary uppercase">
                Join workspace
              </Text>
              <Title level={2} className="mt-1 mb-0! text-2xl text-foreground sm:text-3xl">
                {invite.organizationName}
              </Title>
              <Paragraph size="sm" className="mt-1 mb-0! text-muted">
                <Text weight="medium">{invite.inviterName}</Text> invited you to join as{" "}
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-xs font-bold",
                    invite.role === "admin" && "border-violet-200 bg-violet-50 text-violet-700",
                    invite.role === "manager" && "border-sky-200 bg-sky-50 text-sky-700",
                    invite.role === "member" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                    invite.role !== "admin" && invite.role !== "manager" && invite.role !== "member" &&
                      "border-border bg-background text-foreground",
                  )}
                >
                  {invite.roleLabel}
                </span>
              </Paragraph>
            </div>
          </div>
        </div>

        <Paragraph size="sm" className="text-muted">
          Complete your account to access projects, tasks, and team collaboration in{" "}
          <Text weight="medium">{invite.organizationName}</Text>.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-6 [&_.ant-form-item]:mb-5"
          onFinish={handleFinish}
        >
          <Form.Item label={<Label>Work email</Label>}>
            <Input
              value={invite.email}
              disabled
              size="large"
              prefix={<MailOutlined className="text-muted" />}
              suffix={<LockOutlined className="text-muted" />}
              className="rounded-lg! bg-background!"
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label={<Label>Full name</Label>}
            rules={[
              { required: true, message: "Please enter your full name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input
              placeholder="Alex Johnson"
              size="large"
              prefix={<UserOutlined className="text-muted" />}
              className="rounded-lg!"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
            <Form.Item
              name="password"
              label={<Label>Create password</Label>}
              rules={[
                { required: true, message: "Please enter a password" },
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

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isAcceptingInvite}
            className="mt-1 h-11! font-semibold!"
          >
            Accept invitation & join workspace
          </Button>
        </Form>

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

export default React.memo(AcceptInviteForm);
