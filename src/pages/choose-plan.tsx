import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageSeo from "../component/seo/page-seo";
import PlanCatalogGrid from "../component/billing/plan-catalog-grid";
import { PageHeaderSkeleton, PricingCardsGridSkeleton } from "../component/skeletons";
import { Paragraph, Text, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import { useLogout } from "../hooks/user-authentication";
import { showApiErrorToast, showApiSuccessToast } from "../lib/api-error";
import { clearAuthSession } from "../lib/auth-session";
import {
  getPostAuthRedirectPath,
  shouldRedirectToChoosePlan,
  shouldRedirectToWorkspacePending,
} from "../lib/auth-routing";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function ChoosePlan() {
  const app = useAppContext();
  const navigate = useNavigate();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = useCallback(async () => {
    let logoutMessage: string | null = null;

    try {
      const result = await logout();
      logoutMessage = result.message;
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      clearAuthSession();
      app?.setUser(null);
      showApiSuccessToast(logoutMessage);
      navigate(UN_AUTH_ROUTES.LOGIN, { replace: true });
    }
  }, [app, logout, navigate]);

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
      <div className="relative min-h-screen bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
          <Button
            type="default"
            icon={<LogoutOutlined />}
            loading={isLoggingOut}
            onClick={() => {
              void handleLogout();
            }}
            className="rounded-xl! border-border! bg-card! font-semibold! shadow-sm"
          >
            Log out
          </Button>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
            <Title level={2} className="text-foreground">
              Choose your plan
            </Title>
            <Paragraph className="mt-4 text-hero-text">
              Select a plan to activate your organization. Workspace access stays locked until you
              select or purchase a plan.
            </Paragraph>
            <Text as="p" size="sm" color="muted" className="mt-3">
              Signed in as {app.user.email}
            </Text>
          </div>

          <PlanCatalogGrid mode="onboarding" onContact={() => window.open("/contact", "_self")} />
        </div>
      </div>
    </>
  );
}

export default React.memo(ChoosePlan);
