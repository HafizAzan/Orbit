import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  ApiWorkspaceTask,
  CreateTaskRequest,
  ProjectBoardSummary,
  UpdateTaskRequest,
  WorkspaceDashboardResponse,
  WorkspaceKanbanBoardResponse,
  WorkspaceReportsResponse,
} from "../types/task.types";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const listTasks = async (params: PaginationParams = {}): Promise<ApiWorkspaceTask[]> => {
  const page = await listTasksPage(params);
  return page.data;
};

const listTasksPage = async (
  params: PaginationParams = {},
): Promise<PaginatedResponse<ApiWorkspaceTask>> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.TASKS.LIST}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ApiWorkspaceTask>(assertApiSuccess<unknown>(response));
};

const listMyTasks = async (params: PaginationParams = {}): Promise<ApiWorkspaceTask[]> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.TASKS.MY}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ApiWorkspaceTask>(assertApiSuccess<unknown>(response)).data;
};

const getTask = async (taskId: string): Promise<ApiWorkspaceTask> => {
  const response = await ApiService.get(`${API_ROUTES.TASKS.LIST}/${taskId}`, AUTH_REQUEST);
  return assertApiSuccess<ApiWorkspaceTask>(response);
};

const createTask = async (data: CreateTaskRequest): Promise<ApiWorkspaceTask> => {
  const response = await ApiService.post(API_ROUTES.TASKS.LIST, data, AUTH_REQUEST);
  return assertApiSuccess<ApiWorkspaceTask>(response);
};

const updateTask = async (
  taskId: string,
  data: UpdateTaskRequest,
): Promise<ApiWorkspaceTask> => {
  const response = await ApiService.patch(
    `${API_ROUTES.TASKS.LIST}/${taskId}`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ApiWorkspaceTask>(response);
};

const uploadTaskAttachment = async (taskId: string, file: File): Promise<ApiWorkspaceTask["attachments"][number]> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await ApiService.post(
    `${API_ROUTES.TASKS.LIST}/${taskId}/attachments`,
    formData,
    {
      requireAuth: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return assertApiSuccess<ApiWorkspaceTask["attachments"][number]>(response);
};

const deleteTaskAttachment = async (
  taskId: string,
  attachmentId: string,
): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.TASKS.LIST}/${taskId}/attachments/${attachmentId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

const deleteTask = async (taskId: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(`${API_ROUTES.TASKS.LIST}/${taskId}`, AUTH_REQUEST);
  return assertApiSuccess<{ message: string }>(response);
};

const getDashboard = async (): Promise<WorkspaceDashboardResponse> => {
  const response = await ApiService.get(API_ROUTES.TASKS.DASHBOARD, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceDashboardResponse>(response);
};

const getReports = async (): Promise<WorkspaceReportsResponse> => {
  const response = await ApiService.get(API_ROUTES.TASKS.REPORTS, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceReportsResponse>(response);
};

const listBoards = async (): Promise<ProjectBoardSummary[]> => {
  const response = await ApiService.get(API_ROUTES.TASKS.BOARDS, AUTH_REQUEST);
  return assertApiSuccess<ProjectBoardSummary[]>(response);
};

const getBoard = async (projectId: string): Promise<WorkspaceKanbanBoardResponse> => {
  const response = await ApiService.get(`${API_ROUTES.TASKS.BOARDS}/${projectId}`, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceKanbanBoardResponse>(response);
};

export {
  createTask,
  deleteTask,
  deleteTaskAttachment,
  getBoard,
  getDashboard,
  getReports,
  getTask,
  listBoards,
  listMyTasks,
  listTasks,
  listTasksPage,
  updateTask,
  uploadTaskAttachment,
};
