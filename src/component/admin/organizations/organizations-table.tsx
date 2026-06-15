import { CloseOutlined, DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createOrganizationTableColumns from "../../../columns/organization-table-columns";
import { ORGANIZATIONS_PAGE_SIZE, type OrganizationRecord } from "../../../data/admin-organizations";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import useOrganizationFilters from "../../../hooks/use-organization-filters";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { countActiveOrganizationFilters, getOrganizationFilterChips, matchesOrganizationFilters } from "../../../lib/organization-filters";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import OrganizationFilterDrawer from "./organization-filter-drawer";
import OrganizationViewModal from "./organization-view-modal";

type OrganizationsTableProps = {
  data?: OrganizationRecord[];
  emptyAction?: React.ReactNode;
  onEdit?: (record: OrganizationRecord) => void;
  onDelete?: (record: OrganizationRecord) => Promise<void>;
};

function OrganizationsTable({ data = [], emptyAction, onEdit, onDelete }: OrganizationsTableProps) {
  const [rows, setRows] = useState(data);
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useOrganizationFilters();
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<OrganizationRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<OrganizationRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const columns = useMemo(
    () =>
      createOrganizationTableColumns({
        onView: setViewRecord,
        onEdit: (record) => onEdit?.(record),
        onDelete: setPendingDelete,
      }),
    [onEdit],
  );

  const activeFilterCount = countActiveOrganizationFilters(filters);
  const filterChips = getOrganizationFilterChips(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  useEffect(() => {
    setRows(data);
  }, [data]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((org) => {
      const matchesFilters = matchesOrganizationFilters(org, filters);
      if (!matchesFilters) return false;

      if (!query) return true;

      return (
        matchesSearchQuery(org.name, query) ||
        matchesSearchQuery(org.slug, query) ||
        matchesSearchQuery(org.ownerName, query) ||
        matchesSearchQuery(org.ownerEmail, query)
      );
    });
  }, [rows, search, filters]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, filters, rows]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, ORGANIZATIONS_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} ${pluralize(selectedCount, "organization")} deleted successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const handleSingleDeleteConfirm = useCallback(async () => {
    if (!pendingDelete) return;

    try {
      if (onDelete) {
        await onDelete(pendingDelete);
      } else {
        setRows((current) => current.filter((row) => row.id !== pendingDelete.id));
      }

      setSelectedRowKeys((current) => current.filter((key) => key !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      // Error toast handled by parent.
    }
  }, [pendingDelete, onDelete]);

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setFilterDrawerOpen(true);
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setFilterDrawerOpen(false);
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
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                allowClear
                prefix={<SearchOutlined className="text-muted" />}
                placeholder="Search organizations..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="max-w-xs rounded-xl! bg-background!"
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

        <Table<OrganizationRecord>
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
          emptyTitle="No organizations found"
          emptyDescription={
            hasQuery
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

      <OrganizationViewModal record={viewRecord} onClose={() => setViewRecord(null)} />

      <OrganizationFilterDrawer
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
        title="Delete organizations"
        description={`Are you sure you want to delete ${selectedCount} selected ${pluralize(selectedCount, "organization")}? This action cannot be undone.`}
        confirmText="Delete"
        confirmDanger
        icon={<DeleteOutlined />}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleSingleDeleteConfirm}
        title="Delete organization"
        description={
          pendingDelete
            ? `Are you sure you want to delete ${pendingDelete.name}? This action cannot be undone.`
            : undefined
        }
        confirmText="Delete"
        confirmDanger
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(OrganizationsTable);
