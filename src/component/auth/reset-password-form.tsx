import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import { toast } from "../../lib/toast";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Title } from "../ui/typography";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const navigate = useNavigate();

  const handleFinish = () => {
    toast.success("Password updated successfully. Please log in.");
    navigate(UN_AUTH_ROUTES.LOGIN);
  };

  return (
    <AuthFormLayout>
      <AuthFormCard>
        <Title level={2} className="text-3xl text-foreground">
          Reset your password
        </Title>
        <Paragraph size="sm" className="mt-2 text-muted">
          Create a new password for your account. It must be at least 8 characters long.
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

          <Button type="primary" htmlType="submit" block size="large" className="h-11! font-semibold!">
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
