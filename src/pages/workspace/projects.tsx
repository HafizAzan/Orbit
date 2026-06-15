import React, { useMemo, useState } from "react";
import ProjectCard from "../../component/workspace/projects/project-card";
import ProjectTemplateCard from "../../component/workspace/projects/project-template-card";
import ProjectsPageHeader from "../../component/workspace/projects/projects-page-header";
import ProjectsToolbar from "../../component/workspace/projects/projects-toolbar";
import type { ProjectsViewMode } from "../../data/workspace-projects";
import { WORKSPACE_PROJECTS } from "../../data/workspace-projects";
import { cn } from "../../lib/utils";

function WorkspaceProjects() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ProjectsViewMode>("grid");

  const filteredProjects = useMemo(() => {
    return WORKSPACE_PROJECTS.filter((project) => {
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
  }, [priorityFilter, statusFilter, teamFilter]);

  return (
    <div className="mx-auto max-w-8xl">
      <ProjectsPageHeader />
      <ProjectsToolbar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        teamFilter={teamFilter}
        viewMode={viewMode}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onTeamChange={setTeamFilter}
        onViewModeChange={setViewMode}
      />

      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col gap-4",
        )}
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} viewMode={viewMode} />
        ))}
        {viewMode === "grid" ? <ProjectTemplateCard /> : null}
      </div>
    </div>
  );
}

export default React.memo(WorkspaceProjects);
