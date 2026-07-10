import React from "react";
import PageSeo from "../component/seo/page-seo";
import AuthPageShell from "../component/auth/auth-page-shell";
import VerifyEmailContent from "../component/auth/verify-email-content";

function VerifyEmail() {
  return (
    <>
      <PageSeo title="Verify Email" description="Verify your email address to activate your Orbit account." noIndex />
      <AuthPageShell>
        <VerifyEmailContent />
      </AuthPageShell>
    </>
  );
}

export default React.memo(VerifyEmail);
