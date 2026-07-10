import React from "react";
import PageSeo from "../component/seo/page-seo";
import AuthPageShell from "../component/auth/auth-page-shell";
import VerifyOtpForm from "../component/auth/verify-otp-form";

function VerifyOtp() {
  return (
    <>
      <PageSeo title="Verify OTP" description="Enter the one-time code sent to your email to complete verification." noIndex />
      <AuthPageShell>
        <VerifyOtpForm />
      </AuthPageShell>
    </>
  );
}

export default React.memo(VerifyOtp);
