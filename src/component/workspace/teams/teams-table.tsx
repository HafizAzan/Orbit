import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createWorkspaceTeamTableColumns from "../../../columns/workspace-team-table-columns";
import ChangeMemberRoleModal from "./change-member-role-modal";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import {
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
};

function TeamsTable({ data = [], emptyAction }: TeamsTableProps) {
  const { can } = useWorkspacePermissions();
  const { mutateAsync: updateStatus } = useUpdateTeamMemberStatus();
  const { mutateAsync: resendInvite } = useResendTeamInvite();
  const canChangeRole = can("team.change_role");
  const canManageInvites = can("team.invite");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TeamTableFilters>(DEFAULT_TEAM_TABLE_FILTERS);
  const [page, setPage] = useState(1);
  const [roleChangeMember, setRoleChangeMember] = useState<TeamMember | null>(null);

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

  const paginatedData = useMemo(
    () => paginateItems(filteredData, page, TEAM_MEMBERS_PAGE_SIZE),
    [filteredData, page],
  );

  const handleFilterChange = (key: keyof TeamTableFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleEditRole = useCallback((record: TeamMember) => {
    setRoleChangeMember(record);
  }, []);

  const handleResendInvite = useCallback(
    async (record: TeamMember) => {
      try {
        const result = await resendInvite(record.id);
        showApiSuccessToast(result.message);
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [resendInvite],
  );

  const handleDeactivate = useCallback(
    async (record: TeamMember) => {
      const nextStatus = record.status === "deactivated" ? "active" : "deactivated";

      try {
        await updateStatus({ memberId: record.id, data: { status: nextStatus } });
        showApiSuccessToast(
          `${record.name} ${nextStatus === "active" ? "reactivated" : "deactivated"} successfully.`,
        );
      } catch (error) {
        showApiErrorToast(error);
      }
    },
    [updateStatus],
  );

  const columns = useMemo(
    () =>
      createWorkspaceTeamTableColumns({
        onEditRole: handleEditRole,
        onResendInvite: handleResendInvite,
        onDeactivate: handleDeactivate,
        canChangeRole,
        canManageInvites,
      }),
    [canChangeRole, canManageInvites, handleDeactivate, handleEditRole, handleResendInvite],
  );

  const resultsSummary = (
    <span className="text-sm text-muted">
      Showing{" "}
      <span className="font-semibold text-foreground">
        {filteredData.length === 0 ? 0 : (page - 1) * TEAM_MEMBERS_PAGE_SIZE + 1}
      </span>
      {" to "}
      <span className="font-semibold text-foreground">
        {Math.min(page * TEAM_MEMBERS_PAGE_SIZE, filteredData.length)}
      </span>
      {" of "}
      <span className="font-semibold text-foreground">{filteredData.length}</span> members
    </span>
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

        {filteredData.length > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={TEAM_MEMBERS_PAGE_SIZE}
            total={filteredData.length}
            onChange={setPage}
          />
        ) : null}
      </div>

      <ChangeMemberRoleModal member={roleChangeMember} onClose={() => setRoleChangeMember(null)} />
    </>
  );
}

export default React.memo(TeamsTable);
