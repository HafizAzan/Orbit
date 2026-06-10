import React from "react";
import { BrowserRouter, Route as ChildRoute, Routes } from "react-router-dom";
import ScrollToTop from "./component/common/scroll-to-top";
import { AppProvider } from "./context/app-context";
import AuthLayout from "./layout/auth-layout/layout";
import AdminLayout from "./layout/admin-layout/layout";
import Layout from "./layout/public-layout/layout";
import { ADMIN_ROUTES_LIST, type AdminRoute } from "./router/admin-routes";
import { LIST, type Route } from "./router/public-routes";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <ChildRoute element={<AdminLayout />}>
            {ADMIN_ROUTES_LIST.map((route: AdminRoute) => (
              <ChildRoute key={route.path} path={route.path} element={<route.component />} />
            ))}
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
  );
}

export default React.memo(App);
