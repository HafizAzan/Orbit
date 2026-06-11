import React from "react";
import { PLAN_STYLES, STATUS_STYLES, type OrganizationRecord } from "../../../data/admin-organizations";
import { formatDate, getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import DetailModal from "../../ui/detail-modal";
import RecordDetailField from "../shared/record-detail-field";

type OrganizationViewModalProps = {
  record: OrganizationRecord | null;
  onClose: () => void;
};

function OrganizationViewModal({ record, onClose }: OrganizationViewModalProps) {
  const statusStyle = record ? STATUS_STYLES[record.status] : null;

  return (
    <DetailModal
      open={record !== null}
      onClose={onClose}
      title={record?.name ?? "Organization details"}
      subtitle={record ? `${record.slug}.flowsync.io` : undefined}
      icon={record ? <span className="text-sm font-bold text-primary">{getInitial(record.name)}</span> : undefined}
    >
      {record && statusStyle ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <RecordDetailField label="Owner" value={record.ownerName} />
          <RecordDetailField label="Owner email" value={record.ownerEmail} />
          <RecordDetailField label="Plan">
            <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", PLAN_STYLES[record.plan])}>
              {record.plan}
            </span>
          </RecordDetailField>
          <RecordDetailField label="Status">
            <span className="inline-flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", statusStyle.dot)} />
              {statusStyle.label}
            </span>
          </RecordDetailField>
          <RecordDetailField label="Users" value={record.users} />
          <RecordDetailField label="Projects" value={record.projects} />
          <RecordDetailField label="Created" value={formatDate(record.createdAt)} className="sm:col-span-2" />
        </div>
      ) : null}
    </DetailModal>
  );
}

export default React.memo(OrganizationViewModal);
