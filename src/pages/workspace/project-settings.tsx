import React from "react";
import { Navigate, useParams } from "react-router-dom";
import PageSeo from "../../component/seo/page-seo";
import { getProjectDetailPath } from "../../data/workspace-project-detail";

function WorkspaceProjectSettings() {
  const { projectId = "" } = useParams();

  return (
    <>
      <PageSeo title="Project Settings" description="Configure project settings." noIndex />
      <Navigate to={getProjectDetailPath(projectId)} replace />
    </>
  );
}

export default React.memo(WorkspaceProjectSettings);
