import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import {
  PLAN_ONBOARDING_PATHS,
  PLAN_ROUTES,
  shouldRedirectToChoosePlan,
  shouldRedirectToWorkspacePending,
  SUBSCRIPTION_PENDING_ROUTES,
} from "../../lib/auth-routing";

function RequirePlanSelectionRedirect() {
  const app = useAppContext();
  const location = useLocation();

  if (app?.isBootstrapping) {
    return <Outlet />;
  }

  if (!app?.user) {
    return <Outlet />;
  }

  if (
    shouldRedirectToChoosePlan(app.user) &&
    !PLAN_ONBOARDING_PATHS.has(location.pathname)
  ) {
    return <Navigate to={PLAN_ROUTES.CHOOSE_PLAN} replace />;
  }

  if (
    shouldRedirectToWorkspacePending(app.user) &&
    location.pathname !== SUBSCRIPTION_PENDING_ROUTES.WORKSPACE_PENDING
  ) {
    return <Navigate to={SUBSCRIPTION_PENDING_ROUTES.WORKSPACE_PENDING} replace />;
  }

  return <Outlet />;
}

export default React.memo(RequirePlanSelectionRedirect);
