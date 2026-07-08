import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { confirmCheckout } from "../api-services/billing.service";
import { getMe } from "../api-services/auth.service";
import { PricingCardsGridSkeleton } from "../component/skeletons";
import { Paragraph, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import { showApiErrorToast } from "../lib/api-error";
import { saveStoredUser } from "../lib/auth-session";
import { getPostAuthRedirectPath, PLAN_ROUTES, shouldRedirectToChoosePlan } from "../lib/auth-routing";
import { UN_AUTH_ROUTES } from "../router/public-routes";

async function refreshAuthenticatedUser(app: ReturnType<typeof useAppContext>) {
  const freshUser = await getMe();
  saveStoredUser(freshUser);
  app?.setUser(freshUser);
  return freshUser;
}

function ChoosePlanCheckoutSuccess() {
  const app = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || app?.isBootstrapping) {
      return;
    }

    void (async () => {
      try {
        await confirmCheckout({ sessionId });
        const freshUser = await refreshAuthenticatedUser(app);

        if (!freshUser.organizationAwaitingSubscription) {
          navigate(getPostAuthRedirectPath(freshUser), { replace: true });
        }
      } catch (error) {
        showApiErrorToast(error);
        setErrorMessage("We could not activate your plan yet. Please try again.");
      }
    })();
  }, [app, navigate, sessionId]);

  if (app?.isBootstrapping) {
    return (
      <div className="min-h-screen bg-background px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <PricingCardsGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace />;
  }

  if (!sessionId) {
    return <Navigate to={PLAN_ROUTES.CHOOSE_PLAN} replace />;
  }

  if (!shouldRedirectToChoosePlan(app.user)) {
    return <Navigate to={getPostAuthRedirectPath(app.user)} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-14">
      <div className="max-w-md text-center">
        {errorMessage ? (
          <>
            <Title level={3} className="text-foreground">
              Plan activation pending
            </Title>
            <Paragraph className="mt-3 text-muted">{errorMessage}</Paragraph>
            <Link
              to={PLAN_ROUTES.CHOOSE_PLAN}
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to plans
            </Link>
          </>
        ) : (
          <>
            <Title level={3} className="text-foreground">
              Activating your plan...
            </Title>
            <Paragraph className="mt-3 text-muted">
              Please wait while we confirm your checkout and set up your workspace.
            </Paragraph>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(ChoosePlanCheckoutSuccess);
