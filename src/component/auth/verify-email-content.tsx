import { ArrowLeftOutlined, CheckOutlined, GlobalOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UN_AUTH_ROUTES } from "../../router/public-routes";
import { toast } from "../../lib/toast";
import AnimateOnScroll from "../common/animate-on-scroll";
import AuthFormCard from "./auth-form-card";
import AuthFormLayout from "./auth-form-layout";
import { Paragraph, Title } from "../ui/typography";

type VerifyEmailLocationState = {
  email?: string;
};

function VerifyEmailContent() {
  const location = useLocation();
  const { email } = (location.state as VerifyEmailLocationState | null) ?? {};

  const handleOpenEmailApp = () => {
    window.location.href = "mailto:";
  };

  const handleResendLink = () => {
    toast.success(email ? `Reset link resent to ${email}` : "Reset link resent to your email");
  };

  return (
    <AuthFormLayout centeredLogo>
      <AuthFormCard className="text-center">
        <AnimateOnScroll immediate variant="scale-in" delay={150}>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckOutlined className="text-xl text-primary" />
          </div>
        </AnimateOnScroll>

        <Title level={2} className="text-3xl text-foreground">
          Check your email
        </Title>

        <Paragraph size="sm" className="mt-2 text-muted">
          {email
            ? `We've sent a password reset link to ${email}.`
            : "We've sent a password reset link to your email address."}
        </Paragraph>

        <div className="mt-8 space-y-3">
          <Button
            type="primary"
            block
            size="large"
            icon={<MailOutlined />}
            className="h-11! font-semibold!"
            onClick={handleOpenEmailApp}
          >
            Open email app
          </Button>

          <Button block size="large" className="h-11! font-medium!" onClick={handleResendLink}>
            Resend link
          </Button>
        </div>

        <Divider className="my-8!" />

        <Link
          to={UN_AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeftOutlined className="text-xs" />
          Back to login
        </Link>
      </AuthFormCard>

      <AnimateOnScroll immediate variant="fade-in" delay={220} className="mt-8 flex items-center justify-center gap-5 text-muted/60">
        <MailOutlined className="text-base" aria-hidden />
        <LockOutlined className="text-base" aria-hidden />
        <GlobalOutlined className="text-base" aria-hidden />
      </AnimateOnScroll>
    </AuthFormLayout>
  );
}

export default React.memo(VerifyEmailContent);
