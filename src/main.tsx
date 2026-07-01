import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import Loader from "./component/ui/loader";
import { applyAppUiTheme, isAppUiTheme } from "./data/app-ui-themes";
import { getStoredUser } from "./lib/auth-session";
import "./index.css";
import App from "./app";

const storedUser = getStoredUser();
if (storedUser?.uiTheme && isAppUiTheme(storedUser.uiTheme)) {
  applyAppUiTheme(storedUser.uiTheme);
}

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<Loader fullScreen />}>
    <App />
  </Suspense>,
);
