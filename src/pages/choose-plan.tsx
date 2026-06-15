import React, { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import PlanCatalogGrid from "../component/billing/plan-catalog-grid";
import { Paragraph, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import { getMe } from "../api-services/auth.service";
import { saveStoredUser } from "../lib/auth-session";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function ChoosePlan() {
  const app = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const checkoutState = searchParams.get("checkout");

    if (!checkoutState) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("checkout");
    setSearchParams(nextParams, { replace: true });

    if (checkoutState !== "success") {
      return;
    }

    void (async () => {
      try {
        const freshUser = await getMe();
        saveStoredUser(freshUser);
        app?.setUser(freshUser);

        if (!freshUser.requiresPlanSelection) {
          navigate(UN_AUTH_ROUTES.HOME, { replace: true });
        }
      } catch {
        // Keep user on plan selection if refresh fails.
      }
    })();
  }, [app, navigate, searchParams, setSearchParams]);

  if (app?.isBootstrapping) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Paragraph color="muted">Loading...</Paragraph>
      </div>
    );
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace />;
  }

  if (!app.user.requiresPlanSelection) {
    return <Navigate to={UN_AUTH_ROUTES.HOME} replace />;
  }

  return (
    <section className="bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center nav:mb-14">
          <Title level={2} className="text-foreground">
            Choose your plan
          </Title>
          <Paragraph className="mt-4 text-hero-text">
            Select a plan to activate your organization. You can start with the free trial or upgrade anytime.
          </Paragraph>
        </div>

        <PlanCatalogGrid mode="onboarding" onContact={() => navigate("/contact")} />
      </div>
    </section>
  );
}

export default React.memo(ChoosePlan);
