import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PLAN_STYLES, SUBSCRIPTION_STATUS_STYLES, type SubscriptionRecord } from "../data/admin-subscriptions";
import { formatCurrency, formatDate, getInitial } from "../lib/helper";
import { cn } from "../lib/utils";

function getActionItems(_record: SubscriptionRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View subscription", icon: <EyeOutlined /> },
    { key: "edit", label: "Edit billing", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Remove", icon: <DeleteOutlined />, danger: true },
  ];
}

const SUBSCRIPTION_TABLE_COLUMNS: ColumnsType<SubscriptionRecord> = [
  {
    title: "Organization",
    key: "organization",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feature-sync text-sm font-bold text-primary">
          {getInitial(record.organizationName)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{record.organizationName}</p>
          <p className="truncate text-xs text-muted">{record.contactEmail}</p>
        </div>
      </div>
    ),
  },
  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
    responsive: ["md"],
    render: (plan: SubscriptionRecord["plan"]) => (
      <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", PLAN_STYLES[plan])}>{plan}</span>
    ),
  },
  {
    title: "Billing Cycle",
    dataIndex: "billingCycle",
    key: "billingCycle",
    responsive: ["lg"],
    render: (cycle: SubscriptionRecord["billingCycle"]) => <span className="text-sm font-medium text-foreground">{cycle}</span>,
  },
  {
    title: "Renewal Date",
    dataIndex: "renewalDate",
    key: "renewalDate",
    responsive: ["md"],
    render: (date: string) => <span className="text-sm text-muted">{formatDate(date)}</span>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => <span className="font-semibold text-foreground">{formatCurrency(amount, "USD", 2)}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: SubscriptionRecord["status"]) => {
      const config = SUBSCRIPTION_STATUS_STYLES[status];

      return (
        <span className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold", config.badge)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
          {config.label}
        </span>
      );
    },
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

export default SUBSCRIPTION_TABLE_COLUMNS;
