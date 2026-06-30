import { CheckOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createActivityReviewTableColumns from "../../../columns/activity-review-table-columns";
import { ACTIVITIES_PAGE_SIZE, type ActivityRecord } from "../../../data/admin-activity";
import { useAdminActivity } from "../../../context/admin-activity-context";
import useAdminTableSearchParam from "../../../hooks/use-admin-table-search-param";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { toast } from "../../../lib/toast";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import ActivityViewModal from "./activity-view-modal";

function ActivityReviewTable() {
  const { flaggedActivities, resolveActivity, unflagActivity, deleteActivities } = useAdminActivity();
  const { search, setSearch } = useAdminTableSearchParam();
  const [page, setPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<ActivityRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ActivityRecord | null>(null);
  const [pendingResolve, setPendingResolve] = useState<ActivityRecord | null>(null);

  const columns = useMemo(
    () =>
      createActivityReviewTableColumns({
        onView: setViewRecord,
        onResolve: setPendingResolve,
        onUnflag: (record) => unflagActivity(record.id),
        onDelete: setPendingDelete,
      }),
    [unflagActivity],
  );

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return flaggedActivities.filter((activity) => {
      if (!query) return true;

      return (
        matchesSearchQuery(activity.title, query) ||
        matchesSearchQuery(activity.description, query) ||
        matchesSearchQuery(activity.organization, query) ||
        matchesSearchQuery(activity.actor, query)
      );
    });
  }, [flaggedActivities, search]);

  useEffect(() => {
    setPage(1);
  }, [search, flaggedActivities]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, ACTIVITIES_PAGE_SIZE), [filteredData, page]);

  const handleDeleteConfirm = useCallback(() => {
    if (!pendingDelete) return;

    deleteActivities([pendingDelete.id]);
    toast.success("Activity log removed successfully");
    setPendingDelete(null);
  }, [deleteActivities, pendingDelete]);

  const handleResolveConfirm = useCallback(() => {
    if (!pendingResolve) return;

    resolveActivity(pendingResolve.id);
    setPendingResolve(null);
  }, [pendingResolve, resolveActivity]);

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {filteredData.length === 0 ? 0 : (page - 1) * ACTIVITIES_PAGE_SIZE + 1}
      </Text>
      {" to "}
      <Text as="span" weight="semibold">{Math.min(page * ACTIVITIES_PAGE_SIZE, filteredData.length)}</Text>
      {" of "}
      <Text as="span" weight="semibold">{filteredData.length}</Text> flagged{" "}
      {pluralize(filteredData.length, "event")}
    </Text>
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-muted" />}
            placeholder="Search flagged events..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-md rounded-xl! bg-background!"
          />
        </div>

        <Table<ActivityRecord>
          rowKey="id"
          columns={columns}
          dataSource={paginatedData}
          scroll={{ x: 1100 }}
          pagination={false}
          wrapperClassName="border-0! rounded-none! shadow-none!"
          emptyTitle="Review queue is clear"
          emptyDescription={
            search.trim()
              ? "No flagged events match your search. Try a different query."
              : "There are no events waiting for manual review right now."
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

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
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

      <ConfirmModal
        open={pendingResolve !== null}
        onClose={() => setPendingResolve(null)}
        onConfirm={handleResolveConfirm}
        title="Mark review as resolved"
        description={
          pendingResolve
            ? `Confirm that "${pendingResolve.title}" has been reviewed and can be removed from the queue.`
            : undefined
        }
        confirmText="Mark resolved"
        icon={<CheckOutlined />}
      />
    </>
  );
}

export default React.memo(ActivityReviewTable);
