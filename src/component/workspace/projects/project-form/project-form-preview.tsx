import { BulbOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React, { useMemo } from "react";
import {
  PROJECT_PRIORITY_OPTIONS,
  type ProjectFormValues,
} from "../../../../data/workspace-project-form";
import { useAssignableProjectMembers } from "../../../../hooks/use-workspace-projects";
import { formatDate } from "../../../../lib/helper";
import ProjectTeamAvatars from "../project-team-avatars";
import { Paragraph, Text, Title } from "../../../ui/typography";

type ProjectFormPreviewProps = {
  values: ProjectFormValues;
  leadName: string;
};

function ProjectFormPreview({ values, leadName }: ProjectFormPreviewProps) {
  const { data: assignableMembers = [] } = useAssignableProjectMembers();
  const selectedMembers = useMemo(
    () =>
      assignableMembers.filter(
        (member) => values.memberIds.includes(member.id) && member.id !== values.leadUserId,
      ),
    [assignableMembers, values.leadUserId, values.memberIds],
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

  const squadCount = selectedMembers.length + (values.leadUserId ? 1 : 0);
  const leadInitial = leadName.trim().charAt(0).toUpperCase() || "?";

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Text as="p" size="xs" weight="bold" color="muted" className="tracking-wide uppercase">
          Project Preview
        </Text>

        <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
          <span className="inline-flex rounded-full border border-primary/20 bg-feature-sync px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
            {priorityLabel} Priority
          </span>

          <Title level={5} color="default" className="mt-3">
            {values.name.trim() || "Untitled Project"}
          </Title>
          <Paragraph size="sm" className="mt-2 leading-6">
            {values.description.trim() || "Your project description will appear here as you type."}
          </Paragraph>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Status</dt>
              <dd className="font-medium text-foreground">Initiation</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Lead</dt>
              <dd className="flex items-center gap-2 font-medium text-foreground">
                <Avatar size={24} className="bg-primary/10! text-[11px]! text-primary! font-semibold!">
                  {leadInitial}
                </Avatar>
                {leadName}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Team</dt>
              <dd className="flex items-center gap-2">
                {previewMembers.length > 0 ? <ProjectTeamAvatars members={previewMembers} maxVisible={3} /> : null}
                <Text as="span" size="sm" weight="medium">
                  {squadCount} {squadCount === 1 ? "Member" : "Members"}
                </Text>
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <Text as="span" size="xs" weight="medium" color="muted">
                {values.startDate ? formatDate(values.startDate) : "Start date"}
              </Text>
              <Text as="span" size="xs" weight="medium" color="muted">
                {values.dueDate ? formatDate(values.dueDate) : "Due date"}
              </Text>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-progress-track">
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
            <Text as="p" size="sm" weight="semibold">
              Pro Tip
            </Text>
            <Paragraph size="sm" className="mt-1 leading-6">
              Owners assign a delivery lead and execution squad. Managers run day-to-day tasks after the project is
              created.
            </Paragraph>
          </div>
        </div>
      </article>
    </aside>
  );
}

export default React.memo(ProjectFormPreview);
