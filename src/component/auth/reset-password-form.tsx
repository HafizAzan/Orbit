import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPassword, useValidateResetToken } from "../../hooks/user-authentication";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import type { ResetPasswordFormValues } from "../../types/auth.types";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Text, Title } from "../ui/typography";

function ResetPasswordForm() {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const { data: tokenValidation, isLoading: isValidating, isError: isTokenInvalid, error: tokenError } =
    useValidateResetToken(token);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  useEffect(() => {
    if (!token) {
      navigate(UN_AUTH_ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [token, navigate]);

  const handleFinish = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    try {
      const result = await resetPassword({
        token,
        password: values.password,
      });

      showApiSuccessToast(result.message);
      navigate(UN_AUTH_ROUTES.LOGIN);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  if (!token) {
    return null;
  }

  if (isValidating) {
    return (
      <AuthFormLayout>
        <AuthFormCard>
          <Paragraph size="sm" className="text-center text-muted">
            Validating your reset link...
          </Paragraph>
        </AuthFormCard>
      </AuthFormLayout>
    );
  }

  if (isTokenInvalid) {
    return (
      <AuthFormLayout>
        <AuthFormCard>
          <Title level={2} className="text-3xl text-foreground">
            Reset link expired
          </Title>
          {tokenError?.message ? (
            <Paragraph size="sm" className="mt-2 text-muted">
              {tokenError.message}
            </Paragraph>
          ) : null}
          <Link
            to={UN_AUTH_ROUTES.FORGOT_PASSWORD}
            className="mt-8 inline-flex font-semibold text-primary hover:opacity-80"
          >
            Request a new reset link
          </Link>
        </AuthFormCard>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <AuthFormCard>
        <Title level={2} className="text-3xl text-foreground">
          Reset your password
        </Title>
        <Paragraph size="sm" className="mt-2 text-muted">
          Create a new password for{" "}
          <Text weight="medium">{tokenValidation?.email}</Text>. It must be at
          least 8 characters long.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-8 [&_.ant-form-item]:mb-5"
          onFinish={handleFinish}
        >
          <Form.Item
            name="password"
            label={<Label>New password</Label>}
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" className="rounded-lg!" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<Label>Confirm new password</Label>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
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

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isPending}
            className="h-11! font-semibold!"
          >
            Reset password
          </Button>
        </Form>

        <Paragraph size="sm" className="mt-8 text-center text-muted">
          Remember your password?{" "}
          <Link to={UN_AUTH_ROUTES.LOGIN} className="font-semibold text-primary hover:opacity-80">
            Log in
          </Link>
        </Paragraph>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(ResetPasswordForm);
