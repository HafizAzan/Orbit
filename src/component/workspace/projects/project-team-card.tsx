import React from "react";
import type { ProjectDetailMember } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProjectTeamCardProps = {
  members: ProjectDetailMember[];
};

function ProjectTeamCard({ members }: ProjectTeamCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default" className="mb-5">Team</Title>

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
              <Text as="p" weight="semibold" className="truncate">{member.name}</Text>
              <Paragraph size="sm" className="truncate">{member.role}</Paragraph>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(ProjectTeamCard);
