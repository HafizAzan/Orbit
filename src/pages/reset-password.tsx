import React from "react";
import LoginPreview from "../component/auth/login-preview";
import ResetPasswordForm from "../component/auth/reset-password-form";

function ResetPassword() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex w-full min-w-0 bg-card lg:bg-background">
        <ResetPasswordForm />
      </div>
      <LoginPreview />
    </div>
  );
}

export default React.memo(ResetPassword);
