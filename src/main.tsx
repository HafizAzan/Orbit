import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import Loader from "./component/ui/loader";
import {
  applyAppUiTheme,
  clearAppUiTheme,
  normalizeAppUiThemeId,
} from "./data/app-ui-themes";
import { getStoredUser } from "./lib/auth-session";
import { isAppUiThemePath } from "./lib/app-ui-theme-scope";
import "./index.css";
import App from "./app";

const storedUser = getStoredUser();
if (storedUser?.uiTheme && isAppUiThemePath(window.location.pathname)) {
  applyAppUiTheme(normalizeAppUiThemeId(storedUser.uiTheme));
} else {
  clearAppUiTheme();
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Suspense fallback={<Loader fullScreen />}>
      <App />
    </Suspense>
  </HelmetProvider>,
);
