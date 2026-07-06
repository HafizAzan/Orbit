import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { getProjectDetailPath } from "../../data/workspace-project-detail";

function ProjectThemeLegacyRedirect() {
  const { projectId = "" } = useParams();

  return <Navigate to={getProjectDetailPath(projectId)} replace />;
}

export default React.memo(ProjectThemeLegacyRedirect);
