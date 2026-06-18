import { SendOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";
import type { ProjectDiscussionMessage } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";

type ProjectDiscussionCardProps = {
  messages: ProjectDiscussionMessage[];
};

function ProjectDiscussionCard({ messages }: ProjectDiscussionCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <h3 className="text-lg font-semibold text-foreground">Discussion</h3>

      {messages.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No project comments yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
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
            </div>
          </li>
        ))}
        </ul>
      )}

      <div className="mt-5 flex items-center gap-2">
        <Input placeholder="Add a comment..." size="large" className="rounded-xl!" disabled />
        <button
          type="button"
          aria-label="Send comment"
          disabled
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-white"
        >
          <SendOutlined />
        </button>
      </div>
    </article>
  );
}

export default React.memo(ProjectDiscussionCard);
