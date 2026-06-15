import { FileImageOutlined, FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import type { ProjectAttachmentItem } from "../../../data/workspace-project-detail";
import { cn } from "../../../lib/utils";

type ProjectAttachmentsCardProps = {
  items: ProjectAttachmentItem[];
};

function getAttachmentIcon(type: ProjectAttachmentItem["type"]) {
  if (type === "pdf") return FilePdfOutlined;
  return FileImageOutlined;
}

function ProjectAttachmentsCard({ items }: ProjectAttachmentsCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Attachments</h3>
        <button
          type="button"
          aria-label="Add attachment"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-background hover:text-primary"
        >
          <PlusOutlined />
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = getAttachmentIcon(item.type);

          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 transition-colors hover:bg-background"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  item.type === "pdf" ? "bg-red-50 text-red-600" : "bg-violet-50 text-violet-600",
                )}
              >
                <Icon className="text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.size} · {item.date}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default React.memo(ProjectAttachmentsCard);
