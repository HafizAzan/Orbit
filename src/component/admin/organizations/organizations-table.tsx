import { DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ORGANIZATION_TABLE_COLUMNS from "../../../columns/organization-table-columns";
import { ORGANIZATIONS_DATA, ORGANIZATIONS_PAGE_SIZE, type OrganizationRecord } from "../../../data/admin-organizations";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { toast } from "../../../lib/toast";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";

type OrganizationsTableProps = {
  data?: OrganizationRecord[];
  emptyAction?: React.ReactNode;
};

function OrganizationsTable({ data = ORGANIZATIONS_DATA, emptyAction }: OrganizationsTableProps) {
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
      (org) =>
        matchesSearchQuery(org.name, query) ||
        matchesSearchQuery(org.slug, query) ||
        matchesSearchQuery(org.ownerName, query) ||
        matchesSearchQuery(org.ownerEmail, query),
    );
  }, [rows, search]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, rows]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, ORGANIZATIONS_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} ${pluralize(selectedCount, "organization")} deleted successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const resultsSummary = (
    <span className="text-sm text-muted">
      Displaying <span className="font-semibold text-foreground">{filteredData.length}</span> of{" "}
      <span className="font-semibold text-foreground">{rows.length}</span> results
    </span>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-muted" />}
              placeholder="Search organizations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-xs rounded-xl! bg-background!"
            />
            <Button icon={<FilterOutlined />} className="w-fit font-medium!">
              Filter
            </Button>
          </div>

          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!hasSelection}
            onClick={() => setBulkDeleteOpen(true)}
            className="w-fit font-semibold!"
          >
            Bulk Delete{hasSelection ? ` (${selectedCount})` : ""}
          </Button>
        </div>

        <Table<OrganizationRecord>
          rowKey="id"
          columns={ORGANIZATION_TABLE_COLUMNS}
          dataSource={paginatedData}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
          }}
          scroll={{ x: 960 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="No organizations found"
          emptyDescription={
            search
              ? "Try adjusting your search or filters to find what you are looking for."
              : "Get started by creating your first organization on the platform."
          }
          emptyAction={emptyAction}
        />

        {filteredData.length > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={ORGANIZATIONS_PAGE_SIZE}
            total={filteredData.length}
            onChange={setPage}
          />
        ) : null}
      </div>

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete organizations"
        description={`Are you sure you want to delete ${selectedCount} selected ${pluralize(selectedCount, "organization")}? This action cannot be undone.`}
        confirmText="Delete"
        confirmDanger
        icon={<DeleteOutlined className="text-xl text-red-500" />}
      />
    </>
  );
}

export default React.memo(OrganizationsTable);
