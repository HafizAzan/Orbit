import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getAssignableProjectMembers,
  getProject,
  listProjects,
  updateMyProjectTheme,
  updateProject,
} from "../api-services/project.service";
import type {
  CreateProjectRequest,
  ListProjectsParams,
  UpdateProjectRequest,
} from "../types/project.types";
import type { ProjectThemeId } from "../data/project-themes";
import {
  DEFAULT_PROJECTS_LIST_PARAMS,
  DEFAULT_PROJECTS_PAGE,
  DEFAULT_PROJECTS_PAGE_SIZE,
} from "../types/project.types";

export const WORKSPACE_PROJECTS_QUERY_KEY = ["workspace-projects"] as const;
export const WORKSPACE_ASSIGNABLE_MEMBERS_QUERY_KEY = ["workspace-assignable-project-members"] as const;

export function workspaceProjectsQueryKey(params: ListProjectsParams = {}) {
  return [...WORKSPACE_PROJECTS_QUERY_KEY, params] as const;
}

export function workspaceProjectQueryKey(projectId: string) {
  return ["workspace-project", projectId] as const;
}

export function useProjects(params: ListProjectsParams = DEFAULT_PROJECTS_LIST_PARAMS) {
  const page = params.page ?? DEFAULT_PROJECTS_PAGE;
  const limit = params.limit ?? DEFAULT_PROJECTS_PAGE_SIZE;
  const queryParams = { page, limit };

  return useQuery({
    queryKey: workspaceProjectsQueryKey(queryParams),
    queryFn: () => listProjects(queryParams),
    placeholderData: keepPreviousData,
  });
}

export function useProjectsForSelect() {
  return useQuery({
    queryKey: workspaceProjectsQueryKey(DEFAULT_PROJECTS_LIST_PARAMS),
    queryFn: () => listProjects(DEFAULT_PROJECTS_LIST_PARAMS),
    select: (response) => response.data,
  });
}

export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: workspaceProjectQueryKey(projectId ?? ""),
    queryFn: () => getProject(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useAssignableProjectMembers() {
  return useQuery({
    queryKey: WORKSPACE_ASSIGNABLE_MEMBERS_QUERY_KEY,
    queryFn: () => getAssignableProjectMembers(),
  });
}

function invalidateProjectLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: WORKSPACE_PROJECTS_QUERY_KEY });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      invalidateProjectLists(queryClient);
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ASSIGNABLE_MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workspace-team-members"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: UpdateProjectRequest;
    }) => updateProject(projectId, data),
    onSuccess: (_result, variables) => {
      invalidateProjectLists(queryClient);
      queryClient.invalidateQueries({ queryKey: workspaceProjectQueryKey(variables.projectId) });
    },
  });
}

export function useUpdateMyProjectTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      theme,
    }: {
      projectId: string;
      theme: ProjectThemeId;
    }) => updateMyProjectTheme(projectId, { theme }),
    onSuccess: (_result, variables) => {
      invalidateProjectLists(queryClient);
      queryClient.invalidateQueries({ queryKey: workspaceProjectQueryKey(variables.projectId) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      invalidateProjectLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["workspace-team-members"] });
    },
  });
}
