import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Paragraph, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import { PLAN_ROUTES } from "../lib/auth-routing";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function ChoosePlanCheckoutCancel() {
  const app = useAppContext();

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-14">
      <div className="max-w-md text-center">
        <Title level={3} className="text-foreground">
          Checkout cancelled
        </Title>
        <Paragraph className="mt-3 text-muted">
          No charges were made. You can choose a plan again whenever you are ready.
        </Paragraph>
        <Link
          to={PLAN_ROUTES.CHOOSE_PLAN}
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to plans
        </Link>
      </div>
    </div>
  );
}

export default React.memo(ChoosePlanCheckoutCancel);
