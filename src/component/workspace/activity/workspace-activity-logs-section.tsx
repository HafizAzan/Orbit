import { DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import React, { useMemo, useState } from "react";
import type { ActivityEvent } from "../../../types/activity.types";
import { formatDate } from "../../../lib/helper";
import { getWorkspaceRoleLabel } from "../../../lib/workspace-routing";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import {
  useDeleteWorkspaceActivity,
  useWorkspaceActivities,
} from "../../../hooks/use-workspace-activity";
import QueryErrorState from "../../common/query-error-state";
import { ConfirmModal } from "../../ui/modal";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import { Text } from "../../ui/typography";
import ActivityAiDescribeModal from "./activity-ai-describe-modal";

const MODULE_LABELS: Record<ActivityEvent["module"], string> = {
  tasks: "Tasks",
  projects: "Projects",
  teams: "Teams",
  members: "Members",
  organization: "Organization",
  security: "Security",
  billing: "Billing",
};

type WorkspaceActivityLogsSectionProps = {
  compact?: boolean;
  pageSize?: number;
};

function WorkspaceActivityLogsSection({
  compact = false,
  pageSize = compact ? 10 : 20,
}: WorkspaceActivityLogsSectionProps) {
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<ActivityEvent | null>(null);
  const [describeTarget, setDescribeTarget] = useState<ActivityEvent | null>(null);
  const activitiesQuery = useWorkspaceActivities({ page, limit: pageSize });
  const { mutateAsync: deleteActivityLog, isPending: deleting } = useDeleteWorkspaceActivity();

  const columns = useMemo(
    () => [
      {
        title: "When",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        render: (value: string) => (
          <Text as="span" size="sm" color="muted">{formatDate(value, { month: "short" })}</Text>
        ),
      },
      {
        title: "Module",
        dataIndex: "module",
        key: "module",
        width: 120,
        render: (module: ActivityEvent["module"]) => (
          <Tag className="rounded-full!">{MODULE_LABELS[module] ?? module}</Tag>
        ),
      },
      {
        title: "Actor",
        key: "actor",
        render: (_: unknown, record: ActivityEvent) => (
          <div>
            <Text as="p" weight="medium">{record.actorName}</Text>
            <Text as="p" size="xs" color="muted">{getWorkspaceRoleLabel(record.actorRole)}</Text>
          </div>
        ),
      },
      {
        title: "Activity",
        dataIndex: "summary",
        key: "summary",
        render: (summary: string) => <Text as="span" size="sm">{summary}</Text>,
      },
      {
        title: "Actions",
        key: "actions",
        width: 110,
        align: "center" as const,
        render: (_: unknown, record: ActivityEvent) => (
          <Space size={0}>
            <Button
              type="text"
              icon={<ThunderboltOutlined />}
              aria-label="Describe activity with AI"
              onClick={() => setDescribeTarget(record)}
            />
            {record.canDelete ? (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label="Delete activity log"
                onClick={() => setPendingDelete(record)}
              />
            ) : null}
          </Space>
        ),
      },
    ],
    [],
  );

  if (activitiesQuery.isError) {
    return (
      <QueryErrorState
        error={activitiesQuery.error}
        title="Unable to load activity logs"
        onRetry={() => {
          void activitiesQuery.refetch();
        }}
        isRetrying={activitiesQuery.isFetching}
      />
    );
  }

  const summary = activitiesQuery.data;

  return (
    <>
      <Table
        rowKey="id"
        loading={activitiesQuery.isPending}
        columns={columns}
        dataSource={summary?.data ?? []}
        pagination={false}
        scroll={{ x: 760 }}
      />

      {!compact && summary ? (
        <TablePaginationFooter
          summary={
            <Text as="span" size="sm" color="muted">
              Showing {summary.data.length} of {summary.total} activity logs
            </Text>
          }
          current={summary.page}
          pageSize={pageSize}
          total={summary.total}
          onChange={setPage}
        />
      ) : null}

      <ActivityAiDescribeModal
        open={describeTarget !== null}
        activity={describeTarget}
        onClose={() => setDescribeTarget(null)}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;

          try {
            const result = await deleteActivityLog(pendingDelete.id);
            showApiSuccessToast(result.message);
            setPendingDelete(null);
          } catch (error) {
            showApiErrorToast(error);
          }
        }}
        title="Remove activity log"
        description={
          pendingDelete ? (
            <>
              Remove this audit entry for{" "}
              <Text as="span" weight="semibold">{pendingDelete.summary}</Text>?
            </>
          ) : null
        }
        confirmText="Remove"
        confirmDanger
        confirmLoading={deleting}
        icon={<DeleteOutlined />}
      />
    </>
  );
}

export default React.memo(WorkspaceActivityLogsSection);
