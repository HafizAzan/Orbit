import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { getMemberFallbackPath, isMemberAllowedPath } from "../../lib/workspace-member-routes";

function RequireMemberRouteAccess() {
  const app = useAppContext();
  const location = useLocation();
  const role = app?.user?.role;

  if (role === "member" && !isMemberAllowedPath(location.pathname)) {
    return <Navigate to={getMemberFallbackPath()} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default React.memo(RequireMemberRouteAccess);
