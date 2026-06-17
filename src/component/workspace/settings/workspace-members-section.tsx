import { Button, Select, Table } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { OrganizationMember } from "../../../types/organization.types";
import type { OrganizationMembersSummary } from "../../../types/organization.types";
import { getInitial } from "../../../lib/helper";
import { getWorkspaceRoleLabel } from "../../../lib/workspace-routing";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import {
  useOrganizationMembers,
  useRemoveOrganizationMember,
  useUpdateOrganizationMemberRole,
} from "../../../hooks/use-workspace-organization";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import SettingsSection from "../../admin/settings/settings-section";
import type { RegisterAs } from "../../../types/auth.types";

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
    return <span className="text-sm font-medium text-foreground">{getWorkspaceRoleLabel(member.role)}</span>;
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
  const { can } = useWorkspacePermissions();
  const { data, isLoading } = useOrganizationMembers();
  const { mutateAsync: removeMember, isPending: removingMember } = useRemoveOrganizationMember();
  const canManageMembers = can("team.change_role");

  const summary: OrganizationMembersSummary | undefined = data;
  const previewMembers = summary?.members.slice(0, 3) ?? [];

  const columns = useMemo(
    () => [
      {
        title: "Member",
        key: "member",
        render: (_: unknown, record: OrganizationMember) => (
          <div>
            <p className="font-semibold text-foreground">{record.fullName}</p>
            <p className="text-sm text-muted">{record.email}</p>
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
          <span className="text-sm capitalize text-muted">{status}</span>
        ),
      },
      ...(canManageMembers
        ? [
            {
              title: "Actions",
              key: "actions",
              render: (_: unknown, record: OrganizationMember) =>
                record.role === "owner" ? null : (
                  <Button
                    danger
                    size="small"
                    loading={removingMember}
                    className="font-medium!"
                    onClick={async () => {
                      try {
                        const result = await removeMember(record.id);
                        showApiSuccessToast(result.message);
                      } catch (error) {
                        showApiErrorToast(error);
                      }
                    }}
                  >
                    Deactivate
                  </Button>
                ),
            },
          ]
        : []),
    ],
    [canManageMembers, removeMember, removingMember],
  );

  return (
    <SettingsSection
      id="workspace-members"
      title="Team Members"
      description="Manage seat allocation and workspace access for your organization."
      action={
        can("team.view") ? (
          <Link to={WORKSPACE_ROUTES.TEAMS}>
            <Button type="default" className="font-semibold!">
              Manage Members
            </Button>
          </Link>
        ) : null
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {summary?.occupiedSeats ?? 0}{" "}
            <span className="text-base font-medium text-muted">
              seats occupied out of {summary?.totalSeats ?? 0}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {(summary?.totalSeats ?? 0) - (summary?.occupiedSeats ?? 0)} seats available for new members.
          </p>
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
            <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-slate-100 text-xs font-semibold text-muted">
              +{(summary?.occupiedSeats ?? 0) - previewMembers.length}
            </div>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div className="mt-6">
          <Table
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={summary?.members ?? []}
            pagination={false}
            scroll={{ x: 720 }}
          />
        </div>
      ) : null}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceMembersSection);
