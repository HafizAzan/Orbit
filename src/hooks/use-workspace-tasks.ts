import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getBoard,
  getDashboard,
  getReports,
  getTask,
  listBoards,
  listMyTasks,
  listTasksPage,
  updateTask,
} from "../api-services/task.service";
import type { CreateTaskRequest, UpdateTaskRequest } from "../types/task.types";
import type { DashboardPeriodFilter } from "../data/workspace-dashboard";
import type { PaginationParams } from "../types/pagination.types";

export const WORKSPACE_TASKS_QUERY_KEY = "workspace-tasks";
export const WORKSPACE_MY_TASKS_QUERY_KEY = ["workspace-my-tasks"] as const;
export const WORKSPACE_DASHBOARD_QUERY_KEY = ["workspace-dashboard"] as const;
export const WORKSPACE_REPORTS_QUERY_KEY = ["workspace-reports"] as const;
export const WORKSPACE_BOARDS_QUERY_KEY = ["workspace-boards"] as const;

export function workspaceTaskQueryKey(taskId: string) {
  return ["workspace-task", taskId] as const;
}

export function workspaceBoardQueryKey(projectId: string) {
  return ["workspace-board", projectId] as const;
}

export function useTasks(params: PaginationParams & { enabled?: boolean } = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const enabled = params.enabled ?? true;

  return useQuery({
    queryKey: [WORKSPACE_TASKS_QUERY_KEY, page, limit],
    queryFn: () => listTasksPage({ page, limit }),
    enabled,
  });
}

export function useMyTasks(params: PaginationParams & { enabled?: boolean } = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const enabled = params.enabled ?? true;

  return useQuery({
    queryKey: [...WORKSPACE_MY_TASKS_QUERY_KEY, page, limit],
    queryFn: () => listMyTasks({ page, limit }),
    enabled,
  });
}

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: workspaceTaskQueryKey(taskId ?? ""),
    queryFn: () => getTask(taskId!),
    enabled: Boolean(taskId),
  });
}

export function useWorkspaceDashboard(period: DashboardPeriodFilter = "this_month") {
  return useQuery({
    queryKey: [...WORKSPACE_DASHBOARD_QUERY_KEY, period],
    queryFn: () => getDashboard(period),
  });
}

export function useWorkspaceReports() {
  return useQuery({
    queryKey: WORKSPACE_REPORTS_QUERY_KEY,
    queryFn: getReports,
  });
}

export function useBoards(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: WORKSPACE_BOARDS_QUERY_KEY,
    queryFn: listBoards,
    enabled: options.enabled ?? true,
  });
}

export function useBoard(projectId: string | null) {
  return useQuery({
    queryKey: workspaceBoardQueryKey(projectId ?? ""),
    queryFn: () => getBoard(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_MY_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_BOARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workspace-board"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-projects"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      updateTask(taskId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_MY_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: workspaceTaskQueryKey(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_BOARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workspace-board"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-projects"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_MY_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_BOARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workspace-board"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-projects"] });
    },
  });
}
