import React from "react";
import { Navigate, useParams } from "react-router-dom";

function ProjectThemeLegacyRedirect() {
  const { projectId = "" } = useParams();

  return <Navigate to={`/projects/${projectId}/theme`} replace />;
}

export default React.memo(ProjectThemeLegacyRedirect);
