import React from "react";
import type { WorkspaceProjectDetail } from "../../../data/workspace-project-detail";
import { cn } from "../../../lib/utils";
import { Text, Title } from "../../ui/typography";

type ProjectPhaseProgressCardProps = {
  project: WorkspaceProjectDetail;
};

function ProjectPhaseProgressCard({ project }: ProjectPhaseProgressCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Title level={5} color="default">
          {project.phaseLabel}
        </Title>
        <Text as="span" weight="bold" color="primary" className="text-2xl">
          {project.progress}%
        </Text>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-progress-track">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
            Tasks Completed
          </Text>
          <Text as="p" size="lg" weight="bold" className="mt-1">
            {project.tasksCompleted}/{project.tasksTotal}
          </Text>
        </div>
        <div>
          <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
            Time Spent
          </Text>
          <Text as="p" size="lg" weight="bold" className="mt-1">
            {project.timeSpent}
          </Text>
        </div>
        <div>
          <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">
            Remaining Days
          </Text>
          <Text as="p" size="lg" weight="bold" className={cn("mt-1", project.remainingDays <= 7 ? "text-red-600" : undefined)}>
            {project.remainingDays}
          </Text>
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProjectPhaseProgressCard);
