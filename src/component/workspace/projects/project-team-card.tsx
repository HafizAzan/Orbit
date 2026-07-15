import React from "react";
import type { ProjectDetailMember } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import EmptyStatePanel from "../../ui/empty-state-panel";
import { Paragraph, Text, Title } from "../../ui/typography";
import OnlineStatusDot from "../common/online-status-dot";
import { useOrgPresence } from "../workspace-realtime-provider";

type ProjectTeamCardProps = {
  members: ProjectDetailMember[];
};

function ProjectTeamCard({ members }: ProjectTeamCardProps) {
  const { isOnline } = useOrgPresence();

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default" className="mb-5">
        Team
      </Title>

      {members.length === 0 ? (
        <EmptyStatePanel
          compact
          description="No members on this project yet. Add a delivery lead and squad when editing the project."
        />
      ) : (
        <ul className="space-y-4">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                    member.avatarColor,
                  )}
                >
                  {getInitial(member.name)}
                </div>
                <OnlineStatusDot
                  online={isOnline(member.id)}
                  className="absolute -right-0.5 -bottom-0.5"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Text as="p" weight="semibold" className="truncate">
                    {member.name}
                  </Text>
                  <Text as="span" size="xs" color="muted">
                    {isOnline(member.id) ? "Online" : "Offline"}
                  </Text>
                </div>
                <Paragraph size="sm" className="truncate">
                  {member.role}
                </Paragraph>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default React.memo(ProjectTeamCard);
