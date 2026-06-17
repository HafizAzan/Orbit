import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/app-context";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";

function WorkspaceHomeRedirect() {
  const app = useAppContext();
  return <Navigate to={getWorkspaceHomePath(app?.user?.role)} replace />;
}

export default React.memo(WorkspaceHomeRedirect);
