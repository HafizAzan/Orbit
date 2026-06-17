import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  ApiWorkspaceProject,
  AssignableProjectMember,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const listProjects = async (): Promise<ApiWorkspaceProject[]> => {
  const response = await ApiService.get(API_ROUTES.PROJECTS.LIST, AUTH_REQUEST);
  return assertApiSuccess<ApiWorkspaceProject[]>(response);
};

const getProject = async (projectId: string): Promise<ApiWorkspaceProject> => {
  const response = await ApiService.get(`${API_ROUTES.PROJECTS.LIST}/${projectId}`, AUTH_REQUEST);
  return assertApiSuccess<ApiWorkspaceProject>(response);
};

const createProject = async (data: CreateProjectRequest): Promise<ApiWorkspaceProject> => {
  const response = await ApiService.post(API_ROUTES.PROJECTS.LIST, data, AUTH_REQUEST);
  return assertApiSuccess<ApiWorkspaceProject>(response);
};

const updateProject = async (
  projectId: string,
  data: UpdateProjectRequest,
): Promise<ApiWorkspaceProject> => {
  const response = await ApiService.patch(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ApiWorkspaceProject>(response);
};

const deleteProject = async (projectId: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

const getAssignableProjectMembers = async (): Promise<AssignableProjectMember[]> => {
  const response = await ApiService.get(API_ROUTES.PROJECTS.ASSIGNABLE_MEMBERS, AUTH_REQUEST);
  return assertApiSuccess<AssignableProjectMember[]>(response);
};

export {
  createProject,
  deleteProject,
  getAssignableProjectMembers,
  getProject,
  listProjects,
  updateProject,
};
