import { ProjectOutlined } from "@ant-design/icons";
import { Avatar, Button, Table } from "antd";
import React, { useMemo } from "react";
import { TEAM_DEPARTMENT_LABELS, TEAM_ROLE_LABELS, TEAM_STATUS_STYLES, type TeamMember } from "../../../data/workspace-teams";
import { getProjectDetailPath } from "../../../data/workspace-project-detail";
import { useTeamMemberDetail } from "../../../hooks/use-workspace-team";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import WorkspaceNavLink from "../common/workspace-nav-link";
import OnlineStatusDot from "../common/online-status-dot";
import { useOrgPresence } from "../workspace-realtime-provider";
import Modal from "../../ui/modal";
import { Paragraph, Text, Title } from "../../ui/typography";

const PROJECT_ROLE_LABELS: Record<string, string> = {
  admin: "Project Admin",
  member: "Member",
  viewer: "Viewer",
};

type TeamMemberDetailModalProps = {
  member: TeamMember | null;
  onClose: () => void;
};

function TeamMemberDetailModal({ member, onClose }: TeamMemberDetailModalProps) {
  const memberId = member?.id ?? null;
  const { isOnline } = useOrgPresence();
  const detailQuery = useTeamMemberDetail(memberId, memberId !== null);
  const detail = detailQuery.data;

  const projectColumns = useMemo(
    () => [
      {
        title: "Project",
        key: "project",
        render: (_: unknown, record: NonNullable<typeof detail>["projectsDetail"][number]) => (
          <div className="min-w-0">
            <Text as="p" weight="semibold" className="truncate">
              {record.projectName}
            </Text>
            <Text as="p" size="xs" color="muted">
              {record.projectKey}
            </Text>
          </div>
        ),
      },
      {
        title: "Role",
        dataIndex: "projectRole",
        key: "projectRole",
        width: 120,
        render: (projectRole: string) => (
          <Text as="span" size="sm" color="muted">
            {PROJECT_ROLE_LABELS[projectRole] ?? projectRole}
          </Text>
        ),
      },
      {
        title: "Assigned Tasks",
        dataIndex: "assignedTasks",
        key: "assignedTasks",
        width: 130,
        render: (assignedTasks: number, record: NonNullable<typeof detail>["projectsDetail"][number]) => (
          <Text as="span" size="sm" weight="medium">
            {assignedTasks}
            {assignedTasks > 0 ? (
              <Text as="span" color="muted">
                {" "}
                ({record.completedTasks} done)
              </Text>
            ) : null}
          </Text>
        ),
      },
      {
        title: "",
        key: "action",
        width: 90,
        render: (_: unknown, record: NonNullable<typeof detail>["projectsDetail"][number]) => (
          <WorkspaceNavLink to={getProjectDetailPath(record.projectId)} preserveReturn onClick={onClose}>
            <Button type="link" className="h-auto px-0 font-semibold!">
              Open
            </Button>
          </WorkspaceNavLink>
        ),
      },
    ],
    [detail, onClose],
  );

  const statusConfig = member ? TEAM_STATUS_STYLES[member.status] : null;

  return (
    <Modal open={member !== null} onCancel={onClose} footer={null} width={720} title={null} destroyOnHidden>
      {member ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <Avatar
                size={64}
                className={cn("font-semibold!", member.avatarColor ?? "bg-primary/10! text-primary!")}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`}
              >
                {getInitial(member.name)}
              </Avatar>
              <OnlineStatusDot
                online={isOnline(member.id)}
                className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 border-card"
              />
            </div>

            <div className="min-w-0 flex-1">
              <Title level={4} className="text-xl text-foreground">
                {member.name}
              </Title>
              <Paragraph size="sm" className="mt-1 text-muted">
                {member.email}
              </Paragraph>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    isOnline(member.id)
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-border bg-background text-muted",
                  )}
                >
                  <OnlineStatusDot online={isOnline(member.id)} className="h-2 w-2 border-transparent" />
                  {isOnline(member.id) ? "Online now" : "Offline"}
                </span>
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  {TEAM_ROLE_LABELS[member.role]}
                </span>
                {statusConfig ? (
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusConfig.pill)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dot)} />
                    {statusConfig.label}
                  </span>
                ) : null}
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  {TEAM_DEPARTMENT_LABELS[member.department]}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-background/60 px-3 py-3 text-center">
              <Text as="p" size="lg" weight="bold" className="tabular-nums">
                {detail?.projects ?? member.projects}
              </Text>
              <Text as="p" size="xs" weight="semibold" color="muted" className="mt-0.5 text-[11px]! tracking-wide uppercase">
                Projects
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-background/60 px-3 py-3 text-center">
              <Text as="p" size="lg" weight="bold" className="tabular-nums">
                {detail?.totalAssignedTasks ?? 0}
              </Text>
              <Text as="p" size="xs" weight="semibold" color="muted" className="mt-0.5 text-[11px]! tracking-wide uppercase">
                Assigned Tasks
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-background/60 px-3 py-3 text-center">
              <Text as="p" size="lg" weight="bold" className="tabular-nums">
                {detail?.completedAssignedTasks ?? 0}
              </Text>
              <Text as="p" size="xs" weight="semibold" color="muted" className="mt-0.5 text-[11px]! tracking-wide uppercase">
                Completed
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-background/60 px-3 py-3 text-center">
              <Text as="p" size="sm" weight="bold">
                {member.joinedDate}
              </Text>
              <Text as="p" size="xs" weight="semibold" color="muted" className="mt-0.5 text-[11px]! tracking-wide uppercase">
                Joined
              </Text>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <ProjectOutlined className="text-primary" />
              <Text as="p" size="sm" weight="semibold">
                Project Assignments
              </Text>
            </div>

            {detailQuery.isLoading ? (
              <Paragraph size="sm">Loading member details...</Paragraph>
            ) : detailQuery.isError ? (
              <Text as="p" size="sm" className="text-red-600">
                Unable to load project assignments for this member.
              </Text>
            ) : (detail?.projectsDetail.length ?? 0) === 0 ? (
              <Paragraph size="sm" className="rounded-xl border border-dashed border-border bg-background/50 px-4 py-6 text-center">
                This member is not assigned to any projects in your scope yet.
              </Paragraph>
            ) : (
              <Table
                rowKey="projectId"
                columns={projectColumns}
                dataSource={detail?.projectsDetail ?? []}
                pagination={false}
                size="small"
                scroll={{ x: 520 }}
              />
            )}
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button size="large" onClick={onClose} className="font-semibold!">
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

export default React.memo(TeamMemberDetailModal);
