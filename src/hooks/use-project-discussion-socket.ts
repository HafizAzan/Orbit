import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, joinProjectRoom, leaveProjectRoom } from "../config/socket";
import type { ApiProjectComment } from "../types/project-comment.types";
import { projectCommentsQueryKey } from "./use-project-comments";

type CommentCreatedPayload = {
  projectId: string;
  comment: ApiProjectComment;
};

type CommentDeletedPayload = {
  projectId: string;
  commentId: string;
};

function useProjectDiscussionSocket(projectId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    joinProjectRoom(projectId);
    const socket = getSocket();

    if (!socket) return;

    const handleCreated = (payload: CommentCreatedPayload) => {
      if (payload.projectId !== projectId) return;

      queryClient.setQueryData<ApiProjectComment[]>(projectCommentsQueryKey(projectId), (current = []) => {
        if (current.some((comment) => comment.id === payload.comment.id)) {
          return current;
        }

        return [...current, payload.comment];
      });
    };

    const handleDeleted = (payload: CommentDeletedPayload) => {
      if (payload.projectId !== projectId) return;

      queryClient.setQueryData<ApiProjectComment[]>(projectCommentsQueryKey(projectId), (current = []) =>
        current.filter((comment) => comment.id !== payload.commentId),
      );
    };

    socket.on("project:comment:created", handleCreated);
    socket.on("project:comment:deleted", handleDeleted);

    return () => {
      socket.off("project:comment:created", handleCreated);
      socket.off("project:comment:deleted", handleDeleted);
      leaveProjectRoom(projectId);
    };
  }, [projectId, queryClient]);
}

export default useProjectDiscussionSocket;
