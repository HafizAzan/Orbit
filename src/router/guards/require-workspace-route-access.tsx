import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { canAccessWorkspacePath } from "../../lib/workspace-route-access";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";

function RequireWorkspaceRouteAccess() {
  const app = useAppContext();
  const location = useLocation();
  const role = app?.user?.role;

  if (!canAccessWorkspacePath(role, location.pathname)) {
    return <Navigate to={getWorkspaceHomePath(role)} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default React.memo(RequireWorkspaceRouteAccess);
