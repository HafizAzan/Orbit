import { FilterOutlined, MailOutlined, SearchOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createWorkspaceTeamTableColumns from "../../../columns/workspace-team-table-columns";
import ChangeMemberRoleModal from "./change-member-role-modal";
import TeamMemberDetailModal from "./team-member-detail-modal";
import { ConfirmModal } from "../../ui/modal";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import {
  useDeleteTeamMember,
  useRemoveTeamMemberFromSquad,
  useResendTeamInvite,
  useUpdateTeamMemberStatus,
} from "../../../hooks/use-workspace-team";
import {
  DEFAULT_TEAM_TABLE_FILTERS,
  TEAM_MEMBERS_PAGE_SIZE,
  TEAM_ROLE_FILTER_OPTIONS,
  TEAM_STATUS_FILTER_OPTIONS,
  type TeamMember,
  type TeamTableFilters,
} from "../../../data/workspace-teams";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { matchesSearchQuery, paginateItems } from "../../../lib/helper";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";

function countActiveTeamFilters(filters: TeamTableFilters) {
  return Object.values(filters).filter((value) => value !== "all").length;
}

function matchesTeamFilters(member: TeamMember, filters: TeamTableFilters) {
  if (filters.role !== "all" && member.role !== filters.role) return false;
  if (filters.status !== "all" && member.status !== filters.status) return false;
  return true;
}

type TeamsTableProps = {
  data?: TeamMember[];
  emptyAction?: React.ReactNode;
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
};

function TeamsTable({ data = [], emptyAction, serverPagination }: TeamsTableProps) {
  const { can } = useWorkspacePermissions();
  const { mutateAsync: updateStatus } = useUpdateTeamMemberStatus();
  const { mutateAsync: resendInvite } = useResendTeamInvite();
  const { mutateAsync: deleteMember } = useDeleteTeamMember();
  const { mutateAsync: removeFromSquad } = useRemoveTeamMemberFromSquad();
  const canChangeRole = can("team.change_role");
  const canManageInvites = can("team.invite");
  const canRemoveFromSquad = can("team.remove_squad_member");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TeamTableFilters>(DEFAULT_TEAM_TABLE_FILTERS);
  const [page, setPage] = useState(1);
  const [roleChangeMember, setRoleChangeMember] = useState<TeamMember | null>(null);
  const [detailMember, setDetailMember] = useState<TeamMember | null>(null);
  const [statusChangeMember, setStatusChangeMember] = useState<TeamMember | null>(null);
  const [resendInviteMember, setResendInviteMember] = useState<TeamMember | null>(null);
  const [deleteMemberRecord, setDeleteMemberRecord] = useState<TeamMember | null>(null);
  const [removeSquadMember, setRemoveSquadMember] = useState<TeamMember | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const [resendInviteLoading, setResendInviteLoading] = useState(false);
  const [deleteMemberLoading, setDeleteMemberLoading] = useState(false);
  const [removeSquadLoading, setRemoveSquadLoading] = useState(false);

  const activeFilterCount = countActiveTeamFilters(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((member) => {
      if (!matchesTeamFilters(member, filters)) return false;
      if (!query) return true;

      return matchesSearchQuery(member.name, query) || matchesSearchQuery(member.email, query);
    });
  }, [data, filters, search]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, data]);

  const paginatedData = useMemo(() => {
    if (serverPagination) {
      return filteredData;
    }

    return paginateItems(filteredData, page, TEAM_MEMBERS_PAGE_SIZE);
  }, [filteredData, page, serverPagination]);

  const paginationPage = serverPagination?.page ?? page;
  const paginationPageSize = serverPagination?.pageSize ?? TEAM_MEMBERS_PAGE_SIZE;
  const paginationTotal = serverPagination?.total ?? filteredData.length;
  const handlePageChange = serverPagination?.onChange ?? setPage;

  const handleFilterChange = (key: keyof TeamTableFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleViewDetail = useCallback((record: TeamMember) => {
    setDetailMember(record);
  }, []);

  const handleEditRole = useCallback((record: TeamMember) => {
    setRoleChangeMember(record);
  }, []);

  const handleResendInvite = useCallback((record: TeamMember) => {
    setResendInviteMember(record);
  }, []);

  const handleConfirmResendInvite = useCallback(async () => {
    if (!resendInviteMember) return;

    setResendInviteLoading(true);

    try {
      const result = await resendInvite(resendInviteMember.id);
      showApiSuccessToast(result.message);
      setResendInviteMember(null);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setResendInviteLoading(false);
    }
  }, [resendInvite, resendInviteMember]);

  const handleDeactivate = useCallback((record: TeamMember) => {
    setStatusChangeMember(record);
  }, []);

  const handleDeleteMember = useCallback((record: TeamMember) => {
    setDeleteMemberRecord(record);
  }, []);

  const handleRemoveFromSquad = useCallback((record: TeamMember) => {
    setRemoveSquadMember(record);
  }, []);

  const handleConfirmRemoveFromSquad = useCallback(async () => {
    if (!removeSquadMember) return;

    setRemoveSquadLoading(true);

    try {
      const result = await removeFromSquad(removeSquadMember.id);
      showApiSuccessToast(result.message);
      setRemoveSquadMember(null);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setRemoveSquadLoading(false);
    }
  }, [removeFromSquad, removeSquadMember]);

  const handleConfirmDeleteMember = useCallback(async () => {
    if (!deleteMemberRecord) return;

    setDeleteMemberLoading(true);

    try {
      const result = await deleteMember(deleteMemberRecord.id);
      showApiSuccessToast(result.message);
      setDeleteMemberRecord(null);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setDeleteMemberLoading(false);
    }
  }, [deleteMember, deleteMemberRecord]);

  const handleConfirmStatusChange = useCallback(async () => {
    if (!statusChangeMember) return;

    const nextStatus = statusChangeMember.status === "deactivated" ? "active" : "deactivated";
    setStatusChangeLoading(true);

    try {
      await updateStatus({ memberId: statusChangeMember.id, data: { status: nextStatus } });
      showApiSuccessToast(
        `${statusChangeMember.name} ${nextStatus === "active" ? "reactivated" : "deactivated"} successfully.`,
      );
      setStatusChangeMember(null);
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setStatusChangeLoading(false);
    }
  }, [statusChangeMember, updateStatus]);

  const columns = useMemo(
    () =>
      createWorkspaceTeamTableColumns({
        onViewDetail: handleViewDetail,
        onEditRole: handleEditRole,
        onResendInvite: handleResendInvite,
        onDeactivate: handleDeactivate,
        onDeleteMember: handleDeleteMember,
        onRemoveFromSquad: handleRemoveFromSquad,
        canViewDetail: true,
        canChangeRole,
        canManageInvites,
        canRemoveFromSquad,
      }),
    [
      canChangeRole,
      canManageInvites,
      canRemoveFromSquad,
      handleDeactivate,
      handleDeleteMember,
      handleEditRole,
      handleRemoveFromSquad,
      handleResendInvite,
      handleViewDetail,
    ],
  );

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {paginationTotal === 0 ? 0 : (paginationPage - 1) * paginationPageSize + 1}
      </Text>
      {" to "}
      <Text as="span" weight="semibold">
        {Math.min(paginationPage * paginationPageSize, paginationTotal)}
      </Text>
      {" of "}
      <Text as="span" weight="semibold">{paginationTotal}</Text> members
    </Text>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-muted" />}
            placeholder="Search members by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl! bg-background! sm:max-w-md"
          />

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Select
              value={filters.role}
              onChange={(value) => handleFilterChange("role", value)}
              options={TEAM_ROLE_FILTER_OPTIONS}
              className="w-full sm:min-w-[140px]"
            />
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              options={TEAM_STATUS_FILTER_OPTIONS}
              suffixIcon={<FilterOutlined className="text-muted" />}
              className="w-full sm:min-w-[140px]"
            />
          </div>
        </div>

        <Table<TeamMember>
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
          tableLayout="fixed"
          scroll={{ x: 1200 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="No members found"
          emptyDescription={
            hasQuery
              ? "Try adjusting your search or filters to find the member you are looking for."
              : "Invite your first team member to start collaborating."
          }
          emptyAction={emptyAction}
        />

        {paginationTotal > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={paginationPage}
            pageSize={paginationPageSize}
            total={paginationTotal}
            onChange={handlePageChange}
          />
        ) : null}
      </div>

      <ChangeMemberRoleModal member={roleChangeMember} onClose={() => setRoleChangeMember(null)} />

      <TeamMemberDetailModal member={detailMember} onClose={() => setDetailMember(null)} />

      <ConfirmModal
        open={statusChangeMember !== null}
        onClose={() => setStatusChangeMember(null)}
        onConfirm={handleConfirmStatusChange}
        title={statusChangeMember?.status === "deactivated" ? "Reactivate member" : "Deactivate member"}
        description={
          statusChangeMember ? (
            <>
              {statusChangeMember.status === "deactivated" ? (
                <>
                  Reactivate <Text as="span" weight="semibold">{statusChangeMember.name}</Text>? They will
                  regain access to the workspace.
                </>
              ) : (
                <>
                  Deactivate <Text as="span" weight="semibold">{statusChangeMember.name}</Text>? They will
                  lose workspace access until reactivated.
                </>
              )}
            </>
          ) : null
        }
        confirmText={statusChangeMember?.status === "deactivated" ? "Reactivate" : "Deactivate"}
        confirmDanger={statusChangeMember?.status !== "deactivated"}
        confirmLoading={statusChangeLoading}
        icon={<UserSwitchOutlined />}
      />

      <ConfirmModal
        open={resendInviteMember !== null}
        onClose={() => setResendInviteMember(null)}
        onConfirm={handleConfirmResendInvite}
        title="Resend invite"
        description={
          resendInviteMember ? (
            <>
              Send a new invite email to{" "}
              <Text as="span" weight="semibold">{resendInviteMember.email}</Text>?
            </>
          ) : null
        }
        confirmText="Resend invite"
        confirmLoading={resendInviteLoading}
        icon={<MailOutlined />}
      />

      <ConfirmModal
        open={removeSquadMember !== null}
        onClose={() => setRemoveSquadMember(null)}
        onConfirm={handleConfirmRemoveFromSquad}
        title="Remove from team"
        description={
          removeSquadMember ? (
            <>
              Remove <Text as="span" weight="semibold">{removeSquadMember.name}</Text> from your project
              team? They will stay in the workspace but lose access to projects you manage.
            </>
          ) : null
        }
        confirmText="Remove from team"
        confirmDanger
        confirmLoading={removeSquadLoading}
        icon={<UserSwitchOutlined />}
      />

      <ConfirmModal
        open={deleteMemberRecord !== null}
        onClose={() => setDeleteMemberRecord(null)}
        onConfirm={handleConfirmDeleteMember}
        title="Delete user"
        description={
          deleteMemberRecord ? (
            <>
              Permanently delete <Text as="span" weight="semibold">{deleteMemberRecord.name}</Text>? This
              removes their workspace account and frees their seat. This action cannot be undone.
            </>
          ) : null
        }
        confirmText="Delete user"
        confirmDanger
        confirmLoading={deleteMemberLoading}
        icon={<UserSwitchOutlined />}
      />
    </>
  );
}

export default React.memo(TeamsTable);
