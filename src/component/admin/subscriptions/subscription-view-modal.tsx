import React from "react";
import { PLAN_STYLES } from "../../../data/admin-organizations";
import { SUBSCRIPTION_STATUS_STYLES, type SubscriptionRecord } from "../../../data/admin-subscriptions";
import { formatCurrency, formatDate, getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import DetailModal from "../../ui/detail-modal";
import RecordDetailField from "../shared/record-detail-field";

type SubscriptionViewModalProps = {
  record: SubscriptionRecord | null;
  onClose: () => void;
};

function SubscriptionViewModal({ record, onClose }: SubscriptionViewModalProps) {
  const statusStyle = record ? SUBSCRIPTION_STATUS_STYLES[record.status] : null;

  return (
    <DetailModal
      open={record !== null}
      onClose={onClose}
      title={record?.organizationName ?? "Subscription details"}
      subtitle={record?.contactEmail}
      icon={record ? <span className="text-sm font-bold text-primary">{getInitial(record.organizationName)}</span> : undefined}
    >
      {record && statusStyle ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <RecordDetailField label="Plan">
          <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", PLAN_STYLES[record.plan])}>
            {record.plan}
          </span>
        </RecordDetailField>
        <RecordDetailField label="Status">
          <span className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusStyle.badge)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
            {statusStyle.label}
          </span>
        </RecordDetailField>
        <RecordDetailField label="Billing cycle" value={record.billingCycle} />
        <RecordDetailField label="Amount" value={formatCurrency(record.amount, "USD", 2)} />
        <RecordDetailField label="Renewal date" value={formatDate(record.renewalDate)} className="sm:col-span-2" />
      </div>
      ) : null}
    </DetailModal>
  );
}

export default React.memo(SubscriptionViewModal);
