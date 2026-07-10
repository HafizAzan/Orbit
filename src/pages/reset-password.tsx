import React from "react";
import PageSeo from "../component/seo/page-seo";
import LoginPreview from "../component/auth/login-preview";
import ResetPasswordForm from "../component/auth/reset-password-form";

function ResetPassword() {
  return (
    <>
      <PageSeo title="Reset Password" description="Set a new password for your Orbit account." noIndex />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full min-w-0 bg-card lg:bg-background">
          <ResetPasswordForm />
        </div>
        <LoginPreview />
      </div>
    </>
  );
}

export default React.memo(ResetPassword);
