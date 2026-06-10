import React from "react";
import RegisterForm from "../component/auth/register-form";
import RegisterPreview from "../component/auth/register-preview";

function Register() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex w-full min-w-0 bg-card lg:bg-background">
        <RegisterForm />
      </div>
      <RegisterPreview />
    </div>
  );
}

export default React.memo(Register);
