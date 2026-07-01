import { Avatar } from "antd";
import React from "react";
import type { TeamMember } from "../../../data/workspace-teams";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { Text } from "../../ui/typography";
import { useOrgPresence } from "../workspace-realtime-provider";
import OnlineStatusDot from "../common/online-status-dot";

type TeamMemberCellProps = {
  member: Pick<TeamMember, "id" | "name" | "email" | "avatarColor">;
};

function TeamMemberCell({ member }: TeamMemberCellProps) {
  const { isOnline } = useOrgPresence();

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <Avatar
          size={40}
          className={cn("font-semibold!", member.avatarColor ?? "bg-primary/10! text-primary!")}
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`}
        >
          {getInitial(member.name)}
        </Avatar>
        <OnlineStatusDot
          online={isOnline(member.id)}
          className="absolute -right-0.5 -bottom-0.5"
        />
      </div>
      <div className="min-w-0">
        <Text as="p" weight="semibold" className="truncate">
          {member.name}
        </Text>
        <Text as="p" size="sm" color="muted" className="truncate">
          {member.email}
        </Text>
      </div>
    </div>
  );
}

export default React.memo(TeamMemberCell);
