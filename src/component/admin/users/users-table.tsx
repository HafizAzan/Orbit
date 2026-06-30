import { CloseOutlined, DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createUserTableColumns from "../../../columns/user-table-columns";
import { USERS_DATA, USERS_PAGE_SIZE, type UserRecord } from "../../../data/admin-users";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import useUserFilters from "../../../hooks/use-user-filters";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { countActiveUserFilters, getUserFilterChips, matchesUserFilters } from "../../../lib/user-filters";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import UserFilterDrawer from "./user-filter-drawer";
import UserViewModal from "./user-view-modal";

type UsersTableProps = {
  data?: UserRecord[];
};

function UsersTable({ data = USERS_DATA }: UsersTableProps) {
  const [rows, setRows] = useState(data);
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useUserFilters();
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<UserRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<UserRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const columns = useMemo(
    () =>
      createUserTableColumns({
        onView: setViewRecord,
        onDelete: setPendingDelete,
      }),
    [],
  );

  const activeFilterCount = countActiveUserFilters(filters);
  const filterChips = getUserFilterChips(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  useEffect(() => {
    setRows(data);
  }, [data]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((user) => {
      if (!matchesUserFilters(user, filters)) return false;
      if (!query) return true;

      return (
        matchesSearchQuery(user.name, query) ||
        matchesSearchQuery(user.email, query) ||
        matchesSearchQuery(user.organization, query)
      );
    });
  }, [rows, search, filters]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, filters, rows]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, USERS_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} ${pluralize(selectedCount, "user")} removed successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const handleSingleDeleteConfirm = useCallback(() => {
    if (!pendingDelete) return;

    setRows((current) => current.filter((row) => row.id !== pendingDelete.id));
    setSelectedRowKeys((current) => current.filter((key) => key !== pendingDelete.id));
    toast.success(`${pendingDelete.name} removed successfully`);
    setPendingDelete(null);
  }, [pendingDelete]);

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
        {filteredData.length === 0 ? 0 : (page - 1) * USERS_PAGE_SIZE + 1}
      </Text>
      {" to "}
      <Text as="span" weight="semibold">
        {Math.min(page * USERS_PAGE_SIZE, filteredData.length)}
      </Text>
      {" of "}
      <Text as="span" weight="semibold">{filteredData.length}</Text> users
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

          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!hasSelection}
            onClick={() => setBulkDeleteOpen(true)}
            className={cn("w-fit font-semibold!", filterChips.length > 0 && "self-start sm:self-center")}
          >
            Bulk Delete{hasSelection ? ` (${selectedCount})` : ""}
          </Button>
        </div>

        <Table<UserRecord>
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
          }}
          scroll={{ x: 960 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="No users found"
          emptyDescription={
            hasQuery
              ? "Try adjusting your search or filters to find the user you are looking for."
              : "Invite admins or add users to get started."
          }
        />

        {filteredData.length > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={USERS_PAGE_SIZE}
            total={filteredData.length}
            onChange={setPage}
          />
        ) : null}
      </div>

      <UserViewModal record={viewRecord} onClose={() => setViewRecord(null)} />

      <UserFilterDrawer
        open={filterDrawerOpen}
        draftFilters={draftFilters}
        onClose={() => setFilterDrawerOpen(false)}
        onDraftChange={setDraftFilters}
        onApply={handleApplyFilters}
        onClear={clearFilters}
      />

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Remove users"
        description={`Are you sure you want to remove ${selectedCount} selected ${pluralize(selectedCount, "user")}? This action cannot be undone.`}
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined />}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleSingleDeleteConfirm}
        title="Remove user"
        description={
          pendingDelete
            ? `Are you sure you want to remove ${pendingDelete.name}? This action cannot be undone.`
            : undefined
        }
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(UsersTable);
