import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PLAN_STYLES, STATUS_STYLES, type OrganizationRecord } from "../data/admin-organizations";
import { formatDate, getInitial } from "../lib/helper";
import { Text } from "../component/ui/typography";
import { cn } from "../lib/utils";

type OrganizationTableColumnOptions = {
  onView: (record: OrganizationRecord) => void;
  onEdit: (record: OrganizationRecord) => void;
  onDelete: (record: OrganizationRecord) => void;
};

function getActionItems(record: OrganizationRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View details", icon: <EyeOutlined /> },
    { key: "edit", label: "Edit organization", icon: <EditOutlined /> },
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      disabled: record.status === "active",
    },
  ];
}

function createOrganizationTableColumns({ onView, onEdit, onDelete }: OrganizationTableColumnOptions): ColumnsType<OrganizationRecord> {
  return [
    {
      title: "Organization Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-feature-sync text-sm font-bold text-primary">
            {getInitial(record.name)}
          </div>
          <div className="min-w-0">
            <Text as="p" weight="semibold" className="truncate">{record.name}</Text>
            <Text as="p" size="xs" color="muted" className="truncate">{record.slug}.flowsync.io</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      responsive: ["md"],
      render: (_, record) => (
        <div className="min-w-0">
          <Text as="p" weight="medium">{record.ownerName}</Text>
          <Text as="p" size="xs" color="muted" className="truncate">{record.ownerEmail}</Text>
        </div>
      ),
    },
    {
      title: "Plan",
      key: "plan",
      responsive: ["lg"],
      render: (_, record) => (
        <div className="min-w-0">
          <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide", PLAN_STYLES[record.plan.code])}>
            {record.plan.name}
          </span>
        </div>
      ),
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      responsive: ["lg"],
      render: (users: number) => <Text weight="medium">{users}</Text>,
    },
    {
      title: "Projects",
      dataIndex: "projects",
      key: "projects",
      responsive: ["xl"],
      render: (projects: number) => <Text weight="medium">{projects}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrganizationRecord["status"]) => {
        const config = STATUS_STYLES[status];

        return (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <span className={cn("h-2 w-2 rounded-full", config.dot)} />
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (date: string) => <Text size="sm" color="muted">{formatDate(date)}</Text>,
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
              if (key === "edit") onEdit(record);
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

export default createOrganizationTableColumns;
