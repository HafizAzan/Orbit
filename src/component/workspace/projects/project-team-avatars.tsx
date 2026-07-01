import React from "react";
import type { ProjectTeamMember } from "../../../data/workspace-projects";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";

type ProjectTeamAvatarsProps = {
  members: ProjectTeamMember[];
  maxVisible?: number;
  className?: string;
};

function ProjectTeamAvatars({ members, maxVisible = 3, className }: ProjectTeamAvatarsProps) {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <div className={cn("flex items-center", className)}>
      {visibleMembers.map((member, index) => (
        <div
          key={member.id}
          title={member.name}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-xs font-bold",
            member.avatarColor,
            index > 0 && "-ml-2",
          )}
        >
          {getInitial(member.name)}
        </div>
      ))}
      {remainingCount > 0 ? (
        <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted-surface text-xs font-semibold text-muted">
          +{remainingCount}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(ProjectTeamAvatars);
