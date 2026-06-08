import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import Loader from "./component/ui/loader";
import "./index.css";
import App from "./app";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<Loader fullScreen />}>
    <App />
  </Suspense>,
);
