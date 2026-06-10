import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import SUBSCRIPTION_TABLE_COLUMNS from "../../../columns/subscription-table-columns";
import {
  SUBSCRIPTIONS_DATA,
  SUBSCRIPTIONS_PAGE_SIZE,
  SUBSCRIPTION_TABS,
  type SubscriptionRecord,
  type SubscriptionTabKey,
} from "../../../data/admin-subscriptions";
import { paginateItems, pluralize } from "../../../lib/helper";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { ConfirmModal } from "../../ui/modal";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";

type SubscriptionsTableProps = {
  data?: SubscriptionRecord[];
};

function SubscriptionsTable({ data = SUBSCRIPTIONS_DATA }: SubscriptionsTableProps) {
  const [rows, setRows] = useState(data);
  const [activeTab, setActiveTab] = useState<SubscriptionTabKey>("active");
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const tabbedData = useMemo(() => rows.filter((row) => row.status === activeTab), [rows, activeTab]);

  const filteredData = useMemo(() => {
    return tabbedData;
  }, [tabbedData]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [activeTab, rows]);

  const paginatedData = useMemo(() => paginateItems(filteredData, page, SUBSCRIPTIONS_PAGE_SIZE), [filteredData, page]);

  const selectedCount = selectedRowKeys.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDeleteConfirm = () => {
    setRows((current) => current.filter((row) => !selectedRowKeys.includes(row.id)));
    toast.success(`${selectedCount} ${pluralize(selectedCount, "subscription")} removed successfully`);
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

          <Button danger icon={<DeleteOutlined />} disabled={!hasSelection} onClick={() => setBulkDeleteOpen(true)} className="w-fit font-semibold!">
            Bulk Delete{hasSelection ? ` (${selectedCount})` : ""}
          </Button>
        </div>

        <Table<SubscriptionRecord>
          rowKey="id"
          columns={SUBSCRIPTION_TABLE_COLUMNS}
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
          emptyDescription={`There are no ${activeTab} subscriptions to display right now.`}
        />

        {filteredData.length > 0 ? (
          <TablePaginationFooter
            summary={resultsSummary}
            current={page}
            pageSize={SUBSCRIPTIONS_PAGE_SIZE}
            total={filteredData.length}
            onChange={setPage}
          />
        ) : null}
      </div>

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Remove subscriptions"
        description={`Are you sure you want to remove ${selectedCount} selected ${pluralize(selectedCount, "subscription")}? This action cannot be undone.`}
        confirmText="Remove"
        confirmDanger
        icon={<DeleteOutlined className="text-xl text-red-500" />}
      />
    </>
  );
}

export default React.memo(SubscriptionsTable);
