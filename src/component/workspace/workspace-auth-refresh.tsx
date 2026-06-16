import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../context/app-context";

function WorkspaceAuthRefresh() {
  const location = useLocation();
  const app = useAppContext();
  const refreshUser = app?.refreshUser;
  const isBootstrapping = app?.isBootstrapping ?? true;

  useEffect(() => {
    if (isBootstrapping || !refreshUser) return;
    void refreshUser();
  }, [isBootstrapping, location.pathname, refreshUser]);

  return null;
}

export default WorkspaceAuthRefresh;
