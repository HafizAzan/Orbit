import React, { useState } from "react";
import { Button } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { PLAN_STYLES, STATUS_STYLES, type OrganizationRecord } from "../../../data/admin-organizations";
import { useGenerateOrgHealth } from "../../../hooks/use-ai";
import { showApiErrorToast } from "../../../lib/api-error";
import { formatDate, getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import DetailModal from "../../ui/detail-modal";
import { Paragraph, Text } from "../../ui/typography";
import RecordDetailField from "../shared/record-detail-field";

type OrganizationViewModalProps = {
  record: OrganizationRecord | null;
  onClose: () => void;
};

function OrganizationViewModal({ record, onClose }: OrganizationViewModalProps) {
  const statusStyle = record ? STATUS_STYLES[record.status] : null;
  const { mutateAsync, data, isPending } = useGenerateOrgHealth();
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const handleHealth = async () => {
    if (!record) return;
    try {
      await mutateAsync({ organizationId: record.id });
      setLoadedFor(record.id);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <DetailModal
      open={record !== null}
      onClose={onClose}
      title={record?.name ?? "Organization details"}
      subtitle={record ? `${record.slug}.orbit.io` : undefined}
      icon={record ? <span className="text-sm font-bold text-primary">{getInitial(record.name)}</span> : undefined}
    >
      {record && statusStyle ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <RecordDetailField label="Owner" value={record.ownerName} />
            <RecordDetailField label="Owner email" value={record.ownerEmail} />
            <RecordDetailField label="Plan">
              <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", PLAN_STYLES[record.plan.code])}>
                {record.plan.name}
              </span>
            </RecordDetailField>
            <RecordDetailField label="Plan status" value={record.plan.status} />
            <RecordDetailField label="Plan started" value={formatDate(record.plan.createdAt)} />
            <RecordDetailField
              label="Plan expires"
              value={record.plan.expiresAt ? formatDate(record.plan.expiresAt) : "—"}
            />
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

          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Text weight="semibold">AI org health</Text>
              <Button
                size="small"
                icon={<RobotOutlined />}
                loading={isPending}
                onClick={() => void handleHealth()}
              >
                Analyze
              </Button>
            </div>
            {data?.draft && loadedFor === record.id ? (
              <div className="space-y-2">
                <Paragraph size="sm" className="mb-0!">{data.draft.executiveSummary}</Paragraph>
                <Text as="p" size="xs" color="muted">
                  Health {data.draft.healthScore}/100 · Risk {data.draft.riskLevel}
                </Text>
                {data.draft.recommendedNextActions?.length ? (
                  <ul className="list-disc pl-5 text-sm text-muted">
                    {data.draft.recommendedNextActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <Paragraph size="xs" className="mb-0! text-muted">
                Generate a risk and health narrative from live org, billing, and activity signals.
              </Paragraph>
            )}
          </div>
        </div>
      ) : null}
    </DetailModal>
  );
}

export default React.memo(OrganizationViewModal);
