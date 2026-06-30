import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { getPostAuthRedirectPath } from "../../lib/auth-routing";
import { Paragraph } from "../../component/ui/typography";
import { UN_AUTH_ROUTES } from "../public-routes";

const GUEST_ONLY_PATHS = new Set([
  UN_AUTH_ROUTES.LOGIN,
  UN_AUTH_ROUTES.REGISTER,
  UN_AUTH_ROUTES.ACCEPT_INVITE,
  UN_AUTH_ROUTES.FORGOT_PASSWORD,
  UN_AUTH_ROUTES.VERIFY_OTP,
  UN_AUTH_ROUTES.VERIFY_EMAIL,
]);

function RequireGuest() {
  const app = useAppContext();
  const location = useLocation();

  if (app?.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card">
        <Paragraph size="sm">Loading...</Paragraph>
      </div>
    );
  }

  if (app?.isAuthenticated && app.user && GUEST_ONLY_PATHS.has(location.pathname)) {
    return <Navigate to={getPostAuthRedirectPath(app.user)} replace />;
  }

  return <Outlet />;
}

export default React.memo(RequireGuest);
