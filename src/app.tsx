import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route as ChildRoute, Routes } from "react-router-dom";
import ScrollToTop from "./component/common/scroll-to-top";
import { queryClient } from "./config/query-client";
import { AppProvider } from "./context/app-context";
import AuthLayout from "./layout/auth-layout/layout";
import AdminLayout from "./layout/admin-layout/layout";
import WorkspaceLayout from "./layout/workspace-layout/layout";
import Layout from "./layout/public-layout/layout";
import { ADMIN_ROUTES_LIST, type AdminRoute } from "./router/admin-routes";
import RequireAuth from "./router/guards/require-auth";
import RequirePlanSelectionRedirect from "./router/guards/require-plan-selection-redirect";
import RequirePlatformAdmin from "./router/guards/require-platform-admin";
import RequireWorkspaceUser from "./router/guards/require-workspace-user";
import RequireGuest from "./router/guards/require-guest";
import { PLAN_ROUTES } from "./lib/auth-routing";
import { LIST, type Route } from "./router/public-routes";
import { WORKSPACE_ROUTES_LIST, WORKSPACE_ROUTES, type WorkspaceRoute } from "./router/workspace-routes";
import ChoosePlan from "./pages/choose-plan";
import ChoosePlanCheckoutSuccess from "./pages/choose-plan-checkout-success";
import ChoosePlanCheckoutCancel from "./pages/choose-plan-checkout-cancel";
import WorkspaceProjectDetail from "./pages/workspace/project-detail";
import WorkspaceProjectBoard from "./pages/workspace/project-board";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <ChildRoute element={<RequirePlatformAdmin />}>
              <ChildRoute element={<AdminLayout />}>
                {ADMIN_ROUTES_LIST.map((route: AdminRoute) => (
                  <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                ))}
              </ChildRoute>
            </ChildRoute>

            <ChildRoute element={<RequireWorkspaceUser />}>
              <ChildRoute element={<WorkspaceLayout />}>
                {WORKSPACE_ROUTES_LIST.map((route: WorkspaceRoute) => (
                  <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                ))}
                <ChildRoute path={WORKSPACE_ROUTES.PROJECT_DETAIL} element={<WorkspaceProjectDetail />} />
                <ChildRoute path={`${WORKSPACE_ROUTES.PROJECT_DETAIL}/board`} element={<WorkspaceProjectBoard />} />
              </ChildRoute>
            </ChildRoute>

            {WORKSPACE_ROUTES_LIST.map((route: WorkspaceRoute) => (
              <ChildRoute
                key={`legacy-app-${route.path}`}
                path={`/app${route.path}`}
                element={<Navigate to={route.path} replace />}
              />
            ))}
            <ChildRoute path="/app" element={<Navigate to={WORKSPACE_ROUTES.DASHBOARD} replace />} />

            <ChildRoute element={<RequireGuest />}>
              <ChildRoute element={<AuthLayout />}>
                {LIST.AUTH_ROUTES_LIST.map((route: Route) => (
                  <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                ))}
              </ChildRoute>
            </ChildRoute>

            <ChildRoute element={<RequireAuth />}>
              <ChildRoute path={PLAN_ROUTES.CHOOSE_PLAN} element={<ChoosePlan />} />
              <ChildRoute path={PLAN_ROUTES.CHECKOUT_SUCCESS} element={<ChoosePlanCheckoutSuccess />} />
              <ChildRoute path={PLAN_ROUTES.CHECKOUT_CANCEL} element={<ChoosePlanCheckoutCancel />} />
            </ChildRoute>

            <ChildRoute element={<Layout />}>
              <ChildRoute element={<RequirePlanSelectionRedirect />}>
                {LIST.PUBLIC_ROUTES_LIST.map((route: Route) => (
                  <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                ))}
              </ChildRoute>
            </ChildRoute>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default React.memo(App);
