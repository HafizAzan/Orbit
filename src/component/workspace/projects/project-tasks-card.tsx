import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useMemo } from 'react';
import { getProjectBoardPath } from '../../../data/workspace-project-detail';
import { getTaskCreatePath, getTaskDetailPath } from '../../../data/workspace-task-form';
import {
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  type WorkspaceTaskPriority,
  type WorkspaceTaskStatus,
} from '../../../data/workspace-tasks';
import useWorkspacePermissions from '../../../hooks/use-workspace-permissions';
import { resolveBadgeClass, useIsDarkAppTheme } from '../../../lib/app-ui-theme-utils';
import { formatDate } from '../../../lib/helper';
import { cn } from '../../../lib/utils';
import type { ApiWorkspaceTask } from '../../../types/task.types';
import { Paragraph, Text, Title } from '../../ui/typography';
import WorkspaceNavLink from '../common/workspace-nav-link';

const STATUS_ORDER: WorkspaceTaskStatus[] = ['in_progress', 'review', 'todo', 'done'];
const PRIORITY_ORDER: WorkspaceTaskPriority[] = ['critical', 'high', 'medium', 'low'];

type ProjectTasksCardProps = {
  projectId: string;
  tasks: ApiWorkspaceTask[];
  loading?: boolean;
};

function sortProjectTasks(tasks: ApiWorkspaceTask[]) {
  return [...tasks].sort((left, right) => {
    const leftDone = left.status === 'done' ? 1 : 0;
    const rightDone = right.status === 'done' ? 1 : 0;
    if (leftDone !== rightDone) return leftDone - rightDone;

    const leftStatus = STATUS_ORDER.indexOf(left.status);
    const rightStatus = STATUS_ORDER.indexOf(right.status);
    if (leftStatus !== rightStatus) return leftStatus - rightStatus;

    const leftPriority = PRIORITY_ORDER.indexOf(left.priority);
    const rightPriority = PRIORITY_ORDER.indexOf(right.priority);
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;

    if (left.dueDate && right.dueDate) {
      return left.dueDate.localeCompare(right.dueDate);
    }

    if (left.dueDate) return -1;
    if (right.dueDate) return 1;

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

function ProjectTasksCard({ projectId, tasks, loading = false }: ProjectTasksCardProps) {
  const { can } = useWorkspacePermissions();
  const isDark = useIsDarkAppTheme();
  const canCreateTask = can('task.create');

  const statusCounts = useMemo(() => {
    return (Object.keys(TASK_STATUS_CONFIG) as WorkspaceTaskStatus[]).map((status) => ({
      status,
      count: tasks.filter((task) => task.status === status).length,
      ...TASK_STATUS_CONFIG[status],
    }));
  }, [tasks]);

  const visibleTasks = useMemo(() => sortProjectTasks(tasks).slice(0, 8), [tasks]);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Title level={5} color="default">
            Project Tasks
          </Title>
          <Paragraph size="sm" className="mt-1">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this project
          </Paragraph>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <WorkspaceNavLink to={getProjectBoardPath(projectId)} preserveReturn>
            <Button icon={<AppstoreOutlined />} className="font-semibold!">
              View Board
            </Button>
          </WorkspaceNavLink>
          {canCreateTask ? (
            <WorkspaceNavLink to={getTaskCreatePath(projectId)} preserveReturn>
              <Button type="primary" icon={<PlusOutlined />} className="font-semibold!">
                Add Task
              </Button>
            </WorkspaceNavLink>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {statusCounts.map((item) => (
          <div
            key={item.status}
            className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-center"
          >
            <Text as="p" size="lg" weight="bold" className="tabular-nums">
              {item.count}
            </Text>
            <Text
              as="p"
              size="xs"
              weight="semibold"
              color="muted"
              className="mt-0.5 text-[11px]! tracking-wide uppercase"
            >
              {item.label}
            </Text>
          </div>
        ))}
      </div>

      {loading ? (
        <Paragraph size="sm" className="mt-5">
          Loading tasks...
        </Paragraph>
      ) : visibleTasks.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-background/50 px-4 py-8 text-center">
          <Text as="p" size="sm" weight="medium">
            No tasks yet
          </Text>
          <Paragraph size="sm" className="mt-1">
            Create the first task to start tracking delivery work.
          </Paragraph>
          {canCreateTask ? (
            <WorkspaceNavLink
              to={getTaskCreatePath(projectId)}
              preserveReturn
              className="mt-4 inline-block"
            >
              <Button type="primary" icon={<PlusOutlined />} className="font-semibold!">
                Create Task
              </Button>
            </WorkspaceNavLink>
          ) : null}
        </div>
      ) : (
        <ul className="mt-5 max-h-50 min-h-50 divide-y divide-border overflow-y-auto overscroll-contain rounded-xl border border-border bg-background/40">
          {visibleTasks.map((task) => {
            const statusConfig = TASK_STATUS_CONFIG[task.status];
            const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];

            return (
              <li key={task.id}>
                <WorkspaceNavLink
                  to={getTaskDetailPath(task.id)}
                  preserveReturn
                  className="flex flex-col gap-3 px-4 py-3 no-underline transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold tracking-wide text-muted uppercase">
                        {task.taskCode}
                      </span>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide',
                          resolveBadgeClass(statusConfig.badgeClass, isDark),
                        )}
                      >
                        {statusConfig.label}
                      </span>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide',
                          resolveBadgeClass(priorityConfig.badgeClass, isDark),
                        )}
                      >
                        {priorityConfig.label}
                      </span>
                    </div>
                    <Text as="p" size="sm" weight="semibold" className="mt-1 truncate">
                      {task.title}
                    </Text>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                    <Text as="span" size="xs" color="muted">
                      {task.assignee?.name ?? 'Unassigned'}
                    </Text>
                    <Text as="span" size="xs" color="muted">
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </Text>
                  </div>
                </WorkspaceNavLink>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

export default React.memo(ProjectTasksCard);
