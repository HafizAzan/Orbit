import { BulbOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React, { useMemo } from "react";
import {
  ASSIGNABLE_PROJECT_MEMBERS,
  PROJECT_PRIORITY_OPTIONS,
  type ProjectFormValues,
} from "../../../../data/workspace-project-form";
import { formatDate } from "../../../../lib/helper";
import ProjectTeamAvatars from "../project-team-avatars";

type ProjectFormPreviewProps = {
  values: ProjectFormValues;
  leadName: string;
};

function ProjectFormPreview({ values, leadName }: ProjectFormPreviewProps) {
  const selectedMembers = useMemo(
    () => ASSIGNABLE_PROJECT_MEMBERS.filter((member) => values.memberIds.includes(member.id)),
    [values.memberIds],
  );

  const priorityLabel = PROJECT_PRIORITY_OPTIONS.find((option) => option.value === values.priority)?.label ?? "Medium";

  const timelineProgress = useMemo(() => {
    if (!values.startDate || !values.dueDate) return 0;

    const start = new Date(`${values.startDate}T00:00:00`).getTime();
    const end = new Date(`${values.dueDate}T00:00:00`).getTime();
    const today = Date.now();

    if (end <= start) return 0;
    if (today <= start) return 0;
    if (today >= end) return 100;

    return Math.round(((today - start) / (end - start)) * 100);
  }, [values.dueDate, values.startDate]);

  const previewMembers = selectedMembers.map((member) => ({
    id: member.id,
    name: member.name,
    avatarColor: member.avatarColor,
  }));

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Project Preview</p>

        <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
          <span className="inline-flex rounded-full border border-primary/20 bg-feature-sync px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
            {priorityLabel} Priority
          </span>

          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {values.name.trim() || "Untitled Project"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            {values.description.trim() || "Your project description will appear here as you type."}
          </p>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Status</dt>
              <dd className="font-medium text-foreground">Initiation</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Lead</dt>
              <dd className="flex items-center gap-2 font-medium text-foreground">
                <Avatar size={24} className="bg-primary/10! text-[11px]! text-primary! font-semibold!">
                  {leadName.charAt(0)}
                </Avatar>
                {leadName}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Team</dt>
              <dd className="flex items-center gap-2">
                {previewMembers.length > 0 ? <ProjectTeamAvatars members={previewMembers} maxVisible={3} /> : null}
                <span className="text-sm font-medium text-foreground">
                  {selectedMembers.length} {selectedMembers.length === 1 ? "Member" : "Members"}
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
              <span>{values.startDate ? formatDate(values.startDate) : "Start date"}</span>
              <span>{values.dueDate ? formatDate(values.dueDate) : "Due date"}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${timelineProgress}%` }} />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-primary/15 bg-feature-sync/70 p-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <BulbOutlined />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Pro Tip</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Press <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-xs font-semibold">Cmd</kbd>{" "}
              + <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-xs font-semibold">Enter</kbd> to
              save your project quickly.
            </p>
          </div>
        </div>
      </article>
    </aside>
  );
}

export default React.memo(ProjectFormPreview);
