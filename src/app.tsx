import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route as ChildRoute, Routes } from "react-router-dom";
import ScrollToTop from "./component/common/scroll-to-top";
import { queryClient } from "./config/query-client";
import { AppProvider } from "./context/app-context";
import AuthLayout from "./layout/auth-layout/layout";
import AdminLayout from "./layout/admin-layout/layout";
import Layout from "./layout/public-layout/layout";
import { ADMIN_ROUTES_LIST, type AdminRoute } from "./router/admin-routes";
import RequirePlatformAdmin from "./router/guards/require-platform-admin";
import { LIST, type Route } from "./router/public-routes";

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

            <ChildRoute element={<AuthLayout />}>
              {LIST.AUTH_ROUTES_LIST.map((route: Route) => (
                <ChildRoute key={route.path} path={route.path} element={<route.component />} />
              ))}
            </ChildRoute>

            <ChildRoute element={<Layout />}>
              {LIST.PUBLIC_ROUTES_LIST.map((route: Route) => (
                <ChildRoute key={route.path} path={route.path} element={<route.component />} />
              ))}
            </ChildRoute>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default React.memo(App);
