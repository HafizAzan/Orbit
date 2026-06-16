import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { isPlatformAdminUser, PLAN_ROUTES } from "../../lib/auth-routing";
import { isWorkspaceUser } from "../../lib/workspace-routing";
import { ADMIN_ROUTES } from "../admin-routes";
import { UN_AUTH_ROUTES } from "../public-routes";
import Loader from "../../component/ui/loader";

function RequireWorkspaceUser() {
  const app = useAppContext();
  const location = useLocation();

  if (app?.isBootstrapping) {
    return <Loader fullScreen />;
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (isPlatformAdminUser(app.user)) {
    return <Navigate to={ADMIN_ROUTES.DASHBOARD} replace />;
  }

  if (app.user.requiresPlanSelection) {
    return <Navigate to={PLAN_ROUTES.CHOOSE_PLAN} replace />;
  }

  if (!isWorkspaceUser(app.user)) {
    return <Navigate to={UN_AUTH_ROUTES.HOME} replace />;
  }

  return <Outlet />;
}

export default React.memo(RequireWorkspaceUser);
