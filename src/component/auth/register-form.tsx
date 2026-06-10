import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { sendOtp } from "../../lib/auth";
import { toast } from "../../lib/toast";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Title } from "../ui/typography";

type RegisterFormValues = {
  fullName: string;
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterForm() {
  const [form] = Form.useForm<RegisterFormValues>();
  const navigate = useNavigate();
  const app = useAppContext();

  const handleFinish = async (values: RegisterFormValues) => {
    try {
      app?.setIsLoading(true);
      const code = await sendOtp(values.email);
      toast.success(
        import.meta.env.DEV
          ? `Verification code sent to ${values.email}. Demo code: ${code}`
          : `Verification code sent to ${values.email}`,
      );
      navigate(UN_AUTH_ROUTES.VERIFY_OTP, {
        state: {
          email: values.email,
          flow: "register",
          registerData: {
            fullName: values.fullName,
            organizationName: values.organizationName,
            email: values.email,
            password: values.password,
          },
        },
      });
    } catch {
      toast.error("Unable to send verification code. Please try again.");
    } finally {
      app?.setIsLoading(false);
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
            <Input placeholder="Acme Inc." size="large" className="rounded-lg!" />
          </Form.Item>

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

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={app?.isLoading}
            className="h-11! font-semibold!"
          >
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
