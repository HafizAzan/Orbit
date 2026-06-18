import { CloudUploadOutlined, DeleteOutlined, DownloadOutlined, FileOutlined } from "@ant-design/icons";
import React, { useCallback, useId, useRef } from "react";
import type { TaskFormAttachment } from "../../../../data/workspace-task-form";
import { resolveTaskAttachmentUrl } from "../../../../lib/task-attachments";
import { toast } from "../../../../lib/toast";
import { cn } from "../../../../lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

type TaskAttachmentsFieldProps = {
  attachments: TaskFormAttachment[];
  onChange: (attachments: TaskFormAttachment[]) => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createAttachment(file: File): TaskFormAttachment {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  };
}

function TaskAttachmentsField({ attachments, onChange }: TaskAttachmentsFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const nextAttachments = [...attachments];
      let rejectedCount = 0;

      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          rejectedCount += 1;
          continue;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          rejectedCount += 1;
          continue;
        }

        const duplicate = nextAttachments.some(
          (item) => item.name === file.name && item.size === file.size && item.type === file.type,
        );

        if (duplicate) continue;

        nextAttachments.push(createAttachment(file));
      }

      if (rejectedCount > 0) {
        toast.error("Some files were skipped. Only PNG, JPG, or PDF up to 10MB are allowed.");
      }

      if (nextAttachments.length !== attachments.length) {
        onChange(nextAttachments);
      }
    },
    [attachments, onChange],
  );

  const removeAttachment = useCallback(
    (attachmentId: string) => {
      onChange(attachments.filter((item) => item.id !== attachmentId));
    },
    [attachments, onChange],
  );

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-feature-sync/40"
            : "border-border bg-background/60 hover:border-primary/30 hover:bg-background",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }

            event.target.value = "";
          }}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-feature-sync text-primary">
          <CloudUploadOutlined className="text-xl" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">Click to upload or drag and drop</p>
        <p className="mt-1 text-xs text-muted">PNG, JPG, PDF up to 10MB — add multiple files</p>
      </label>

      {attachments.length > 0 ? (
        <ul className="space-y-2">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-feature-sync text-primary">
                  <FileOutlined />
                </span>
                <div className="min-w-0">
                  {attachment.url ? (
                    <a
                      href={resolveTaskAttachmentUrl(attachment.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-medium text-primary hover:underline"
                    >
                      {attachment.name}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium text-foreground">{attachment.name}</p>
                  )}
                  <p className="text-xs text-muted">{formatFileSize(attachment.size)}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {attachment.url ? (
                  <a
                    href={resolveTaskAttachmentUrl(attachment.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-feature-sync hover:text-primary"
                    aria-label={`Download ${attachment.name}`}
                  >
                    <DownloadOutlined />
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${attachment.name}`}
                >
                  <DeleteOutlined />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default React.memo(TaskAttachmentsField);
