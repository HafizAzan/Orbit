import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hooks/user-authentication";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import type { ForgotPasswordFormValues } from "../../types/auth.types";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Title } from "../ui/typography";

function ForgotPasswordForm() {
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const navigate = useNavigate();
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const handleFinish = async (values: ForgotPasswordFormValues) => {
    try {
      const normalizedEmail = values.email.trim().toLowerCase();
      const result = await forgotPassword({ email: normalizedEmail });

      showApiSuccessToast(result.message);

      navigate(UN_AUTH_ROUTES.VERIFY_EMAIL, {
        state: { email: normalizedEmail },
      });
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <AuthFormLayout centeredLogo>
      <AuthFormCard>
        <Title level={2} className="text-3xl text-foreground">
          Forgot your password?
        </Title>
        <Paragraph size="sm" className="mt-2 text-muted">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-8 [&_.ant-form-item]:mb-5"
          onFinish={handleFinish}
        >
          <Form.Item
            name="email"
            label={<Label>Email address</Label>}
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-muted" />}
              placeholder="name@company.com"
              size="large"
              className="rounded-lg!"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isPending}
            className="h-11! font-semibold!"
          >
            Send reset link
          </Button>
        </Form>

        <Divider className="my-8!" />

        <div className="text-center">
          <Link
            to={UN_AUTH_ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeftOutlined className="text-xs" />
            Back to login
          </Link>
        </div>
      </AuthFormCard>
    </AuthFormLayout>
  );
}

export default React.memo(ForgotPasswordForm);
