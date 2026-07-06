import { SendOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useState } from "react";
import type { ProjectDiscussionMessage } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProjectDiscussionCardProps = {
  messages: ProjectDiscussionMessage[];
  currentUserId?: string;
  loading?: boolean;
  refreshing?: boolean;
  submitting?: boolean;
  onSubmit?: (message: string) => Promise<void> | void;
  onDelete?: (commentId: string) => Promise<void> | void;
  onRefresh?: () => void;
};

function ProjectDiscussionCard({
  messages,
  currentUserId,
  loading = false,
  refreshing = false,
  submitting = false,
  onSubmit,
  onDelete,
  onRefresh,
}: ProjectDiscussionCardProps) {
  const [draft, setDraft] = useState("");

  const handleSubmit = async () => {
    const message = draft.trim();
    if (!message || !onSubmit || submitting) return;

    await onSubmit(message);
    setDraft("");
  };

  return (
    <article id="project-discussion" className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <Title level={5} color="default">Discussion</Title>
        {onRefresh ? (
          <Button
            type="default"
            aria-label="Refresh comments"
            disabled={loading || refreshing}
            onClick={onRefresh}
            icon={<ReloadOutlined spin={refreshing} />}
            className="rounded-xl!"
          />
        ) : null}
      </div>

      {loading ? (
        <Paragraph size="sm" className="mt-5">Loading discussion...</Paragraph>
      ) : messages.length === 0 ? (
        <Paragraph size="sm" className="mt-5">No project comments yet. Start the conversation.</Paragraph>
      ) : (
        <ul className="mt-5 max-h-60 min-h-24 space-y-4 overflow-y-auto pr-1">
          {messages.map((message) => (
            <li key={message.id} className="flex gap-3">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold", message.avatarColor)}>
                {getInitial(message.userName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Text as="span" size="sm" weight="semibold">{message.userName}</Text>
                  <Text as="span" size="xs" color="muted">{message.timeAgo}</Text>
                </div>
                <Text as="p" size="sm" className="mt-1 rounded-2xl bg-muted-surface px-3 py-2">{message.message}</Text>
                {currentUserId && message.authorId === currentUserId && onDelete ? (
                  <Button type="link" danger size="small" onClick={() => onDelete(message.id)} className="h-auto px-0">
                    Delete
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center gap-2">
        <Input
          placeholder="Add a comment..."
          size="large"
          value={draft}
          disabled={!onSubmit || submitting}
          onChange={(event) => setDraft(event.target.value)}
          onPressEnter={() => {
            void handleSubmit();
          }}
          className="rounded-xl!"
        />
        <Button
          type="primary"
          aria-label="Send comment"
          disabled={!onSubmit || submitting || !draft.trim()}
          onClick={() => {
            void handleSubmit();
          }}
          icon={<SendOutlined />}
          className="h-10 w-10 shrink-0 rounded-xl!"
        />
      </div>
    </article>
  );
}

export default React.memo(ProjectDiscussionCard);
