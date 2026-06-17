import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProjectCard from "../../component/workspace/projects/project-card";
import ProjectTemplateCard from "../../component/workspace/projects/project-template-card";
import ProjectsPageHeader from "../../component/workspace/projects/projects-page-header";
import ProjectsToolbar from "../../component/workspace/projects/projects-toolbar";
import WorkspaceNotFound from "../../component/workspace/workspace-not-found";
import { AdminListPageSkeleton } from "../../component/skeletons";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useDeleteProject, useProjects } from "../../hooks/use-workspace-projects";
import type { ProjectsViewMode } from "../../data/workspace-projects";
import { mapApiProjectToWorkspaceProject } from "../../types/project.types";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { pluralize } from "../../lib/helper";
import { cn } from "../../lib/utils";

function WorkspaceProjects() {
  const { can } = useWorkspacePermissions();
  const { data: projects = [], isLoading, isError } = useProjects();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const canDeleteProject = can("project.delete");
  const canCreateProject = can("project.create");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ProjectsViewMode>("grid");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const workspaceProjects = useMemo(
    () => projects.map(mapApiProjectToWorkspaceProject),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return workspaceProjects.filter((project) => {
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== "all" && project.priority !== priorityFilter) {
        return false;
      }

      if (teamFilter !== "all" && project.teamId !== teamFilter) {
        return false;
      }

      return true;
    });
  }, [priorityFilter, workspaceProjects, statusFilter, teamFilter]);

  const filteredProjectIds = useMemo(
    () => filteredProjects.map((project) => project.id),
    [filteredProjects],
  );

  useEffect(() => {
    setSelectedProjectIds([]);
  }, [statusFilter, priorityFilter, teamFilter, workspaceProjects]);

  const selectedCount = selectedProjectIds.length;
  const allSelected = filteredProjects.length > 0 && filteredProjectIds.every((id) => selectedProjectIds.includes(id));
  const indeterminate = selectedCount > 0 && !allSelected;

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      setSelectedProjectIds(checked ? filteredProjectIds : []);
    },
    [filteredProjectIds],
  );

  const handleProjectSelectedChange = useCallback((projectId: string, selected: boolean) => {
    setSelectedProjectIds((current) => {
      if (selected) {
        return current.includes(projectId) ? current : [...current, projectId];
      }

      return current.filter((id) => id !== projectId);
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    try {
      for (const projectId of selectedProjectIds) {
        await deleteProject(projectId);
      }

      showApiSuccessToast(
        `${selectedCount} ${pluralize(selectedCount, "project")} deleted successfully`,
      );
      setSelectedProjectIds([]);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [deleteProject, selectedCount, selectedProjectIds]);

  if (isLoading) {
    return <AdminListPageSkeleton tableColumns={3} />;
  }

  if (isError) {
    return (
      <WorkspaceNotFound
        title="Unable to load projects"
        description="We could not load your projects. The server may be unavailable — please try again shortly."
      />
    );
  }

  return (
    <div className="mx-auto max-w-8xl">
      <ProjectsPageHeader
        selectedCount={selectedCount}
        onBulkDelete={canDeleteProject ? handleBulkDelete : undefined}
      />
      <ProjectsToolbar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        teamFilter={teamFilter}
        viewMode={viewMode}
        totalProjects={filteredProjects.length}
        selectedCount={selectedCount}
        allSelected={allSelected}
        indeterminate={indeterminate}
        canSelect={canDeleteProject}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onTeamChange={setTeamFilter}
        onViewModeChange={setViewMode}
        onSelectAllChange={handleSelectAllChange}
      />

      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col gap-4",
        )}
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            viewMode={viewMode}
            selectable={canDeleteProject}
            selected={selectedProjectIds.includes(project.id)}
            onSelectedChange={(selected) => handleProjectSelectedChange(project.id, selected)}
          />
        ))}
        {viewMode === "grid" && canCreateProject ? <ProjectTemplateCard /> : null}
      </div>
    </div>
  );
}

export default React.memo(WorkspaceProjects);
