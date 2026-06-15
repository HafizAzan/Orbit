import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import type { ProjectDetailMember } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";

type ProjectTeamCardProps = {
  members: ProjectDetailMember[];
};

function ProjectTeamCard({ members }: ProjectTeamCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Team</h3>
        <button
          type="button"
          aria-label="Add team member"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-background hover:text-primary"
        >
          <PlusOutlined />
        </button>
      </div>

      <ul className="space-y-4">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                member.avatarColor,
              )}
            >
              {getInitial(member.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{member.name}</p>
              <p className="truncate text-sm text-muted">{member.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(ProjectTeamCard);
