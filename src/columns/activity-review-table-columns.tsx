import {
  CheckOutlined,
  CloseOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ACTIVITY_CATEGORY_ICONS,
  ACTIVITY_CATEGORY_LABELS,
  ACTIVITY_CATEGORY_STYLES,
  ACTIVITY_SEVERITY_STYLES,
  type ActivityRecord,
} from "../data/admin-activity";
import { getActivityFlagReasonLabel } from "../lib/activity-review";
import { Text } from "../component/ui/typography";
import { cn } from "../lib/utils";

type ActivityReviewTableColumnOptions = {
  onView: (record: ActivityRecord) => void;
  onResolve: (record: ActivityRecord) => void;
  onUnflag: (record: ActivityRecord) => void;
};

function getReviewActionItems(_record: ActivityRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View details", icon: <EyeOutlined /> },
    { key: "resolve", label: "Mark as resolved", icon: <CheckOutlined /> },
    { key: "unflag", label: "Remove flag", icon: <CloseOutlined /> },
  ];
}

function createActivityReviewTableColumns({
  onView,
  onResolve,
  onUnflag,
}: ActivityReviewTableColumnOptions): ColumnsType<ActivityRecord> {
  return [
    {
      title: "Event",
      key: "event",
      render: (_, record) => {
        const Icon = ACTIVITY_CATEGORY_ICONS[record.category];

        return (
          <div className="flex min-w-[220px] items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Icon className="text-base" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Text as="p" weight="semibold">
                  {record.title}
                </Text>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 uppercase">
                  <FlagOutlined className="text-[10px]" />
                  Flagged
                </span>
              </div>
              <Text as="p" size="sm" color="muted" className="mt-0.5 line-clamp-1">
                {record.description}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      responsive: ["lg"],
      render: (organization: string) => (
        <Text size="sm" weight="medium">
          {organization}
        </Text>
      ),
    },
    {
      title: "Reason",
      key: "reason",
      render: (_, record) =>
        record.flagReason ? (
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            {getActivityFlagReasonLabel(record.flagReason)}
          </span>
        ) : (
          <Text size="sm" color="muted">
            —
          </Text>
        ),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      responsive: ["md"],
      render: (severity: ActivityRecord["severity"]) => {
        const config = ACTIVITY_SEVERITY_STYLES[severity];

        return (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <span className={cn("h-2 w-2 rounded-full", config.dot)} />
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Flagged",
      dataIndex: "flaggedAt",
      key: "flaggedAt",
      render: (flaggedAt: string | undefined) => (
        <Text size="sm" color="muted">
          {flaggedAt ?? "—"}
        </Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["xl"],
      render: (category: ActivityRecord["category"]) => (
        <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", ACTIVITY_CATEGORY_STYLES[category])}>
          {ACTIVITY_CATEGORY_LABELS[category]}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => onResolve(record)} className="font-semibold!">
            Resolve
          </Button>
          <Dropdown
            menu={{
              items: getReviewActionItems(record),
              onClick: ({ key }) => {
                if (key === "view") onView(record);
                if (key === "resolve") onResolve(record);
                if (key === "unflag") onUnflag(record);
              },
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="text" icon={<EllipsisOutlined />} className="text-muted!" aria-label="Actions" />
          </Dropdown>
        </div>
      ),
    },
  ];
}

export default createActivityReviewTableColumns;
