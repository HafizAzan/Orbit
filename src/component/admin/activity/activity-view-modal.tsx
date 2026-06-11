import { FlagOutlined } from "@ant-design/icons";
import React from "react";
import {
  ACTIVITY_CATEGORY_ICONS,
  ACTIVITY_CATEGORY_LABELS,
  ACTIVITY_CATEGORY_STYLES,
  ACTIVITY_SEVERITY_STYLES,
  type ActivityRecord,
} from "../../../data/admin-activity";
import { getActivityFlagReasonLabel } from "../../../lib/activity-review";
import { cn } from "../../../lib/utils";
import DetailModal from "../../ui/detail-modal";
import RecordDetailField from "../shared/record-detail-field";

type ActivityViewModalProps = {
  record: ActivityRecord | null;
  onClose: () => void;
};

function ActivityViewModal({ record, onClose }: ActivityViewModalProps) {
  const CategoryIcon = record ? ACTIVITY_CATEGORY_ICONS[record.category] : null;
  const severityStyle = record ? ACTIVITY_SEVERITY_STYLES[record.severity] : null;
  const isFlagged = record?.reviewStatus === "flagged";
  const isResolved = record?.reviewStatus === "resolved";

  return (
    <DetailModal
      open={record !== null}
      onClose={onClose}
      title={record?.title ?? "Activity details"}
      subtitle={record?.organization}
      icon={CategoryIcon ? <CategoryIcon /> : undefined}
      width={560}
    >
      {record && severityStyle ? (
        <>
          <div className="mb-5 rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-sm leading-relaxed text-muted">{record.description}</p>
          </div>

          {isFlagged || isResolved ? (
            <div
              className={cn(
                "mb-5 rounded-2xl border p-4",
                isFlagged ? "border-amber-200 bg-amber-50/60" : "border-emerald-200 bg-emerald-50/60",
              )}
            >
              <div className="flex items-center gap-2">
                <FlagOutlined className={cn("text-sm", isFlagged ? "text-amber-600" : "text-emerald-600")} />
                <p className="text-sm font-semibold text-foreground">
                  {isFlagged ? "Flagged for manual review" : "Review resolved"}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {record.flagReason ? (
                  <RecordDetailField label="Reason" value={getActivityFlagReasonLabel(record.flagReason)} />
                ) : null}
                {record.flaggedAt ? <RecordDetailField label="Flagged at" value={record.flaggedAt} /> : null}
                {record.resolvedAt ? <RecordDetailField label="Resolved at" value={record.resolvedAt} /> : null}
              </div>

              {record.flagNote ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">{record.flagNote}</p>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <RecordDetailField label="Actor" value={record.actor} />
            <RecordDetailField label="Time" value={record.timestamp} />
            <RecordDetailField label="Category">
              <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", ACTIVITY_CATEGORY_STYLES[record.category])}>
                {ACTIVITY_CATEGORY_LABELS[record.category]}
              </span>
            </RecordDetailField>
            <RecordDetailField label="Severity">
              <span className="inline-flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", severityStyle.dot)} />
                {severityStyle.label}
              </span>
            </RecordDetailField>
          </div>
        </>
      ) : null}
    </DetailModal>
  );
}

export default React.memo(ActivityViewModal);
