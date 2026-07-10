import { FlagOutlined, RobotOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  ACTIVITY_CATEGORY_ICONS,
  ACTIVITY_CATEGORY_LABELS,
  ACTIVITY_CATEGORY_STYLES,
  ACTIVITY_SEVERITY_STYLES,
  type ActivityRecord,
} from "../../../data/admin-activity";
import { useDescribePlatformActivity } from "../../../hooks/use-ai";
import { getActivityFlagReasonLabel } from "../../../lib/activity-review";
import { showApiErrorToast } from "../../../lib/api-error";
import { cn } from "../../../lib/utils";
import DetailModal from "../../ui/detail-modal";
import RecordDetailField from "../shared/record-detail-field";
import { Paragraph, Text } from "../../ui/typography";

type ActivityViewModalProps = {
  record: ActivityRecord | null;
  onClose: () => void;
};

function ActivityViewModal({ record, onClose }: ActivityViewModalProps) {
  const CategoryIcon = record ? ACTIVITY_CATEGORY_ICONS[record.category] : null;
  const severityStyle = record ? ACTIVITY_SEVERITY_STYLES[record.severity] : null;
  const isFlagged = record?.reviewStatus === "flagged";
  const isResolved = record?.reviewStatus === "resolved";
  const { mutateAsync, data, isPending, reset } = useDescribePlatformActivity();
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    reset();
    setLoadedFor(null);
  }, [record?.id, reset]);

  const handleExplain = async () => {
    if (!record) return;
    try {
      await mutateAsync({ activityId: record.id });
      setLoadedFor(record.id);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

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
            <Paragraph size="sm" className="mb-0! leading-relaxed">
              {record.description}
            </Paragraph>
          </div>

          <div className="mb-5 rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Text weight="semibold">AI explanation</Text>
              <Button size="small" icon={<RobotOutlined />} loading={isPending} onClick={() => void handleExplain()}>
                Explain
              </Button>
            </div>
            {data?.draft && loadedFor === record.id ? (
              <div className="space-y-2">
                <Text as="p" weight="semibold">
                  {data.draft.headline}
                </Text>
                <Paragraph size="sm" className="mb-0!">
                  {data.draft.explanation}
                </Paragraph>
                <Paragraph size="xs" className="mb-0! text-muted">
                  {data.draft.impact}
                </Paragraph>
                <Paragraph size="xs" className="mb-0! text-primary">
                  {data.draft.suggestedFollowUp}
                </Paragraph>
              </div>
            ) : (
              <Paragraph size="xs" className="mb-0! text-muted">
                Generate a plain-language explanation for this platform event.
              </Paragraph>
            )}
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
                <Text as="p" size="sm" weight="semibold">
                  {isFlagged ? "Flagged for manual review" : "Review resolved"}
                </Text>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {record.flagReason ? (
                  <RecordDetailField label="Reason" value={getActivityFlagReasonLabel(record.flagReason)} />
                ) : null}
                {record.flaggedAt ? <RecordDetailField label="Flagged at" value={record.flaggedAt} /> : null}
                {record.resolvedAt ? <RecordDetailField label="Resolved at" value={record.resolvedAt} /> : null}
              </div>

              {record.flagNote ? (
                <Paragraph size="sm" className="mt-3 mb-0! leading-relaxed">
                  {record.flagNote}
                </Paragraph>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <RecordDetailField label="Actor" value={record.actor} />
            <RecordDetailField label="Time" value={record.timestamp} />
            <RecordDetailField label="Category">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  ACTIVITY_CATEGORY_STYLES[record.category],
                )}
              >
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
