import { DeleteOutlined, EllipsisOutlined, EyeOutlined, FlagOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ACTIVITY_CATEGORY_ICONS,
  ACTIVITY_CATEGORY_LABELS,
  ACTIVITY_CATEGORY_STYLES,
  ACTIVITY_SEVERITY_STYLES,
  type ActivityRecord,
} from "../data/admin-activity";
import { cn } from "../lib/utils";

function getActionItems(_record: ActivityRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View details", icon: <EyeOutlined /> },
    { key: "flag", label: "Flag for review", icon: <FlagOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Remove log", icon: <DeleteOutlined />, danger: true },
  ];
}

const ACTIVITY_TABLE_COLUMNS: ColumnsType<ActivityRecord> = [
  {
    title: "Event",
    key: "event",
    render: (_, record) => {
      const Icon = ACTIVITY_CATEGORY_ICONS[record.category];

      return (
        <div className="flex min-w-[220px] items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <Icon className="text-base" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{record.title}</p>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted">{record.description}</p>
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
    render: (organization: string) => <span className="text-sm font-medium text-foreground">{organization}</span>,
  },
  {
    title: "Actor",
    dataIndex: "actor",
    key: "actor",
    responsive: ["md"],
    render: (actor: string) => <span className="text-sm text-muted">{actor}</span>,
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
    render: (timestamp: string) => <span className="text-sm text-muted">{timestamp}</span>,
  },
  {
    title: "Actions",
    key: "actions",
    width: 48,
    render: (_, record) => (
      <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]} placement="bottomRight">
        <Button type="text" icon={<EllipsisOutlined />} className="text-muted!" aria-label="Actions" />
      </Dropdown>
    ),
  },
];

export default ACTIVITY_TABLE_COLUMNS;
