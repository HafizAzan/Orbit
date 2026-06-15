import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { isPlatformAdminUser } from "../../lib/auth-routing";
import { UN_AUTH_ROUTES } from "../public-routes";

function RequirePlatformAdmin() {
  const app = useAppContext();
  const location = useLocation();

  if (app?.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (!isPlatformAdminUser(app.user)) {
    return <Navigate to={UN_AUTH_ROUTES.HOME} replace />;
  }

  return <Outlet />;
}

export default React.memo(RequirePlatformAdmin);
