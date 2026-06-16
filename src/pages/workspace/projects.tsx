import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProjectCard from "../../component/workspace/projects/project-card";
import ProjectTemplateCard from "../../component/workspace/projects/project-template-card";
import ProjectsPageHeader from "../../component/workspace/projects/projects-page-header";
import ProjectsToolbar from "../../component/workspace/projects/projects-toolbar";
import type { ProjectsViewMode, WorkspaceProject } from "../../data/workspace-projects";
import { WORKSPACE_PROJECTS } from "../../data/workspace-projects";
import { pluralize } from "../../lib/helper";
import { toast } from "../../lib/toast";
import { cn } from "../../lib/utils";

function WorkspaceProjects() {
  const [projects, setProjects] = useState<WorkspaceProject[]>(WORKSPACE_PROJECTS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ProjectsViewMode>("grid");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
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
  }, [priorityFilter, projects, statusFilter, teamFilter]);

  const filteredProjectIds = useMemo(
    () => filteredProjects.map((project) => project.id),
    [filteredProjects],
  );

  useEffect(() => {
    setSelectedProjectIds([]);
  }, [statusFilter, priorityFilter, teamFilter]);

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
    const deletedCount = selectedProjectIds.length;

    await new Promise((resolve) => setTimeout(resolve, 400));

    setProjects((current) => current.filter((project) => !selectedProjectIds.includes(project.id)));
    setSelectedProjectIds([]);
    toast.success(`${deletedCount} ${pluralize(deletedCount, "project")} deleted successfully`);
  }, [selectedProjectIds]);

  return (
    <div className="mx-auto max-w-8xl">
      <ProjectsPageHeader selectedCount={selectedCount} onBulkDelete={handleBulkDelete} />
      <ProjectsToolbar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        teamFilter={teamFilter}
        viewMode={viewMode}
        totalProjects={filteredProjects.length}
        selectedCount={selectedCount}
        allSelected={allSelected}
        indeterminate={indeterminate}
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
            selected={selectedProjectIds.includes(project.id)}
            onSelectedChange={(selected) => handleProjectSelectedChange(project.id, selected)}
          />
        ))}
        {viewMode === "grid" ? <ProjectTemplateCard /> : null}
      </div>
    </div>
  );
}

export default React.memo(WorkspaceProjects);
