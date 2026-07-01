import React from "react";
import { useParams } from "react-router-dom";
import QueryPageGuard from "../../component/common/query-page-guard";
import ProjectSettingsHeader from "../../component/workspace/projects/project-settings-header";
import { ProjectThemeSection } from "../../component/workspace/projects/project-theme-picker";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { ProjectDetailSkeleton } from "../../component/skeletons";
import { PROJECT_THEMES, type ProjectThemeId } from "../../data/project-themes";
import { useAppContext } from "../../context/app-context";
import { useProject, useUpdateMyProjectTheme } from "../../hooks/use-workspace-projects";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { getWorkspaceHomePath } from "../../lib/workspace-routing";

function WorkspaceProjectSettings() {
  const { projectId = "" } = useParams();
  const app = useAppContext();
  const projectQuery = useProject(projectId);
  const { mutateAsync: updateMyTheme, isPending: isSavingTheme } = useUpdateMyProjectTheme();
  const { data: apiProject } = projectQuery;

  const handleSaveTheme = async (themeId: ProjectThemeId) => {
    try {
      await updateMyTheme({ projectId, theme: themeId });
      showApiSuccessToast("Your project theme was updated.");
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <QueryPageGuard
      query={projectQuery}
      loading={<ProjectDetailSkeleton />}
      errorTitle="Unable to load project settings"
      homePath={getWorkspaceHomePath(app?.user?.role)}
    >
      {!apiProject ? (
        <WorkspaceNotFound
          title="Project not found"
          description="This project does not exist or you do not have access to it."
        />
      ) : (
        <div className="mx-auto max-w-8xl">
          <ProjectSettingsHeader project={apiProject} />

          <ProjectThemeSection
            themes={PROJECT_THEMES}
            selectedThemeId={(apiProject.theme as ProjectThemeId) ?? "classic"}
            saving={isSavingTheme}
            onSave={handleSaveTheme}
          />
        </div>
      )}
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjectSettings);
