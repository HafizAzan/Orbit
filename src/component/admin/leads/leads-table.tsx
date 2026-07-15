import { Select } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import createLeadTableColumns from "../../../columns/lead-table-columns";
import {
  LEAD_STATUS_OPTIONS,
  LEADS_PAGE_SIZE,
  type ContactLeadRecord,
  type ContactLeadStatus,
} from "../../../data/admin-leads";
import { useAdminLeads, useUpdateAdminLeadStatus } from "../../../hooks/use-admin-leads";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import LeadViewModal from "./lead-view-modal";

function LeadsTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactLeadStatus | "all">("all");
  const [viewLead, setViewLead] = useState<ContactLeadRecord | null>(null);

  const { data, isLoading } = useAdminLeads({
    page,
    limit: LEADS_PAGE_SIZE,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const { mutateAsync: updateStatus, isPending } = useUpdateAdminLeadStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = useCallback(
    async (record: ContactLeadRecord, status: ContactLeadStatus) => {
      if (record.status === status) return;
      setUpdatingId(record.id);
      try {
        await updateStatus({ id: record.id, status });
        showApiSuccessToast(`Lead marked as ${status}`);
      } catch (error) {
        showApiErrorToast(error);
      } finally {
        setUpdatingId(null);
      }
    },
    [updateStatus],
  );

  const columns = useMemo(
    () =>
      createLeadTableColumns({
        onView: setViewLead,
        onStatusChange: (record, status) => {
          void handleStatusChange(record, status);
        },
        updatingId: isPending ? updatingId : null,
      }),
    [handleStatusChange, isPending, updatingId],
  );

  const total = data?.total ?? 0;
  const rows = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text as="span" size="sm" color="muted">
          {total} lead{total === 1 ? "" : "s"}
        </Text>
        <Select
          value={statusFilter}
          options={LEAD_STATUS_OPTIONS}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          className="w-40!"
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        pagination={false}
        emptyTitle="No leads yet"
        emptyDescription="Contact form submissions will appear here."
      />

      {total > LEADS_PAGE_SIZE ? (
        <TablePaginationFooter
          summary={
            <Text as="span" size="sm" color="muted">
              Page {page}
            </Text>
          }
          current={page}
          pageSize={LEADS_PAGE_SIZE}
          total={total}
          onChange={setPage}
        />
      ) : null}

      <LeadViewModal lead={viewLead} onClose={() => setViewLead(null)} />
    </div>
  );
}

export default React.memo(LeadsTable);
