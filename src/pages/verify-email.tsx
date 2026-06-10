import React from "react";
import AuthPageShell from "../component/auth/auth-page-shell";
import VerifyEmailContent from "../component/auth/verify-email-content";

function VerifyEmail() {
  return (
    <AuthPageShell>
      <VerifyEmailContent />
    </AuthPageShell>
  );
}

export default React.memo(VerifyEmail);
