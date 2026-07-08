import { Button, Dropdown, Select, Table } from "antd";
import { DeleteOutlined, EllipsisOutlined, MailOutlined } from "@ant-design/icons";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { OrganizationMember } from "../../../types/organization.types";
import type { OrganizationMembersSummary } from "../../../types/organization.types";
import { getInitial } from "../../../lib/helper";
import { canActorChangeMemberEmail } from "../../../lib/email-access";
import { getWorkspaceRoleLabel } from "../../../lib/workspace-routing";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import {
  useOrganizationMembers,
  useRemoveOrganizationMember,
  useUpdateOrganizationMemberEmail,
  useUpdateOrganizationMemberRole,
} from "../../../hooks/use-workspace-organization";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import QueryErrorState from "../../common/query-error-state";
import SettingsSection from "../../admin/settings/settings-section";
import { ConfirmModal } from "../../ui/modal";
import type { RegisterAs } from "../../../types/auth.types";
import { useAppContext } from "../../../context/app-context";
import MemberEmailChangeModal from "./member-email-change-modal";
import TransferOwnershipModal from "./transfer-ownership-modal";
import { Paragraph, Text } from "../../ui/typography";

type WorkspaceMembersSectionProps = {
  expanded?: boolean;
};

const ROLE_OPTIONS: { value: Extract<RegisterAs, "admin" | "manager" | "member">; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
];

function getAssignableMemberRole(
  role: RegisterAs,
): Extract<RegisterAs, "admin" | "manager" | "member"> | undefined {
  if (role === "admin" || role === "manager" || role === "member") {
    return role;
  }

  return undefined;
}

function MemberRoleSelect({ member }: { member: OrganizationMember }) {
  const { can } = useWorkspacePermissions();
  const { mutateAsync: updateRole, isPending } = useUpdateOrganizationMemberRole();
  const canChangeRole = can("team.change_role") && member.role !== "owner";

  if (!canChangeRole) {
    return <Text as="span" size="sm" weight="medium">{getWorkspaceRoleLabel(member.role)}</Text>;
  }

  return (
    <Select
      size="small"
      value={getAssignableMemberRole(member.role)}
      loading={isPending}
      disabled={member.role === "owner"}
      options={ROLE_OPTIONS}
      className="min-w-[120px]"
      onChange={async (role: Extract<RegisterAs, "admin" | "manager" | "member">) => {
        try {
          await updateRole({ memberId: member.id, data: { role } });
          showApiSuccessToast("Member role updated.");
        } catch (error) {
          showApiErrorToast(error);
        }
      }}
    />
  );
}

function WorkspaceMembersSection({ expanded = false }: WorkspaceMembersSectionProps) {
  const app = useAppContext();
  const actorRole = app?.user?.role ?? "member";
  const { can } = useWorkspacePermissions();
  const membersQuery = useOrganizationMembers(true);
  const { data } = membersQuery;
  const { mutateAsync: removeMember, isPending: removingMember } = useRemoveOrganizationMember();
  const { mutateAsync: updateMemberEmail, isPending: updatingMemberEmail } = useUpdateOrganizationMemberEmail();
  const canManageMembers = can("team.change_role");
  const [pendingRemoveMember, setPendingRemoveMember] = useState<OrganizationMember | null>(null);
  const [pendingEmailMember, setPendingEmailMember] = useState<OrganizationMember | null>(null);
  const [transferOwnershipOpen, setTransferOwnershipOpen] = useState(false);

  const summary: OrganizationMembersSummary | undefined = data;
  const previewMembers = summary?.data.slice(0, 3) ?? [];

  const columns = useMemo(
    () => [
      {
        title: "Member",
        key: "member",
        render: (_: unknown, record: OrganizationMember) => (
          <div>
            <Text as="p" weight="semibold">{record.fullName}</Text>
            <Paragraph size="sm">{record.email}</Paragraph>
          </div>
        ),
      },
      {
        title: "Role",
        key: "role",
        render: (_: unknown, record: OrganizationMember) => <MemberRoleSelect member={record} />,
      },
      {
        title: "Status",
        dataIndex: "accountStatus",
        key: "status",
        render: (status: OrganizationMember["accountStatus"]) => (
          <Text as="span" size="sm" color="muted" className="capitalize">
            {status}
          </Text>
        ),
      },
      ...(canManageMembers
        ? [
            {
              title: "Actions",
              key: "actions",
              width: 64,
              align: "center" as const,
              render: (_: unknown, record: OrganizationMember) =>
                record.role === "owner" ? null : (
                  <Dropdown
                    menu={{
                      items: [
                        ...(canActorChangeMemberEmail(actorRole, record.role)
                          ? [
                              {
                                key: "change-email",
                                label: "Change email",
                                icon: <MailOutlined />,
                              },
                            ]
                          : []),
                        {
                          key: "deactivate",
                          label: "Deactivate member",
                          icon: <DeleteOutlined />,
                          danger: true,
                        },
                      ],
                      onClick: ({ key }) => {
                        if (key === "change-email") setPendingEmailMember(record);
                        if (key === "deactivate") setPendingRemoveMember(record);
                      },
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      icon={<EllipsisOutlined />}
                      className="text-muted!"
                      aria-label="Member actions"
                    />
                  </Dropdown>
                ),
            },
          ]
        : []),
    ],
    [actorRole, canManageMembers],
  );

  return (
    <SettingsSection
      id="workspace-members"
      title="Team Members"
      description="Manage seat allocation and workspace access for your organization."
      action={
        <div className="flex flex-wrap gap-2">
          {can("settings.transfer_ownership") ? (
            <Button
              type="default"
              className="font-semibold!"
              onClick={() => setTransferOwnershipOpen(true)}
            >
              Transfer ownership
            </Button>
          ) : null}
          {can("team.view") ? (
            <Link to={WORKSPACE_ROUTES.TEAMS}>
              <Button type="default" className="font-semibold!">
                Manage Members
              </Button>
            </Link>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="p" weight="bold" className="text-2xl tracking-tight">
            {summary?.occupiedSeats ?? 0}{" "}
            <Text as="span" size="base" weight="medium" color="muted">
              seats occupied out of {summary?.totalSeats ?? 0}
            </Text>
          </Text>
          <Paragraph size="sm" className="mt-1">
            {(summary?.totalSeats ?? 0) - (summary?.occupiedSeats ?? 0)} seats available for new members.
          </Paragraph>
        </div>

        <div className="flex items-center">
          {previewMembers.map((member, index) => (
            <div
              key={member.id}
              title={member.fullName}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-feature-sync text-sm font-bold text-primary",
                index > 0 && "-ml-2",
              )}
            >
              {getInitial(member.fullName)}
            </div>
          ))}
          {(summary?.occupiedSeats ?? 0) > previewMembers.length ? (
            <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-muted-surface text-xs font-semibold text-muted">
              +{(summary?.occupiedSeats ?? 0) - previewMembers.length}
            </div>
          ) : null}
        </div>
      </div>

      {expanded && membersQuery.isError ? (
        <div className="mt-6">
          <QueryErrorState
            error={membersQuery.error}
            title="Unable to load members"
            onRetry={() => {
              void membersQuery.refetch();
            }}
            isRetrying={membersQuery.isFetching}
          />
        </div>
      ) : null}

      {expanded && !membersQuery.isError ? (
        <div className="mt-6">
          <Table
            rowKey="id"
            loading={membersQuery.isPending}
            columns={columns}
            dataSource={summary?.data ?? []}
            pagination={false}
            scroll={{ x: 720 }}
          />
        </div>
      ) : null}

      <ConfirmModal
        open={pendingRemoveMember !== null}
        onClose={() => setPendingRemoveMember(null)}
        onConfirm={async () => {
          if (!pendingRemoveMember) return;

          try {
            const result = await removeMember(pendingRemoveMember.id);
            showApiSuccessToast(result.message);
            setPendingRemoveMember(null);
          } catch (error) {
            showApiErrorToast(error);
          }
        }}
        title="Deactivate member"
        description={
          pendingRemoveMember ? (
            <>
              Deactivate <Text as="span" weight="semibold">{pendingRemoveMember.fullName}</Text>? They
              will lose workspace access until reactivated.
            </>
          ) : null
        }
        confirmText="Deactivate"
        confirmDanger
        confirmLoading={removingMember}
        icon={<DeleteOutlined />}
      />

      <MemberEmailChangeModal
        open={pendingEmailMember !== null}
        member={pendingEmailMember}
        loading={updatingMemberEmail}
        onClose={() => setPendingEmailMember(null)}
        onSubmit={async (memberId, email) => {
          try {
            await updateMemberEmail({ memberId, data: { email } });
            showApiSuccessToast("Member email updated.");
            setPendingEmailMember(null);
            return true;
          } catch (error) {
            showApiErrorToast(error);
            return false;
          }
        }}
      />

      <TransferOwnershipModal
        open={transferOwnershipOpen}
        onClose={() => setTransferOwnershipOpen(false)}
        members={summary?.data ?? []}
      />
    </SettingsSection>
  );
}

export default React.memo(WorkspaceMembersSection);
