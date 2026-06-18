import { FileOutlined } from "@ant-design/icons";
import React from "react";
import type { ApiTaskAttachment } from "../../../types/task.types";
import { resolveTaskAttachmentUrl } from "../../../lib/task-attachments";

type TaskDetailAttachmentsProps = {
  attachments: ApiTaskAttachment[];
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function TaskDetailAttachments({ attachments }: TaskDetailAttachmentsProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-foreground">Attachments</h3>

      <ul className="mt-4 space-y-2">
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            <a
              href={resolveTaskAttachmentUrl(attachment.url)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-background"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-feature-sync text-primary">
                  <FileOutlined />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{attachment.fileName}</p>
                  <p className="text-xs text-muted">{formatFileSize(attachment.size)}</p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default React.memo(TaskDetailAttachments);
