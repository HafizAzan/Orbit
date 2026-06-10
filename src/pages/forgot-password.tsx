import React from "react";
import AuthPageShell from "../component/auth/auth-page-shell";
import ForgotPasswordForm from "../component/auth/forgot-password-form";

function ForgotPassword() {
  return (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}

export default React.memo(ForgotPassword);
