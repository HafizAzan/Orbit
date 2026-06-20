import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  ApiProjectComment,
  CreateProjectCommentRequest,
} from "../types/project-comment.types";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const listProjectComments = async (
  projectId: string,
  params: PaginationParams = {},
): Promise<ApiProjectComment[]> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}/comments?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ApiProjectComment>(assertApiSuccess<unknown>(response)).data;
};

const createProjectComment = async (
  projectId: string,
  data: CreateProjectCommentRequest,
): Promise<ApiProjectComment> => {
  const response = await ApiService.post(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}/comments`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ApiProjectComment>(response);
};

const deleteProjectComment = async (
  projectId: string,
  commentId: string,
): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.PROJECTS.LIST}/${projectId}/comments/${commentId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

export { createProjectComment, deleteProjectComment, listProjectComments };
