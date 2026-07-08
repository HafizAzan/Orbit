import type { ProjectDiscussionMessage } from "../data/workspace-project-detail";

export type ApiProjectComment = ProjectDiscussionMessage;

export type CreateProjectCommentRequest = {
  body: string;
};

export function mapApiProjectCommentToMessage(comment: ApiProjectComment): ProjectDiscussionMessage {
  return {
    id: comment.id,
    userName: comment.userName,
    message: comment.message,
    createdAt: comment.createdAt,
    avatarColor: comment.avatarColor,
    authorId: comment.authorId,
  };
}
