import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import PageSeo from "../component/seo/page-seo";
import RegisterForm from "../component/auth/register-form";
import RegisterPreview from "../component/auth/register-preview";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function Register() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite")?.trim();

  if (inviteToken) {
    return (
      <Navigate
        to={`${UN_AUTH_ROUTES.ACCEPT_INVITE}?token=${encodeURIComponent(inviteToken)}`}
        replace
      />
    );
  }

  return (
    <>
      <PageSeo title="Create Account" description="Create your Orbit account and start managing projects with your team." noIndex />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full min-w-0 bg-card lg:bg-background">
          <RegisterForm />
        </div>
        <RegisterPreview />
      </div>
    </>
  );
}

export default React.memo(Register);
