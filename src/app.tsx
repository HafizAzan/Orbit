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
import { AUTH_PROTECTED_ROUTES_LIST, type AuthProtectedRoute } from "./router/auth-routes";
import RequireAuth from "./router/guards/require-auth";
import RequirePlanSelectionRedirect from "./router/guards/require-plan-selection-redirect";
import RequirePlatformAdmin from "./router/guards/require-platform-admin";
import RequireWorkspaceUser from "./router/guards/require-workspace-user";
import RequireMemberRouteAccess from "./router/guards/require-member-route-access";
import RequireWorkspaceRouteAccess from "./router/guards/require-workspace-route-access";
import WorkspaceHomeRedirect from "./router/guards/workspace-home-redirect";
import RequireGuest from "./router/guards/require-guest";
import { APP_NOT_FOUND_ROUTE, LIST, type Route } from "./router/public-routes";
import {
  WORKSPACE_LEGACY_REDIRECTS,
  WORKSPACE_NOT_FOUND_ROUTE,
  WORKSPACE_ROUTES_LIST,
  type WorkspaceRoute,
} from "./router/workspace-routes";

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
                <ChildRoute element={<RequireMemberRouteAccess />}>
                  <ChildRoute element={<RequireWorkspaceRouteAccess />}>
                    {WORKSPACE_ROUTES_LIST.map((route: WorkspaceRoute) => (
                      <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                    ))}
                    <ChildRoute
                      path={WORKSPACE_NOT_FOUND_ROUTE.path}
                      element={<WORKSPACE_NOT_FOUND_ROUTE.component />}
                    />
                  </ChildRoute>
                </ChildRoute>
              </ChildRoute>
            </ChildRoute>

            {WORKSPACE_LEGACY_REDIRECTS.map((redirect) => (
              <ChildRoute
                key={`legacy-app-${redirect.path}`}
                path={redirect.path}
                element={<Navigate to={redirect.to} replace />}
              />
            ))}
            <ChildRoute path="/app" element={<WorkspaceHomeRedirect />} />

            <ChildRoute element={<RequireGuest />}>
              <ChildRoute element={<AuthLayout />}>
                {LIST.AUTH_ROUTES_LIST.map((route: Route) => (
                  <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                ))}
              </ChildRoute>
            </ChildRoute>

            <ChildRoute element={<RequireAuth />}>
              {AUTH_PROTECTED_ROUTES_LIST.map((route: AuthProtectedRoute) => (
                <ChildRoute key={route.path} path={route.path} element={<route.component />} />
              ))}
            </ChildRoute>

            <ChildRoute element={<Layout />}>
              <ChildRoute element={<RequirePlanSelectionRedirect />}>
                {LIST.PUBLIC_ROUTES_LIST.map((route: Route) => (
                  <ChildRoute key={route.path} path={route.path} element={<route.component />} />
                ))}
              </ChildRoute>
            </ChildRoute>

            <ChildRoute path={APP_NOT_FOUND_ROUTE.path} element={<APP_NOT_FOUND_ROUTE.component />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default React.memo(App);
