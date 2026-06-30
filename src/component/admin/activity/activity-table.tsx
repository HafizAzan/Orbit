import { CloseOutlined, DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createActivityTableColumns from "../../../columns/activity-table-columns";
import { ACTIVITIES_PAGE_SIZE, ACTIVITY_TABS, type ActivityRecord } from "../../../data/admin-activity";
import { useAdminActivity } from "../../../context/admin-activity-context";
import useActivityFilters from "../../../hooks/use-activity-filters";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { countActiveActivityFilters, getActivityFilterChips, matchesActivityFilters } from "../../../lib/activity-filters";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import ActivityFilterDrawer from "./activity-filter-drawer";
import ActivityFlagModal from "./activity-flag-modal";
import ActivityViewModal from "./activity-view-modal";

function ActivityTable() {
  const { activities, deleteActivities, flagActivity, resolveActivity, unflagActivity } = useAdminActivity();
  const { search, setSearch } = useAdminTableSearchParam();
  const { filters, draftFilters, setDraftFilters, setFilters, clearFilters } = useActivityFilters();
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ActivityRecord | null>(null);
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
        onDelete: setPendingDelete,
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

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, activities, filters]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, ACTIVITIES_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    deleteActivities(selectedRowKeys.map(String));
    toast.success(`${selectedCount} activity ${pluralize(selectedCount, "log")} removed successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const handleSingleDeleteConfirm = useCallback(() => {
    if (!pendingDelete) return;

    deleteActivities([pendingDelete.id]);
    setSelectedRowKeys((current) => current.filter((key) => key !== pendingDelete.id));
    toast.success("Activity log removed successfully");
    setPendingDelete(null);
  }, [deleteActivities, pendingDelete]);

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setFilterDrawerOpen(true);
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setFilterDrawerOpen(false);
  };

  const activeEventLabel = ACTIVITY_TABS.find((tab) => tab.key === filters.eventTab)?.label.toLowerCase() ?? "events";

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {filteredData.length === 0 ? 0 : (page - 1) * ACTIVITIES_PAGE_SIZE + 1}
      </Text>
      {" to "}
      <Text as="span" weight="semibold">{Math.min(page * ACTIVITIES_PAGE_SIZE, filteredData.length)}</Text>
      {" of "}
      <Text as="span" weight="semibold">{filteredData.length}</Text> {filters.eventTab === "all" ? "events" : activeEventLabel}
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

        <Table<ActivityRecord>
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
          }}
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

        {filteredData.length > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={ACTIVITIES_PAGE_SIZE}
            total={filteredData.length}
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
        onApply={handleApplyFilters}
        onClear={clearFilters}
      />

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Remove activity logs"
        description={`Are you sure you want to remove ${selectedCount} selected activity ${pluralize(selectedCount, "log")}? This action cannot be undone.`}
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined />}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleSingleDeleteConfirm}
        title="Remove activity log"
        description={
          pendingDelete
            ? `Are you sure you want to remove "${pendingDelete.title}"? This action cannot be undone.`
            : undefined
        }
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(ActivityTable);
