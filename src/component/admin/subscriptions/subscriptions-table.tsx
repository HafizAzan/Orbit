import { CloseOutlined, DownloadOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createSubscriptionTableColumns from "../../../columns/subscription-table-columns";
import {
  SUBSCRIPTION_TABS,
  type SubscriptionRecord,
  type SubscriptionTabKey,
} from "../../../data/admin-subscriptions";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import useSubscriptionFilters from "../../../hooks/use-subscription-filters";
import { exportRowsAsCsv } from "../../../lib/csv-export";
import { matchesSearchQuery } from "../../../lib/helper";
import {
  countActiveSubscriptionFilters,
  getSubscriptionFilterChips,
  matchesSubscriptionFilters,
} from "../../../lib/subscription-filters";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import SubscriptionFilterDrawer from "./subscription-filter-drawer";
import SubscriptionViewModal from "./subscription-view-modal";

type SubscriptionsTableProps = {
  data: SubscriptionRecord[];
  activeTab: SubscriptionTabKey;
  onTabChange: (tab: SubscriptionTabKey) => void;
  onEditBilling?: (record: SubscriptionRecord) => void;
  serverPagination: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
};

function SubscriptionsTable({
  data,
  activeTab,
  onTabChange,
  onEditBilling,
  serverPagination,
}: SubscriptionsTableProps) {
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useSubscriptionFilters();
  const [viewRecord, setViewRecord] = useState<SubscriptionRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const columns = useMemo(
    () =>
      createSubscriptionTableColumns({
        onView: setViewRecord,
        onEditBilling: (record) => onEditBilling?.(record),
      }),
    [onEditBilling],
  );

  const activeFilterCount = countActiveSubscriptionFilters(filters);
  const filterChips = getSubscriptionFilterChips(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((subscription) => {
      if (!matchesSubscriptionFilters(subscription, filters)) return false;
      if (!query) return true;

      return (
        matchesSearchQuery(subscription.organizationName, query) ||
        matchesSearchQuery(subscription.contactEmail, query) ||
        matchesSearchQuery(subscription.plan, query)
      );
    });
  }, [data, search, filters]);

  const handleExportCsv = useCallback(() => {
    exportRowsAsCsv({
      filename: `subscriptions-${new Date().toISOString().slice(0, 10)}.csv`,
      headers: [
        "Organization",
        "Email",
        "Plan",
        "Billing cycle",
        "Amount",
        "Currency",
        "Status",
        "Renewal",
        "Started",
      ],
      rows: filteredData.map((row) => [
        row.organizationName,
        row.contactEmail,
        row.plan,
        row.billingCycle,
        row.amount,
        row.currency,
        row.status,
        row.renewalDate,
        row.startedAt,
      ]),
    });
    toast.success(`Exported ${filteredData.length} subscriptions`);
  }, [filteredData]);

  useEffect(() => {
    serverPagination.onChange(1);
    // Reset to first page when filters/search change; parent owns page state.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [search, filters]);

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Displaying{" "}
      <Text as="span" weight="semibold">
        {serverPagination.total === 0
          ? 0
          : (serverPagination.page - 1) * serverPagination.pageSize + 1}
        -
        {Math.min(serverPagination.page * serverPagination.pageSize, serverPagination.total)}
      </Text>{" "}
      of <Text as="span" weight="semibold">{serverPagination.total}</Text> results
    </Text>
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
                    onClick={() => onTabChange(tab.key)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      activeTab === tab.key
                        ? "bg-feature-sync text-primary"
                        : "text-muted hover:bg-background hover:text-foreground",
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
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setDraftFilters(filters);
                setFilterDrawerOpen(true);
              }}
              className="w-fit font-medium!"
            >
              Filter
            </Button>
          </Badge>

          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportCsv}
            disabled={filteredData.length === 0}
            className="w-fit font-medium!"
          >
            Export CSV
          </Button>
        </div>

        <Table<SubscriptionRecord>
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
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

        {serverPagination.total > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={serverPagination.page}
            pageSize={serverPagination.pageSize}
            total={serverPagination.total}
            onChange={serverPagination.onChange}
          />
        ) : null}
      </div>

      <SubscriptionViewModal record={viewRecord} onClose={() => setViewRecord(null)} />

      <SubscriptionFilterDrawer
        open={filterDrawerOpen}
        draftFilters={draftFilters}
        onClose={() => setFilterDrawerOpen(false)}
        onDraftChange={setDraftFilters}
        onApply={() => {
          setFilters(draftFilters);
          setFilterDrawerOpen(false);
        }}
        onClear={clearFilters}
      />
    </>
  );
}

export default React.memo(SubscriptionsTable);
