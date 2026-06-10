import { CalendarOutlined, DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import USER_TABLE_COLUMNS from "../../../columns/user-table-columns";
import {
  USER_FILTER_OPTIONS,
  USERS_DATA,
  USERS_PAGE_SIZE,
  type UserRecord,
} from "../../../data/admin-users";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { toast } from "../../../lib/toast";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";

type UsersTableProps = {
  data?: UserRecord[];
};

function UsersTable({ data = USERS_DATA }: UsersTableProps) {
  const [rows, setRows] = useState(data);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter(
      (user) =>
        matchesSearchQuery(user.name, query) ||
        matchesSearchQuery(user.email, query) ||
        matchesSearchQuery(user.organization, query),
    );
  }, [rows, search]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, rows]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, USERS_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} ${pluralize(selectedCount, "user")} removed successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const resultsSummary = (
    <span className="text-sm text-muted">
      Showing{" "}
      <span className="font-semibold text-foreground">
        {filteredData.length === 0 ? 0 : (page - 1) * USERS_PAGE_SIZE + 1}
      </span>
      {" to "}
      <span className="font-semibold text-foreground">
        {Math.min(page * USERS_PAGE_SIZE, filteredData.length)}
      </span>
      {" of "}
      <span className="font-semibold text-foreground">{filteredData.length}</span> users
    </span>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-muted" />}
              placeholder="Search users by name, email, or organization..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-md rounded-xl! bg-background!"
            />

            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={!hasSelection}
              onClick={() => setBulkDeleteOpen(true)}
              className="w-fit shrink-0 font-semibold!"
            >
              Bulk Delete{hasSelection ? ` (${selectedCount})` : ""}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {USER_FILTER_OPTIONS.map((filter) => (
              <Button
                key={filter.key}
                icon={filter.key === "date-range" ? <CalendarOutlined /> : <FilterOutlined />}
                className="font-medium!"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <Table<UserRecord>
          rowKey="id"
          columns={USER_TABLE_COLUMNS}
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
            search
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

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Remove users"
        description={`Are you sure you want to remove ${selectedCount} selected ${pluralize(selectedCount, "user")}? This action cannot be undone.`}
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined className="text-xl text-red-500" />}
      />
    </>
  );
}

export default React.memo(UsersTable);
