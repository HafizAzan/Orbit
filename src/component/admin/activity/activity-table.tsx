import { CalendarOutlined, DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ACTIVITY_TABLE_COLUMNS from "../../../columns/activity-table-columns";
import {
  ACTIVITIES_DATA,
  ACTIVITIES_PAGE_SIZE,
  ACTIVITY_FILTER_OPTIONS,
  ACTIVITY_TABS,
  type ActivityRecord,
  type ActivityTabKey,
} from "../../../data/admin-activity";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";

type ActivityTableProps = {
  data?: ActivityRecord[];
};

function ActivityTable({ data = ACTIVITIES_DATA }: ActivityTableProps) {
  const [rows, setRows] = useState(data);
  const [activeTab, setActiveTab] = useState<ActivityTabKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const tabbedData = useMemo(() => {
    if (activeTab === "all") return rows;
    return rows.filter((row) => row.category === activeTab);
  }, [rows, activeTab]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tabbedData;

    return tabbedData.filter(
      (activity) =>
        matchesSearchQuery(activity.title, query) ||
        matchesSearchQuery(activity.description, query) ||
        matchesSearchQuery(activity.organization, query) ||
        matchesSearchQuery(activity.actor, query),
    );
  }, [tabbedData, search]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, activeTab, rows]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, ACTIVITIES_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} activity ${pluralize(selectedCount, "log")} removed successfully`);
    setSelectedRowKeys([]);
    setBulkDeleteOpen(false);
  };

  const activeTabLabel = ACTIVITY_TABS.find((tab) => tab.key === activeTab)?.label.toLowerCase() ?? "events";

  const resultsSummary = (
    <span className="text-sm text-muted">
      Showing{" "}
      <span className="font-semibold text-foreground">
        {filteredData.length === 0 ? 0 : (page - 1) * ACTIVITIES_PAGE_SIZE + 1}
      </span>
      {" to "}
      <span className="font-semibold text-foreground">{Math.min(page * ACTIVITIES_PAGE_SIZE, filteredData.length)}</span>
      {" of "}
      <span className="font-semibold text-foreground">{filteredData.length}</span> {activeTab === "all" ? "events" : activeTabLabel}
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
              placeholder="Search events by title, organization, or actor..."
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
            {ACTIVITY_TABS.map((tab) => (
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

          <div className="flex flex-wrap gap-2">
            {ACTIVITY_FILTER_OPTIONS.map((filter) => (
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

        <Table<ActivityRecord>
          rowKey="id"
          columns={ACTIVITY_TABLE_COLUMNS}
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
            search
              ? "Try adjusting your search or filters to find the event you are looking for."
              : `There are no ${activeTabLabel} to display right now.`
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

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Remove activity logs"
        description={`Are you sure you want to remove ${selectedCount} selected activity ${pluralize(selectedCount, "log")}? This action cannot be undone.`}
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined className="text-xl text-red-500" />}
      />
    </>
  );
}

export default React.memo(ActivityTable);
