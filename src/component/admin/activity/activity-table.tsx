import { CloseOutlined, DownloadOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createActivityTableColumns from "../../../columns/activity-table-columns";
import { ACTIVITIES_PAGE_SIZE, ACTIVITY_TABS, type ActivityRecord } from "../../../data/admin-activity";
import { useAdminActivity } from "../../../context/admin-activity-context";
import useActivityFilters from "../../../hooks/use-activity-filters";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import { exportRowsAsCsv } from "../../../lib/csv-export";
import { matchesSearchQuery } from "../../../lib/helper";
import { countActiveActivityFilters, getActivityFilterChips, matchesActivityFilters } from "../../../lib/activity-filters";
import { toast } from "../../../lib/toast";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import ActivityFilterDrawer from "./activity-filter-drawer";
import ActivityFlagModal from "./activity-flag-modal";
import ActivityViewModal from "./activity-view-modal";

function ActivityTable() {
  const { activities, flagActivity, resolveActivity, unflagActivity, total, page, setPage } = useAdminActivity();
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useActivityFilters();
  const [pendingFlag, setPendingFlag] = useState<ActivityRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<ActivityRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const columns = useMemo(
    () =>
      createActivityTableColumns({
        onView: setViewRecord,
        onFlag: setPendingFlag,
        onResolve: (record) => resolveActivity(record.id),
        onUnflag: (record) => unflagActivity(record.id),
      }),
    [resolveActivity, unflagActivity],
  );

  const activeFilterCount = countActiveActivityFilters(filters);
  const filterChips = getActivityFilterChips(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      if (!matchesActivityFilters(activity, filters)) return false;
      if (!query) return true;

      return (
        matchesSearchQuery(activity.title, query) ||
        matchesSearchQuery(activity.description, query) ||
        matchesSearchQuery(activity.organization, query) ||
        matchesSearchQuery(activity.actor, query)
      );
    });
  }, [activities, search, filters]);

  const handleExportCsv = useCallback(() => {
    exportRowsAsCsv({
      filename: `activity-${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ["Title", "Description", "Organization", "Actor", "Category", "Severity", "Status", "Timestamp"],
      rows: filteredData.map((row) => [
        row.title,
        row.description,
        row.organization,
        row.actor,
        row.category,
        row.severity,
        row.reviewStatus,
        row.timestamp,
      ]),
    });
    toast.success(`Exported ${filteredData.length} activity events`);
  }, [filteredData]);

  useEffect(() => {
    // Keep page in sync when filters change.
  }, [search, activities, filters]);

  const activeEventLabel = ACTIVITY_TABS.find((tab) => tab.key === filters.eventTab)?.label.toLowerCase() ?? "events";

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {total === 0 ? 0 : (page - 1) * ACTIVITIES_PAGE_SIZE + 1}
      </Text>
      {" to "}
      <Text as="span" weight="semibold">
        {Math.min(page * ACTIVITIES_PAGE_SIZE, total)}
      </Text>
      {" of "}
      <Text as="span" weight="semibold">
        {total}
      </Text>{" "}
      {filters.eventTab === "all" ? "events" : activeEventLabel}
    </Text>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-1 flex-col gap-3">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-muted" />}
              placeholder="Search events by title, organization, or actor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-md rounded-xl! bg-background!"
            />

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

        <Table<ActivityRecord>
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1024 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="No activity found"
          emptyDescription={
            hasQuery
              ? "Try adjusting your search or filters to find the event you are looking for."
              : `There are no ${activeEventLabel} to display right now.`
          }
        />

        {total > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={ACTIVITIES_PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        ) : null}
      </div>

      <ActivityViewModal record={viewRecord} onClose={() => setViewRecord(null)} />

      <ActivityFlagModal
        open={pendingFlag !== null}
        record={pendingFlag}
        onClose={() => setPendingFlag(null)}
        onSubmit={flagActivity}
      />

      <ActivityFilterDrawer
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

export default React.memo(ActivityTable);
