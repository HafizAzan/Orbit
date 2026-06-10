import React from "react";
import AuthPageShell from "../component/auth/auth-page-shell";
import VerifyOtpForm from "../component/auth/verify-otp-form";

function VerifyOtp() {
  return (
    <AuthPageShell>
      <VerifyOtpForm />
    </AuthPageShell>
  );
}

export default React.memo(VerifyOtp);
