import React from "react";
import PageSeo from "../component/seo/page-seo";
import LoginForm from "../component/auth/login-form";
import LoginPreview from "../component/auth/login-preview";

function Login() {
  return (
    <>
      <PageSeo title="Sign In" description="Sign in to your Orbit account." noIndex />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full min-w-0 bg-card lg:bg-background">
          <LoginForm />
        </div>
        <LoginPreview />
      </div>
    </>
  );
}

export default React.memo(Login);
