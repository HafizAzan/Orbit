import type {
  ProjectActivityItem,
  ProjectAttachmentItem,
} from "../data/workspace-project-detail";
import type { ApiWorkspaceTask } from "../types/task.types";
import { TASK_STATUS_CONFIG } from "../data/workspace-tasks";
import { formatDate } from "./helper";

export function computeRemainingDays(dueDate: string | null | undefined) {
  if (!dueDate) return 0;

  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
}

export function formatProjectEstimatedHours(hours: number) {
  if (hours <= 0) return "0h";
  return `${hours}h`;
}

function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(isoDate);
}

function formatAttachmentSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveAttachmentType(mimeType: string): ProjectAttachmentItem["type"] {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.startsWith("image/")) return "design";
  return "doc";
}

export function mapProjectTasksToActivities(tasks: ApiWorkspaceTask[]): ProjectActivityItem[] {
  return [...tasks]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 10)
    .map((task) => ({
      id: task.id,
      userName: task.assignee?.name ?? "Team member",
      action:
        task.status === "done"
          ? "completed task"
          : `moved task to ${TASK_STATUS_CONFIG[task.status].label.toLowerCase()}`,
      target: task.title,
      timeAgo: formatRelativeTime(task.updatedAt),
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    }));
}

export function mapProjectTasksToAttachments(tasks: ApiWorkspaceTask[]): ProjectAttachmentItem[] {
  return tasks
    .flatMap((task) =>
      (task.attachments ?? []).map((attachment) => ({
        id: attachment.id,
        name: attachment.fileName,
        size: formatAttachmentSize(attachment.size),
        date: formatDate(attachment.createdAt),
        type: resolveAttachmentType(attachment.mimeType),
        url: attachment.url,
      })),
    )
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function resolveProjectPhaseLabel(status: string) {
  if (status === "on_track") return "Execution Phase";
  if (status === "delayed") return "Recovery Phase";
  return "Planning Phase";
}
