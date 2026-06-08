import React from "react";
import { BrowserRouter, Route as ChildRoute, Routes } from "react-router-dom";
import { AppProvider } from "./context/app-context";
import { LIST, type Route } from "./router/constant";
import Layout from "./layout/public-layout/layout";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <ChildRoute element={<Layout />}>
            {LIST.UN_AUTH_ROUTES_LIST.map((route: Route) => (
              <ChildRoute key={route.path} path={route.path} element={<route.component />} />
            ))}
          </ChildRoute>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default React.memo(App);
