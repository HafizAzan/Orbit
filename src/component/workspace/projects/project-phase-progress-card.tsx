import React from "react";
import type { WorkspaceProjectDetail } from "../../../data/workspace-project-detail";
import { cn } from "../../../lib/utils";

type ProjectPhaseProgressCardProps = {
  project: WorkspaceProjectDetail;
};

function ProjectPhaseProgressCard({ project }: ProjectPhaseProgressCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{project.phaseLabel}</h3>
        <span className="text-2xl font-bold text-primary">{project.progress}%</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Tasks Completed</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {project.tasksCompleted}/{project.tasksTotal}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Time Spent</p>
          <p className="mt-1 text-lg font-bold text-foreground">{project.timeSpent}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Remaining Days</p>
          <p className={cn("mt-1 text-lg font-bold", project.remainingDays <= 7 ? "text-red-600" : "text-foreground")}>
            {project.remainingDays}
          </p>
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProjectPhaseProgressCard);
