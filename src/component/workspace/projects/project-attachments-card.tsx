import { FileImageOutlined, FilePdfOutlined } from "@ant-design/icons";
import React from "react";
import type { ProjectAttachmentItem } from "../../../data/workspace-project-detail";
import { resolveTaskAttachmentUrl } from "../../../lib/task-attachments";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

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
      <Title level={5} color="default" className="mb-5">Attachments</Title>

      {items.length === 0 ? (
        <Paragraph size="sm">No task attachments in this project yet.</Paragraph>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = getAttachmentIcon(item.type);
            const content = (
              <>
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    item.type === "pdf" ? "bg-red-50 text-red-600" : "bg-violet-50 text-violet-600",
                  )}
                >
                  <Icon className="text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text as="p" size="sm" weight="semibold" className="truncate">{item.name}</Text>
                  <Text as="p" size="xs" color="muted">
                    {item.size} · {item.date}
                  </Text>
                </div>
              </>
            );

            return (
              <li key={item.id}>
                {item.url ? (
                  <a
                    href={resolveTaskAttachmentUrl(item.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 transition-colors hover:border-primary/30 hover:bg-background"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

export default React.memo(ProjectAttachmentsCard);
