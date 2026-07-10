import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, StopOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { USER_ROLE_STYLES, USER_STATUS_STYLES, type UserRecord } from "../data/admin-users";
import { Text } from "../component/ui/typography";
import { cn } from "../lib/utils";

type UserTableColumnOptions = {
  onView: (record: UserRecord) => void;
  onEdit: (record: UserRecord) => void;
  onSuspend: (record: UserRecord) => void;
  onDelete: (record: UserRecord) => void;
};

function getActionItems(record: UserRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View profile", icon: <EyeOutlined /> },
    { key: "edit", label: "Edit user", icon: <EditOutlined /> },
    {
      key: "suspend",
      label: record.status === "suspended" ? "Reactivate user" : "Suspend user",
      icon: <StopOutlined />,
      danger: record.status !== "suspended",
    },
    { type: "divider" },
    { key: "delete", label: "Delete user", icon: <DeleteOutlined />, danger: true },
  ];
}

function createUserTableColumns({ onView, onEdit, onSuspend, onDelete }: UserTableColumnOptions): ColumnsType<UserRecord> {
  return [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            className="shrink-0 bg-primary/10! text-primary! font-semibold!"
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(record.name)}`}
          />
          <Text as="p" weight="semibold">{record.name}</Text>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
      render: (email: string) => <Text size="sm" color="muted">{email}</Text>,
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      responsive: ["lg"],
      render: (organization: string) => <Text size="sm" weight="medium">{organization}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: UserRecord["role"]) => (
        <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", USER_ROLE_STYLES[role])}>{role}</span>
      ),
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      responsive: ["md"],
      render: (lastActive: string) => <Text size="sm" color="muted">{lastActive}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: UserRecord["status"]) => {
        const config = USER_STATUS_STYLES[status];

        return (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <span className={cn("h-2 w-2 rounded-full", config.dot)} />
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
              if (key === "edit") onEdit(record);
              if (key === "suspend") onSuspend(record);
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

export default createUserTableColumns;
