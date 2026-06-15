import React from "react";
import { Navigate } from "react-router-dom";
import PlanCatalogGrid from "../component/billing/plan-catalog-grid";
import { PageHeaderSkeleton, PricingCardsGridSkeleton } from "../component/skeletons";
import { Paragraph, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function ChoosePlan() {
  const app = useAppContext();

  if (app?.isBootstrapping) {    return (
      <div className="min-h-screen bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <PageHeaderSkeleton showAction={false} className="mx-auto mb-10 max-w-2xl justify-center" />
          <PricingCardsGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace />;
  }

  if (!app.user.requiresPlanSelection) {
    return <Navigate to={WORKSPACE_ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Choose your plan
          </Title>
          <Paragraph className="mt-4 text-hero-text">
            Select a plan to activate your organization. You can start with the free trial or upgrade anytime.
          </Paragraph>
        </div>

        <PlanCatalogGrid mode="onboarding" onContact={() => window.open("/contact", "_self")} />
      </div>
    </div>
  );
}

export default React.memo(ChoosePlan);
