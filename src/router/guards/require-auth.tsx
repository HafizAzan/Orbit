import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { UN_AUTH_ROUTES } from "../public-routes";

function RequireAuth() {
  const app = useAppContext();
  const location = useLocation();

  if (app?.isBootstrapping) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default React.memo(RequireAuth);
