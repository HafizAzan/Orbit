import React, { useCallback, useEffect, useState } from "react";
import { ClockCircleOutlined, LogoutOutlined, ReloadOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { getMe } from "../api-services/auth.service";
import { PageHeaderSkeleton } from "../component/skeletons";
import { Paragraph, Title } from "../component/ui/typography";
import { useAppContext } from "../context/app-context";
import { useLogout } from "../hooks/user-authentication";
import {
  getPostAuthRedirectPath,
  shouldRedirectToChoosePlan,
  shouldRedirectToWorkspacePending,
} from "../lib/auth-routing";
import { showApiErrorToast, showApiSuccessToast } from "../lib/api-error";
import { saveStoredUser } from "../lib/auth-session";
import { getWorkspaceRoleLabel } from "../lib/workspace-routing";
import { UN_AUTH_ROUTES } from "../router/public-routes";

function WorkspaceSubscriptionPending() {
  const app = useAppContext();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const freshUser = await getMe();
      saveStoredUser(freshUser);
      app?.setUser(freshUser);

      if (!freshUser.organizationAwaitingSubscription) {
        showApiSuccessToast("Your workspace is ready. Redirecting...");
        window.location.assign(getPostAuthRedirectPath(freshUser));
        return;
      }
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [app]);

  useEffect(() => {
    if (!app?.user || !shouldRedirectToWorkspacePending(app.user)) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void handleRefreshStatus();
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [app?.user, handleRefreshStatus]);

  const handleLogout = useCallback(async () => {
    try {
      const result = await logout();
      showApiSuccessToast(result.message);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [logout]);

  if (app?.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-14">
        <div className="w-full max-w-lg">
          <PageHeaderSkeleton showAction={false} />
        </div>
      </div>
    );
  }

  if (!app?.isAuthenticated || !app.user) {
    return <Navigate to={UN_AUTH_ROUTES.LOGIN} replace />;
  }

  if (shouldRedirectToChoosePlan(app.user)) {
    return <Navigate to={getPostAuthRedirectPath(app.user)} replace />;
  }

  if (!shouldRedirectToWorkspacePending(app.user)) {
    return <Navigate to={getPostAuthRedirectPath(app.user)} replace />;
  }

  const organizationName = app.user.organization?.name ?? "your organization";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-14">
      <div className="max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <ClockCircleOutlined className="text-3xl" />
        </span>

        <Title level={2} className="mt-6 text-foreground">
          Workspace abhi activate nahi hua
        </Title>

        <Paragraph className="mt-4 text-muted">
          <span className="font-semibold text-foreground">{organizationName}</span> abhi subscription
          activate kar rahi hai. Jab owner ya admin plan select kar lenge, tab aap workspace use kar
          sakenge.
        </Paragraph>

        <Paragraph className="mt-3 text-muted">
          Is mein thora waqt lag sakta hai. Status har 30 seconds check hota hai, ya neeche &quot;Check
          again&quot; dabayein.
        </Paragraph>

        <Paragraph size="sm" className="mt-4 text-muted">
          Signed in as {getWorkspaceRoleLabel(app.user.role)}.
        </Paragraph>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              void handleRefreshStatus();
            }}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ReloadOutlined />
            {isRefreshing ? "Checking..." : "Check again"}
          </button>

          <button
            type="button"
            onClick={() => {
              void handleLogout();
            }}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogoutOutlined />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(WorkspaceSubscriptionPending);
