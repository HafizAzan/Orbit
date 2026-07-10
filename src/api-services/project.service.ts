import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";
import type {
  ApiWorkspaceProject,
  AssignableProjectMember,
  CreateProjectRequest,
  ListProjectsParams,
  PaginatedProjectsResponse,
  UpdateMyProjectThemeRequest,
  UpdateProjectRequest,
} from "../types/project.types";
import { DEFAULT_PROJECTS_PAGE, DEFAULT_PROJECTS_PAGE_SIZE } from "../types/project.types";

const AUTH_REQUEST = { requireAuth: true } as const;

function normalizePaginatedProjects(data: unknown): PaginatedProjectsResponse {
  return normalizePaginatedResponse<ApiWorkspaceProject>(
    data,
    DEFAULT_PROJECTS_PAGE_SIZE,
  );
}

const listProjects = async (params: ListProjectsParams = {}): Promise<PaginatedProjectsResponse> => {
  const page = params.page ?? DEFAULT_PROJECTS_PAGE;
  const limit = params.limit ?? DEFAULT_PROJECTS_PAGE_SIZE;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const url = `${API_ROUTES.PROJECTS.LIST}?${searchParams.toString()}`;
  const response = await ApiService.get(url, AUTH_REQUEST);
  return normalizePaginatedProjects(assertApiSuccess<unknown>(response));
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

const updateMyProjectTheme = async (
  projectId: string,
  data: UpdateMyProjectThemeRequest,
): Promise<ApiWorkspaceProject> => {
  const response = await ApiService.patch(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}/my-theme`,
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

const getAssignableProjectMembers = async (
  params: PaginationParams = {},
): Promise<AssignableProjectMember[]> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.PROJECTS.ASSIGNABLE_MEMBERS}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<AssignableProjectMember>(
    assertApiSuccess<unknown>(response),
  ).data;
};

export type LinkProjectGithubRequest = {
  repoFullName?: string;
  unlink?: boolean;
};

export type LinkProjectGithubResponse = {
  message: string;
  githubRepoFullName: string | null;
  githubWebhookSecret: string | null;
  webhookUrl: string | null;
};

export type GithubCommit = {
  sha: string;
  message: string;
  author: string;
  url: string;
  committedAt: string;
};

export type GithubPullRequest = {
  number: number;
  title: string;
  state: string;
  url: string;
  author: string;
  updatedAt: string;
};

export type GithubCheck = {
  name: string;
  status: string;
  conclusion: string | null;
  url: string;
};

export type ProjectGithubStatusResponse = {
  linked: boolean;
  repoFullName: string | null;
  webhookUrl: string | null;
  commits: GithubCommit[];
  pullRequests: GithubPullRequest[];
  checks: GithubCheck[];
  warning?: string;
};

const linkProjectGithub = async (
  projectId: string,
  data: LinkProjectGithubRequest,
): Promise<LinkProjectGithubResponse> => {
  const response = await ApiService.patch(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}/github`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<LinkProjectGithubResponse>(response);
};

const getProjectGithubStatus = async (projectId: string): Promise<ProjectGithubStatusResponse> => {
  const response = await ApiService.get(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}/github/status`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ProjectGithubStatusResponse>(response);
};

export {
  createProject,
  deleteProject,
  getAssignableProjectMembers,
  getProject,
  linkProjectGithub,
  getProjectGithubStatus,
  listProjects,
  updateMyProjectTheme,
  updateProject,
};
