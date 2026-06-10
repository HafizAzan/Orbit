import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../../lib/auth";
import { toast } from "../../lib/toast";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import { useAppContext } from "../../context/app-context";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Label, Paragraph, Text, Title } from "../ui/typography";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const app = useAppContext();

  const handleFinish = async (values: LoginFormValues) => {
    try {
      app?.setIsLoading(true);
      const code = await sendOtp(values.email);
      toast.success(
        import.meta.env.DEV
          ? `Verification code sent to ${values.email}. Demo code: ${code}`
          : `Verification code sent to ${values.email}`,
      );
      navigate(UN_AUTH_ROUTES.VERIFY_OTP, {
        state: { email: values.email, flow: "login" },
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

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={app?.isLoading}
            className="h-11! font-semibold!"
          >
            Log in
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
