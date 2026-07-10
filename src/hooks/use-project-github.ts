import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectGithubStatus,
  linkProjectGithub,
} from "../api-services/project.service";
import type { LinkProjectGithubRequest } from "../api-services/project.service";
import { workspaceProjectQueryKey } from "./use-workspace-projects";

export function projectGithubStatusQueryKey(projectId: string) {
  return ["project-github-status", projectId] as const;
}

export function useProjectGithubStatus(projectId: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: projectGithubStatusQueryKey(projectId),
    queryFn: () => getProjectGithubStatus(projectId),
    enabled: options.enabled ?? Boolean(projectId),
    refetchInterval: 60_000,
  });
}

export function useLinkProjectGithub(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkProjectGithubRequest) => linkProjectGithub(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectGithubStatusQueryKey(projectId) });
      queryClient.invalidateQueries({ queryKey: workspaceProjectQueryKey(projectId) });
    },
  });
}
