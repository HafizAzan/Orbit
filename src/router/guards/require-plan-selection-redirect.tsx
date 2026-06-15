import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { PLAN_ROUTES } from "../../lib/auth-routing";

function RequirePlanSelectionRedirect() {
  const app = useAppContext();
  const location = useLocation();

  if (app?.isBootstrapping) {
    return <Outlet />;
  }

  if (app?.user?.requiresPlanSelection && location.pathname !== PLAN_ROUTES.CHOOSE_PLAN) {
    return <Navigate to={PLAN_ROUTES.CHOOSE_PLAN} replace />;
  }

  return <Outlet />;
}

export default React.memo(RequirePlanSelectionRedirect);
