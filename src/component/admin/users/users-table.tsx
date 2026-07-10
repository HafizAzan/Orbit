import { CloseOutlined, DeleteOutlined, FilterOutlined, SearchOutlined, StopOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createUserTableColumns from "../../../columns/user-table-columns";
import { USERS_PAGE_SIZE, type UserRecord } from "../../../data/admin-users";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import { useDeleteAdminUser, useUpdateAdminUserStatus } from "../../../hooks/use-admin-users";
import useUserFilters from "../../../hooks/use-user-filters";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { matchesSearchQuery } from "../../../lib/helper";
import { countActiveUserFilters, getUserFilterChips, matchesUserFilters } from "../../../lib/user-filters";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import UserEditModal from "./user-edit-modal";
import UserFilterDrawer from "./user-filter-drawer";
import UserViewModal from "./user-view-modal";

type UsersTableProps = {
  data?: UserRecord[];
  total?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  serverPagination?: boolean;
};

function UsersTable({
  data = [],
  total = 0,
  page: controlledPage,
  onPageChange,
  serverPagination = false,
}: UsersTableProps) {
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useUserFilters();
  const [localPage, setLocalPage] = useState(1);
  const [pendingSuspend, setPendingSuspend] = useState<UserRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<UserRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<UserRecord | null>(null);
  const [editRecord, setEditRecord] = useState<UserRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { mutateAsync: updateStatus, isPending: suspendPending } = useUpdateAdminUserStatus();
  const { mutateAsync: deleteUser, isPending: deletePending } = useDeleteAdminUser();

  const page = controlledPage ?? localPage;
  const setPage = onPageChange ?? setLocalPage;

  const columns = useMemo(
    () =>
      createUserTableColumns({
        onView: setViewRecord,
        onEdit: setEditRecord,
        onSuspend: setPendingSuspend,
        onDelete: setPendingDelete,
      }),
    [],
  );

  const activeFilterCount = countActiveUserFilters(filters);
  const filterChips = getUserFilterChips(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const filteredData = useMemo(() => {
    if (serverPagination) return data;
    const query = search.trim().toLowerCase();
    return data.filter((user) => {
      if (!matchesUserFilters(user, filters)) return false;
      if (!query) return true;
      return (
        matchesSearchQuery(user.name, query) ||
        matchesSearchQuery(user.email, query) ||
        matchesSearchQuery(user.organization, query)
      );
    });
  }, [data, search, filters, serverPagination]);

  useEffect(() => {
    if (!serverPagination) setPage(1);
  }, [search, filters, serverPagination, setPage]);

  const displayTotal = serverPagination ? total : filteredData.length;

  const handleSuspendConfirm = useCallback(async () => {
    if (!pendingSuspend) return;
    try {
      await updateStatus({
        id: pendingSuspend.id,
        data: {
          status: pendingSuspend.status === "suspended" ? "active" : "suspended",
        },
      });
      showApiSuccessToast(
        pendingSuspend.status === "suspended"
          ? `${pendingSuspend.name} reactivated`
          : `${pendingSuspend.name} suspended`,
      );
      setPendingSuspend(null);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [pendingSuspend, updateStatus]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser(pendingDelete.id);
      showApiSuccessToast(`${pendingDelete.name} has been deleted.`);
      setPendingDelete(null);
    } catch (error) {
      showApiErrorToast(error);
    }
  }, [pendingDelete, deleteUser]);

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setFilterDrawerOpen(true);
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setFilterDrawerOpen(false);
  };

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {displayTotal === 0 ? 0 : (page - 1) * USERS_PAGE_SIZE + 1}
      </Text>
      {" to "}
      <Text as="span" weight="semibold">
        {Math.min(page * USERS_PAGE_SIZE, displayTotal)}
      </Text>
      {" of "}
      <Text as="span" weight="semibold">{displayTotal}</Text> users
    </Text>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                allowClear
                prefix={<SearchOutlined className="text-muted" />}
                placeholder="Search users by name, email, or organization..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="max-w-md rounded-xl! bg-background!"
              />
            </div>

            {filterChips.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {filterChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-medium text-primary"
                  >
                    {chip.label}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-foreground"
                >
                  <CloseOutlined className="text-[10px]" />
                  Clear filters
                </button>
              </div>
            ) : null}
          </div>

          <Badge count={activeFilterCount} size="small" offset={[-4, 4]}>
            <Button icon={<FilterOutlined />} onClick={handleOpenFilters} className="w-fit font-medium!">
              Filter
            </Button>
          </Badge>
        </div>

        <Table<UserRecord>
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 960 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="No users found"
          emptyDescription={
            hasQuery
              ? "Try adjusting your search or filters to find the user you are looking for."
              : "Users will appear here once organizations invite members."
          }
        />

        {displayTotal > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={USERS_PAGE_SIZE}
            total={displayTotal}
            onChange={setPage}
          />
        ) : null}
      </div>

      <UserViewModal record={viewRecord} onClose={() => setViewRecord(null)} />
      <UserEditModal record={editRecord} onClose={() => setEditRecord(null)} />

      <UserFilterDrawer
        open={filterDrawerOpen}
        draftFilters={draftFilters}
        onClose={() => setFilterDrawerOpen(false)}
        onDraftChange={setDraftFilters}
        onApply={handleApplyFilters}
        onClear={clearFilters}
      />

      <ConfirmModal
        open={pendingSuspend !== null}
        onClose={() => setPendingSuspend(null)}
        onConfirm={() => void handleSuspendConfirm()}
        title={pendingSuspend?.status === "suspended" ? "Reactivate user" : "Suspend user"}
        description={
          pendingSuspend
            ? pendingSuspend.status === "suspended"
              ? `Reactivate ${pendingSuspend.name}?`
              : `Suspend ${pendingSuspend.name}? They will lose access until reactivated.`
            : undefined
        }
        confirmText={pendingSuspend?.status === "suspended" ? "Reactivate" : "Suspend"}
        confirmDanger={pendingSuspend?.status !== "suspended"}
        confirmLoading={suspendPending}
        icon={<StopOutlined />}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void handleDeleteConfirm()}
        title="Delete user"
        description={
          pendingDelete
            ? `Permanently delete ${pendingDelete.name}? This action cannot be undone and will remove all their data.`
            : undefined
        }
        confirmText="Delete permanently"
        confirmDanger
        confirmLoading={deletePending}
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(UsersTable);
