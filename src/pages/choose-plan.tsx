import React from "react";
import { Navigate } from "react-router-dom";
import PageSeo from "../component/seo/page-seo";
import PlanCatalogGrid from "../component/billing/plan-catalog-grid";
import { PageHeaderSkeleton, PricingCardsGridSkeleton } from "../component/skeletons";
import { Paragraph, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import {
  getPostAuthRedirectPath,
  shouldRedirectToChoosePlan,
  shouldRedirectToWorkspacePending,
} from "../lib/auth-routing";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function ChoosePlan() {
  const app = useAppContext();

  if (app?.isBootstrapping) {
    return (
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

  if (shouldRedirectToWorkspacePending(app.user)) {
    return <Navigate to={getPostAuthRedirectPath(app.user)} replace />;
  }

  if (!shouldRedirectToChoosePlan(app.user)) {
    return <Navigate to={getPostAuthRedirectPath(app.user)} replace />;
  }

  return (
    <>
      <PageSeo title="Choose a Plan" description="Select a subscription plan to activate your Orbit workspace." noIndex />
      <div className="min-h-screen bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
            <Title level={2} className="text-foreground">
              Choose your plan
            </Title>
            <Paragraph className="mt-4 text-hero-text">
              Select a plan to activate your organization. Workspace tab tak access nahi milega jab tak
              aap plan select ya purchase nahi kar lete.
            </Paragraph>
          </div>

          <PlanCatalogGrid mode="onboarding" onContact={() => window.open("/contact", "_self")} />
        </div>
      </div>
    </>
  );
}

export default React.memo(ChoosePlan);
