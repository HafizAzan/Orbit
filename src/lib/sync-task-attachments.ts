import type { TaskFormAttachment } from "../data/workspace-task-form";
import { deleteTaskAttachment, uploadTaskAttachment } from "../api-services/task.service";

export async function syncTaskAttachments(
  taskId: string,
  previousAttachments: TaskFormAttachment[],
  nextAttachments: TaskFormAttachment[],
) {
  const nextIds = new Set(nextAttachments.map((attachment) => attachment.id));

  for (const attachment of previousAttachments) {
    if (!attachment.url) continue;
    if (!nextIds.has(attachment.id)) {
      await deleteTaskAttachment(taskId, attachment.id);
    }
  }

  for (const attachment of nextAttachments) {
    if (!attachment.file) continue;
    await uploadTaskAttachment(taskId, attachment.file);
  }
}
