import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getAssignableProjectMembers,
  getProject,
  listProjects,
  updateProject,
} from "../api-services/project.service";
import type { CreateProjectRequest, UpdateProjectRequest } from "../types/project.types";

export const WORKSPACE_PROJECTS_QUERY_KEY = ["workspace-projects"] as const;
export const WORKSPACE_ASSIGNABLE_MEMBERS_QUERY_KEY = ["workspace-assignable-project-members"] as const;

export function workspaceProjectQueryKey(projectId: string) {
  return ["workspace-project", projectId] as const;
}

export function useProjects() {
  return useQuery({
    queryKey: WORKSPACE_PROJECTS_QUERY_KEY,
    queryFn: listProjects,
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
    queryFn: getAssignableProjectMembers,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_PROJECTS_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: WORKSPACE_PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: workspaceProjectQueryKey(variables.projectId) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workspace-team-members"] });
    },
  });
}
