import { CloseOutlined, DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createSubscriptionTableColumns from "../../../columns/subscription-table-columns";
import {
  SUBSCRIPTIONS_DATA,
  SUBSCRIPTIONS_PAGE_SIZE,
  SUBSCRIPTION_TABS,
  type SubscriptionRecord,
  type SubscriptionTabKey,
} from "../../../data/admin-subscriptions";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import useSubscriptionFilters from "../../../hooks/use-subscription-filters";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import {
  countActiveSubscriptionFilters,
  getSubscriptionFilterChips,
  matchesSubscriptionFilters,
} from "../../../lib/subscription-filters";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import SubscriptionFilterDrawer from "./subscription-filter-drawer";
import SubscriptionViewModal from "./subscription-view-modal";

type SubscriptionsTableProps = {
  data?: SubscriptionRecord[];
  onEditBilling?: (record: SubscriptionRecord) => void;
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
};

function SubscriptionsTable({
  data = SUBSCRIPTIONS_DATA,
  onEditBilling,
  serverPagination,
}: SubscriptionsTableProps) {
  const [rows, setRows] = useState(data);
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useSubscriptionFilters();
  const [activeTab, setActiveTab] = useState<SubscriptionTabKey>("active");
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SubscriptionRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<SubscriptionRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const columns = useMemo(
    () =>
      createSubscriptionTableColumns({
        onView: setViewRecord,
        onEditBilling: (record) => onEditBilling?.(record),
        onDelete: setPendingDelete,
      }),
    [onEditBilling],
  );

  const activeFilterCount = countActiveSubscriptionFilters(filters);
  const filterChips = getSubscriptionFilterChips(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  useEffect(() => {
    setRows(data);
  }, [data]);

  const tabbedData = useMemo(() => rows.filter((row) => row.status === activeTab), [rows, activeTab]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tabbedData.filter((subscription) => {
      if (!matchesSubscriptionFilters(subscription, filters)) return false;
      if (!query) return true;

      return (
        matchesSearchQuery(subscription.organizationName, query) ||
        matchesSearchQuery(subscription.contactEmail, query) ||
        matchesSearchQuery(subscription.plan, query)
      );
    });
  }, [tabbedData, search, filters]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [activeTab, rows, search, filters]);

  const paginatedData = useMemo(() => {
    if (serverPagination) {
      return filteredData;
    }

    return paginateItems(filteredData, page, SUBSCRIPTIONS_PAGE_SIZE);
  }, [filteredData, page, serverPagination]);

  const paginationPage = serverPagination?.page ?? page;
  const paginationPageSize = serverPagination?.pageSize ?? SUBSCRIPTIONS_PAGE_SIZE;
  const paginationTotal = serverPagination?.total ?? filteredData.length;
  const handlePageChange = serverPagination?.onChange ?? setPage;

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} ${pluralize(selectedCount, "subscription")} removed successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const handleSingleDeleteConfirm = useCallback(() => {
    if (!pendingDelete) return;

    setRows((current) => current.filter((row) => row.id !== pendingDelete.id));
    setSelectedRowKeys((current) => current.filter((key) => key !== pendingDelete.id));
    toast.success(`${pendingDelete.organizationName} subscription removed successfully`);
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
    <span className="text-sm text-muted">
      Displaying{" "}
      <span className="font-semibold text-foreground">
        {paginationTotal === 0 ? 0 : (paginationPage - 1) * paginationPageSize + 1}-
        {Math.min(paginationPage * paginationPageSize, paginationTotal)}
      </span>{" "}
      of <span className="font-semibold text-foreground">{paginationTotal}</span> results
    </span>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Input
                allowClear
                prefix={<SearchOutlined className="text-muted" />}
                placeholder="Search subscriptions by organization or email..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="max-w-xs rounded-xl! bg-background!"
              />

              <div className="flex flex-wrap gap-2">
                {SUBSCRIPTION_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      activeTab === tab.key ? "bg-feature-sync text-primary" : "text-muted hover:bg-background hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
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

        <Table<SubscriptionRecord>
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
          }}
          scroll={{ x: 900 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="No subscriptions found"
          emptyDescription={
            hasQuery
              ? "Try adjusting your search or filters to find the subscription you are looking for."
              : `There are no ${activeTab} subscriptions to display right now.`
          }
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

      <SubscriptionViewModal record={viewRecord} onClose={() => setViewRecord(null)} />

      <SubscriptionFilterDrawer
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
        title="Remove subscriptions"
        description={`Are you sure you want to remove ${selectedCount} selected ${pluralize(selectedCount, "subscription")}? This action cannot be undone.`}
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined />}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleSingleDeleteConfirm}
        title="Remove subscription"
        description={
          pendingDelete
            ? `Are you sure you want to remove the subscription for ${pendingDelete.organizationName}? This action cannot be undone.`
            : undefined
        }
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(SubscriptionsTable);
