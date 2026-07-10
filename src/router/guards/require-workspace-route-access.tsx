import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { useOrganizationUsage } from "../../hooks/use-billing";
import { canAccessWorkspacePath } from "../../lib/workspace-route-access";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";

function RequireWorkspaceRouteAccess() {
  const app = useAppContext();
  const location = useLocation();
  const role = app?.user?.role;
  const usageQuery = useOrganizationUsage();
  const featureFlags = usageQuery.data?.featureFlags;

  if (!canAccessWorkspacePath(role, location.pathname, featureFlags)) {
    return <Navigate to={getWorkspaceHomePath(role)} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default React.memo(RequireWorkspaceRouteAccess);
