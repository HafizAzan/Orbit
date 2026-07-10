import { CheckOutlined, CloseOutlined, EllipsisOutlined, EyeOutlined, FlagOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ACTIVITY_CATEGORY_ICONS,
  ACTIVITY_CATEGORY_LABELS,
  ACTIVITY_CATEGORY_STYLES,
  ACTIVITY_SEVERITY_STYLES,
  type ActivityRecord,
} from "../data/admin-activity";
import { Text } from "../component/ui/typography";
import { cn } from "../lib/utils";

type ActivityTableColumnOptions = {
  onView: (record: ActivityRecord) => void;
  onFlag: (record: ActivityRecord) => void;
  onResolve: (record: ActivityRecord) => void;
  onUnflag: (record: ActivityRecord) => void;
};

function getActionItems(record: ActivityRecord): MenuProps["items"] {
  const items: MenuProps["items"] = [{ key: "view", label: "View details", icon: <EyeOutlined /> }];

  if (record.reviewStatus === "none" || record.reviewStatus === "resolved") {
    items.push({ key: "flag", label: "Flag for review", icon: <FlagOutlined /> });
  }

  if (record.reviewStatus === "flagged") {
    items.push(
      { key: "resolve", label: "Mark as resolved", icon: <CheckOutlined /> },
      { key: "unflag", label: "Remove flag", icon: <CloseOutlined /> },
    );
  }

  return items;
}

function createActivityTableColumns({
  onView,
  onFlag,
  onResolve,
  onUnflag,
}: ActivityTableColumnOptions): ColumnsType<ActivityRecord> {
  return [
    {
      title: "Event",
      key: "event",
      render: (_, record) => {
        const Icon = ACTIVITY_CATEGORY_ICONS[record.category];
        const isFlagged = record.reviewStatus === "flagged";

        return (
          <div className="flex min-w-[220px] items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <Icon className="text-base" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Text as="p" weight="semibold">
                  {record.title}
                </Text>
                {isFlagged ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 uppercase">
                    <FlagOutlined className="text-[10px]" />
                    Review
                  </span>
                ) : null}
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
      title: "Actor",
      dataIndex: "actor",
      key: "actor",
      responsive: ["md"],
      render: (actor: string) => (
        <Text size="sm" color="muted">
          {actor}
        </Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: ActivityRecord["category"]) => (
        <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", ACTIVITY_CATEGORY_STYLES[category])}>
          {ACTIVITY_CATEGORY_LABELS[category]}
        </span>
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
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) => (
        <Text size="sm" color="muted">
          {timestamp}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 48,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: getActionItems(record),
            onClick: ({ key }) => {
              if (key === "view") onView(record);
              if (key === "flag") onFlag(record);
              if (key === "resolve") onResolve(record);
              if (key === "unflag") onUnflag(record);
            },
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<EllipsisOutlined />} className="text-muted!" aria-label="Actions" />
        </Dropdown>
      ),
    },
  ];
}

export default createActivityTableColumns;
