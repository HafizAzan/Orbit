import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PLAN_STYLES, SUBSCRIPTION_STATUS_STYLES, type SubscriptionRecord } from "../data/admin-subscriptions";
import { formatCurrency, formatDate, getInitial } from "../lib/helper";
import { Text } from "../component/ui/typography";
import { cn } from "../lib/utils";

type SubscriptionTableColumnOptions = {
  onView: (record: SubscriptionRecord) => void;
  onEditBilling: (record: SubscriptionRecord) => void;
  onDelete: (record: SubscriptionRecord) => void;
};

function getActionItems(_record: SubscriptionRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View subscription", icon: <EyeOutlined /> },
    { key: "edit", label: "Edit billing", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Remove", icon: <DeleteOutlined />, danger: true },
  ];
}

function createSubscriptionTableColumns({ onView, onEditBilling, onDelete }: SubscriptionTableColumnOptions): ColumnsType<SubscriptionRecord> {
  return [
    {
      title: "Organization",
      key: "organization",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feature-sync text-sm font-bold text-primary">
            {getInitial(record.organizationName)}
          </div>
          <div className="min-w-0">
            <Text as="p" weight="semibold" className="truncate">{record.organizationName}</Text>
            <Text as="p" size="xs" color="muted" className="truncate">{record.contactEmail}</Text>
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
      render: (cycle: SubscriptionRecord["billingCycle"]) => <Text size="sm" weight="medium">{cycle}</Text>,
    },
    {
      title: "Renewal Date",
      dataIndex: "renewalDate",
      key: "renewalDate",
      responsive: ["md"],
      render: (date: string) => <Text size="sm" color="muted">{formatDate(date)}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <Text weight="semibold">{formatCurrency(amount, "USD", 2)}</Text>,
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
        <Dropdown
          menu={{
            items: getActionItems(record),
            onClick: ({ key }) => {
              if (key === "view") onView(record);
              if (key === "edit") onEditBilling(record);
              if (key === "delete") onDelete(record);
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

export default createSubscriptionTableColumns;
