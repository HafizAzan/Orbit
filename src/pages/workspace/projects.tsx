import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProjectCard from "../../component/workspace/projects/project-card";
import ProjectTemplateCard from "../../component/workspace/projects/project-template-card";
import ProjectsPageHeader from "../../component/workspace/projects/projects-page-header";
import ProjectsToolbar from "../../component/workspace/projects/projects-toolbar";
import QueryPageGuard from "../../component/common/query-page-guard";
import TablePaginationFooter from "../../component/ui/table-pagination-footer";
import { ProjectsPageSkeleton } from "../../component/skeletons";
import { useAppContext } from "../../context/app-context";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useDeleteProject, useProjects } from "../../hooks/use-workspace-projects";
import type { ProjectsViewMode } from "../../data/workspace-projects";
import { buildProjectTeamFilterOptions } from "../../data/workspace-projects";
import { DEFAULT_PROJECTS_LIST_PARAMS, DEFAULT_PROJECTS_PAGE_SIZE } from "../../types/project.types";
import { mapApiProjectToWorkspaceProject } from "../../types/project.types";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { getDeletableProjectIds } from "../../lib/project-access";
import { pluralize } from "../../lib/helper";
import { cn } from "../../lib/utils";
import { Text } from "../../component/ui/typography";

function WorkspaceProjects() {
  const app = useAppContext();
  const { can } = useWorkspacePermissions();
  const deleteActor = useMemo(
    () => (app?.user ? { id: app.user.id, role: app.user.role } : null),
    [app?.user],
  );
  const [page, setPage] = useState<number>(DEFAULT_PROJECTS_LIST_PARAMS.page);
  const projectsQuery = useProjects({
    page,
    limit: DEFAULT_PROJECTS_LIST_PARAMS.limit,
  });
  const { data: projectsPage } = projectsQuery;
  const projects = projectsPage?.data ?? [];
  const totalProjects = projectsPage?.total ?? 0;
  const { mutateAsync: deleteProject } = useDeleteProject();
  const canBulkDeleteProjects = can("project.delete");
  const deletableProjectIds = useMemo(
    () => getDeletableProjectIds(deleteActor, projects),
    [deleteActor, projects],
  );
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

  const teamFilterOptions = useMemo(
    () => buildProjectTeamFilterOptions(workspaceProjects.map((project) => project.teamId)),
    [workspaceProjects],
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

  const deletableFilteredProjectIds = useMemo(
    () => filteredProjectIds.filter((id) => deletableProjectIds.includes(id)),
    [deletableProjectIds, filteredProjectIds],
  );

  const canSelectProjects = canBulkDeleteProjects && deletableFilteredProjectIds.length > 0;

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, teamFilter]);

  useEffect(() => {
    setSelectedProjectIds([]);
  }, [statusFilter, priorityFilter, teamFilter, page, workspaceProjects]);

  const pageSize = projectsPage?.limit ?? DEFAULT_PROJECTS_PAGE_SIZE;
  const currentPage = projectsPage?.page ?? page;

  useEffect(() => {
    if (totalProjects > 0 && projects.length === 0 && page > 1) {
      setPage((current) => Math.max(1, current - 1));
    }
  }, [totalProjects, projects.length, page]);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectedCount = selectedProjectIds.length;
  const allSelected =
    deletableFilteredProjectIds.length > 0 &&
    deletableFilteredProjectIds.every((id) => selectedProjectIds.includes(id));
  const indeterminate = selectedCount > 0 && !allSelected;

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      setSelectedProjectIds(checked ? deletableFilteredProjectIds : []);
    },
    [deletableFilteredProjectIds],
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

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {totalProjects === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, totalProjects)}
      </Text>{" "}
      of <Text as="span" weight="semibold">{totalProjects}</Text> projects
    </Text>
  );

  return (
    <QueryPageGuard
      query={projectsQuery}
      loading={<ProjectsPageSkeleton />}
      errorTitle="Unable to load projects"
    >
      <div className="mx-auto max-w-8xl">
        <ProjectsPageHeader
          selectedCount={selectedCount}
          onBulkDelete={canSelectProjects ? handleBulkDelete : undefined}
        />
        <ProjectsToolbar
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          teamFilter={teamFilter}
          teamFilterOptions={teamFilterOptions}
          viewMode={viewMode}
          totalProjects={filteredProjects.length}
          selectedCount={selectedCount}
          allSelected={allSelected}
          indeterminate={indeterminate}
          canSelect={canSelectProjects}
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
              selectable={deletableProjectIds.includes(project.id)}
              selected={selectedProjectIds.includes(project.id)}
              onSelectedChange={(selected) => handleProjectSelectedChange(project.id, selected)}
            />
          ))}
          {viewMode === "grid" && canCreateProject ? <ProjectTemplateCard /> : null}
        </div>

        {totalProjects > 0 ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <TablePaginationFooter
              summary={resultsSummary}
              current={currentPage}
              pageSize={pageSize}
              total={totalProjects}
              onChange={handlePageChange}
            />
          </div>
        ) : null}
      </div>
    </QueryPageGuard>
  );
}

export default React.memo(WorkspaceProjects);
