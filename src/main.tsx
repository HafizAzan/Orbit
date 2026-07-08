import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import Loader from "./component/ui/loader";
import { applyAppUiTheme, normalizeAppUiThemeId } from "./data/app-ui-themes";
import { getStoredUser } from "./lib/auth-session";
import "./index.css";
import App from "./app";

const storedUser = getStoredUser();
if (storedUser?.uiTheme) {
  applyAppUiTheme(normalizeAppUiThemeId(storedUser.uiTheme));
}

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<Loader fullScreen />}>
    <App />
  </Suspense>,
);
