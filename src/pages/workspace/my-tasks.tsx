import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageSeo from "../../component/seo/page-seo";
import MyTasksAssignedSection from "../../component/workspace/my-tasks/my-tasks-assigned-section";
import MyTasksCompletedSection from "../../component/workspace/my-tasks/my-tasks-completed-section";
import MyTasksDueTodaySection from "../../component/workspace/my-tasks/my-tasks-due-today-section";
import MyTasksFilterBar from "../../component/workspace/my-tasks/my-tasks-filter-bar";
import MyTasksPageHeader, {
  DEFAULT_MY_TASKS_VIEW,
  MY_TASKS_VIEW_SLUGS,
  type MyTasksViewMode,
} from "../../component/workspace/my-tasks/my-tasks-page-header";
import MyTasksUpcomingSection from "../../component/workspace/my-tasks/my-tasks-upcoming-section";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { MyTasksPageSkeleton } from "../../component/skeletons";
import { buildMyTasksProjectFilterOptions, DEFAULT_MY_TASKS_FILTERS, type MyTask, type MyTasksFilters } from "../../data/workspace-my-tasks";
import { getTaskDetailPath } from "../../data/workspace-task-form";
import useUrlTab from "../../hooks/use-url-tab";
import { useMyTasks, useUpdateTask } from "../../hooks/use-workspace-tasks";
import { createWorkspaceNavState } from "../../lib/workspace-navigation";
import { computeMyTasksStats, countRemainingMyTasks, filterMyTasks, groupMyTasksByBucket } from "../../lib/workspace-my-tasks-utils";
import { showApiErrorToast } from "../../lib/api-error";
import { mapApiTaskToMyTask } from "../../types/task.types";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";
import { Paragraph, Text } from "../../component/ui/typography";

function WorkspaceMyTasksContent() {
  const navigate = useNavigate();
  const myTasksQuery = useMyTasks();
  const { data = [] } = myTasksQuery;
  const { mutateAsync: updateTask } = useUpdateTask();
  const { activeTab: viewMode, setActiveTab: setViewMode } = useUrlTab<MyTasksViewMode>({
    slugToKey: MY_TASKS_VIEW_SLUGS,
    defaultKey: DEFAULT_MY_TASKS_VIEW,
  });
  const [filters, setFilters] = useState<MyTasksFilters>(DEFAULT_MY_TASKS_FILTERS);
  const [hideCompleted, setHideCompleted] = useState(false);

  const tasks = useMemo(() => data.map(mapApiTaskToMyTask), [data]);
  const stats = useMemo(() => computeMyTasksStats(tasks), [tasks]);

  const filteredTasks = useMemo(() => filterMyTasks(tasks, filters), [filters, tasks]);
  const groupedTasks = useMemo(() => groupMyTasksByBucket(filteredTasks), [filteredTasks]);
  const remainingCount = useMemo(() => countRemainingMyTasks(filteredTasks), [filteredTasks]);
  const projectFilterOptions = useMemo(() => buildMyTasksProjectFilterOptions(tasks), [tasks]);
  const hiddenCompletedCount = hideCompleted ? groupedTasks.completed.length : 0;

  const handleFilterChange = useCallback((key: keyof MyTasksFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const handleOpenTask = useCallback(
    (task: MyTask) => {
      navigate(getTaskDetailPath(task.id), createWorkspaceNavState(WORKSPACE_ROUTES.MY_TASKS, "My Tasks"));
    },
    [navigate],
  );

  const handleToggleComplete = useCallback(
    async (taskId: string, completed: boolean) => {
      try {
        await updateTask({
          taskId,
          data: { status: completed ? "done" : "in_progress" },
        });
        if (!completed) {
          setHideCompleted(false);
        }
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [updateTask],
  );

  const handleHideCompleted = useCallback(() => {
    setHideCompleted(true);
  }, []);

  const handleShowCompleted = useCallback(() => {
    setHideCompleted(false);
  }, []);

  return (
    <QueryPageGuard query={myTasksQuery} loading={<MyTasksPageSkeleton />} errorTitle="Unable to load your tasks">
      <div className="mx-auto max-w-8xl">
        <MyTasksPageHeader viewMode={viewMode} stats={stats} onViewModeChange={setViewMode} />

        <MyTasksFilterBar filters={filters} remainingCount={remainingCount} projectOptions={projectFilterOptions} onChange={handleFilterChange} />

        {hideCompleted && hiddenCompletedCount > 0 ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
            <Text as="span" size="sm" color="muted">
              {hiddenCompletedCount} completed {hiddenCompletedCount === 1 ? "task" : "tasks"} hidden from view.
            </Text>
            <button type="button" onClick={handleShowCompleted} className="text-sm font-semibold text-primary transition-opacity hover:opacity-80">
              Show completed
            </button>
          </div>
        ) : null}

        <MyTasksDueTodaySection tasks={groupedTasks.due_today} onOpenTask={handleOpenTask} />

        <MyTasksAssignedSection tasks={groupedTasks.assigned} onToggleComplete={handleToggleComplete} onOpenTask={handleOpenTask} />

        <MyTasksUpcomingSection tasks={groupedTasks.upcoming} onOpenTask={handleOpenTask} />

        {!hideCompleted ? (
          <MyTasksCompletedSection
            tasks={groupedTasks.completed}
            onClearAll={handleHideCompleted}
            onOpenTask={handleOpenTask}
            onToggleComplete={handleToggleComplete}
          />
        ) : null}

        {filteredTasks.length === 0 ? (
          <Paragraph size="sm" className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted">
            No tasks match your filters. Try adjusting status, priority, or project.
          </Paragraph>
        ) : null}
      </div>
    </QueryPageGuard>
  );
}

function WorkspaceMyTasks() {
  return (
    <>
      <PageSeo title="My Tasks" description="View and manage your personally assigned tasks." noIndex />
      <WorkspaceRoleGate
        permission="my_tasks.view"
        title="My Tasks access restricted"
        description="This personal task view is available to workspace members."
      >
        <WorkspaceMyTasksContent />
      </WorkspaceRoleGate>
    </>
  );
}

export default React.memo(WorkspaceMyTasks);
