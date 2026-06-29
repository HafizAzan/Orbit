import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyTasksAssignedSection from "../../component/workspace/my-tasks/my-tasks-assigned-section";
import MyTasksCalendarView from "../../component/workspace/my-tasks/my-tasks-calendar-view";
import MyTasksCompletedSection from "../../component/workspace/my-tasks/my-tasks-completed-section";
import MyTasksDueTodaySection from "../../component/workspace/my-tasks/my-tasks-due-today-section";
import MyTasksFilterBar from "../../component/workspace/my-tasks/my-tasks-filter-bar";
import MyTasksPageHeader from "../../component/workspace/my-tasks/my-tasks-page-header";
import type { MyTasksViewMode } from "../../component/workspace/my-tasks/my-tasks-page-header";
import MyTasksUpcomingSection from "../../component/workspace/my-tasks/my-tasks-upcoming-section";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { MyTasksPageSkeleton } from "../../component/skeletons";
import {
  buildMyTasksProjectFilterOptions,
  DEFAULT_MY_TASKS_FILTERS,
  type MyTask,
  type MyTasksFilters,
} from "../../data/workspace-my-tasks";
import { getTaskDetailPath } from "../../data/workspace-task-form";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useMyTasks, useUpdateTask } from "../../hooks/use-workspace-tasks";
import { createWorkspaceNavState } from "../../lib/workspace-navigation";
import {
  countRemainingMyTasks,
  filterMyTasks,
  groupMyTasksByBucket,
} from "../../lib/workspace-my-tasks-utils";
import { showApiErrorToast } from "../../lib/api-error";
import { mapApiTaskToMyTask } from "../../types/task.types";
import { WORKSPACE_ROUTES } from "../../router/workspace-routes";
import { toast } from "../../lib/toast";

function WorkspaceMyTasksContent() {
  const navigate = useNavigate();
  const { can } = useWorkspacePermissions();
  const canCreateTask = can("task.create");
  const myTasksQuery = useMyTasks();
  const { data = [] } = myTasksQuery;
  const { mutateAsync: updateTask } = useUpdateTask();
  const [viewMode, setViewMode] = useState<MyTasksViewMode>("list");
  const [filters, setFilters] = useState<MyTasksFilters>(DEFAULT_MY_TASKS_FILTERS);

  const tasks = useMemo(() => data.map(mapApiTaskToMyTask), [data]);

  const filteredTasks = useMemo(() => filterMyTasks(tasks, filters), [filters, tasks]);
  const groupedTasks = useMemo(() => groupMyTasksByBucket(filteredTasks), [filteredTasks]);
  const remainingCount = useMemo(() => countRemainingMyTasks(filteredTasks), [filteredTasks]);
  const projectFilterOptions = useMemo(() => buildMyTasksProjectFilterOptions(tasks), [tasks]);

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
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [updateTask],
  );

  const handleClearCompleted = useCallback(() => {
    toast.success("Completed tasks remain in history — filter or archive coming soon");
  }, []);

  return (
    <QueryPageGuard
      query={myTasksQuery}
      loading={<MyTasksPageSkeleton />}
      errorTitle="Unable to load your tasks"
    >
      <div className="mx-auto max-w-8xl">
        <MyTasksPageHeader viewMode={viewMode} onViewModeChange={setViewMode} />

        {viewMode === "list" ? (
          <>
            <MyTasksFilterBar
              filters={filters}
              remainingCount={remainingCount}
              projectOptions={projectFilterOptions}
              onChange={handleFilterChange}
            />

            <MyTasksDueTodaySection
              tasks={groupedTasks.due_today}
              canCreateTask={canCreateTask}
              onOpenTask={handleOpenTask}
            />

            <MyTasksAssignedSection
              tasks={groupedTasks.assigned}
              onToggleComplete={handleToggleComplete}
              onOpenTask={handleOpenTask}
            />

            <MyTasksUpcomingSection tasks={groupedTasks.upcoming} onOpenTask={handleOpenTask} />

            <MyTasksCompletedSection count={groupedTasks.completed.length} onClearAll={handleClearCompleted} />
          </>
        ) : (
          <MyTasksCalendarView />
        )}
      </div>
    </QueryPageGuard>
  );
}

function WorkspaceMyTasks() {
  return (
    <WorkspaceRoleGate
      permission="my_tasks.view"
      title="My Tasks access restricted"
      description="This personal task view is available to workspace members."
    >
      <WorkspaceMyTasksContent />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceMyTasks);
