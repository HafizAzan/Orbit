import React, { useCallback, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import TasksTable from "../../component/workspace/tasks/tasks-table";
import WorkspaceNavLink from "../../component/workspace/common/workspace-nav-link";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { TableListPageSkeleton } from "../../component/skeletons";
import { getTaskCreatePath } from "../../data/workspace-task-form";
import { WORKSPACE_TASKS_PAGE_SIZE } from "../../data/workspace-tasks";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useDeleteTask, useTasks } from "../../hooks/use-workspace-tasks";
import { showApiErrorToast, showApiSuccessToast } from "../../lib/api-error";
import { pluralize } from "../../lib/helper";
import { mapApiTaskToWorkspaceTask } from "../../types/task.types";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceTasksContent() {
  const { can } = useWorkspacePermissions();
  const [page, setPage] = useState(1);
  const tasksQuery = useTasks({ page, limit: WORKSPACE_TASKS_PAGE_SIZE });
  const tasksPage = tasksQuery.data;
  const data = tasksPage?.data ?? [];
  const totalTasks = tasksPage?.total ?? 0;
  const { mutateAsync: deleteTask } = useDeleteTask();
  const canCreateTask = can("task.create");

  const tasks = useMemo(() => data.map(mapApiTaskToWorkspaceTask), [data]);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const createButton = canCreateTask ? (
    <WorkspaceNavLink to={getTaskCreatePath()}>
      <Button type="primary" icon={<PlusOutlined />} size="large" className="font-semibold!">
        Create Task
      </Button>
    </WorkspaceNavLink>
  ) : null;

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      const result = await deleteTask(taskId);
      showApiSuccessToast(result.message);
    },
    [deleteTask],
  );

  const handleBulkDelete = useCallback(
    async (taskIds: string[]) => {
      try {
        for (const taskId of taskIds) {
          await deleteTask(taskId);
        }

        showApiSuccessToast(`${taskIds.length} ${pluralize(taskIds.length, "task")} deleted successfully`);
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [deleteTask],
  );

  return (
    <QueryPageGuard
      query={tasksQuery}
      loading={<TableListPageSkeleton columns={7} />}
      errorTitle="Unable to load tasks"
    >
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Title level={2} className="text-2xl text-foreground lg:text-3xl">
              Tasks
            </Title>
            <Paragraph size="sm" className="mt-1 text-muted">
              Manage, track and assign team workflow efficiently.
            </Paragraph>
          </div>

          {createButton}
        </div>

        <TasksTable
          data={tasks}
          emptyAction={createButton}
          onBulkDelete={handleBulkDelete}
          onDeleteTask={handleDeleteTask}
          serverPagination={{
            page: tasksPage?.page ?? page,
            pageSize: tasksPage?.limit ?? WORKSPACE_TASKS_PAGE_SIZE,
            total: totalTasks,
            onChange: handlePageChange,
          }}
        />
      </div>
    </QueryPageGuard>
  );
}

function WorkspaceTasks() {
  return (
    <WorkspaceRoleGate
      permission="tasks.view_all"
      title="Team tasks access restricted"
      description="Members use My Tasks for their personal workload. Contact your workspace admin if you need broader access."
    >
      <WorkspaceTasksContent />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceTasks);
