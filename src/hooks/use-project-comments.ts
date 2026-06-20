import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProjectComment,
  deleteProjectComment,
  listProjectComments,
} from "../api-services/project-comment.service";
import type { CreateProjectCommentRequest } from "../types/project-comment.types";

export const projectCommentsQueryKey = (projectId: string) =>
  ["project-comments", projectId] as const;

export function useProjectComments(projectId: string) {
  return useQuery({
    queryKey: projectCommentsQueryKey(projectId),
    queryFn: () => listProjectComments(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateProjectComment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectCommentRequest) => createProjectComment(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectCommentsQueryKey(projectId) });
      queryClient.invalidateQueries({ queryKey: ["workspace-projects"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-project", projectId] });
    },
  });
}

export function useDeleteProjectComment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteProjectComment(projectId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectCommentsQueryKey(projectId) });
      queryClient.invalidateQueries({ queryKey: ["workspace-projects"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-project", projectId] });
    },
  });
}
