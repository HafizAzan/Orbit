import React from "react";
import PageSeo from "../component/seo/page-seo";
import AuthPageShell from "../component/auth/auth-page-shell";
import ForgotPasswordForm from "../component/auth/forgot-password-form";

function ForgotPassword() {
  return (
    <>
      <PageSeo title="Forgot Password" description="Reset your Orbit account password." noIndex />
      <AuthPageShell>
        <ForgotPasswordForm />
      </AuthPageShell>
    </>
  );
}

export default React.memo(ForgotPassword);
