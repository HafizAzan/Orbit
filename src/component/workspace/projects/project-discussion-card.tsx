import { SendOutlined, ReloadOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useState } from "react";
import type { ProjectDiscussionMessage } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";

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
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Discussion</h3>
        {onRefresh ? (
          <button
            type="button"
            aria-label="Refresh comments"
            disabled={loading || refreshing}
            onClick={onRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ReloadOutlined spin={refreshing} />
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-muted">Loading discussion...</p>
      ) : messages.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No project comments yet. Start the conversation.</p>
      ) : (
        <ul className="mt-5 max-h-80 min-h-24 space-y-4 overflow-y-auto pr-1">
          {messages.map((message) => (
            <li key={message.id} className="flex gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  message.avatarColor,
                )}
              >
                {getInitial(message.userName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{message.userName}</span>
                  <span className="text-xs text-muted">{message.timeAgo}</span>
                </div>
                <p className="mt-1 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-foreground">{message.message}</p>
                {currentUserId && message.authorId === currentUserId && onDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(message.id)}
                    className="mt-1 text-xs font-medium text-muted transition-colors hover:text-red-600"
                  >
                    Delete
                  </button>
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
        <button
          type="button"
          aria-label="Send comment"
          disabled={!onSubmit || submitting || !draft.trim()}
          onClick={() => {
            void handleSubmit();
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendOutlined />
        </button>
      </div>
    </article>
  );
}

export default React.memo(ProjectDiscussionCard);
