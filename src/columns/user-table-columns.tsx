import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { USER_ROLE_STYLES, USER_STATUS_STYLES, type UserRecord } from "../data/admin-users";
import { cn } from "../lib/utils";

type UserTableColumnOptions = {
  onView: (record: UserRecord) => void;
  onDelete: (record: UserRecord) => void;
};

function getActionItems(_record: UserRecord): MenuProps["items"] {
  return [
    { key: "view", label: "View profile", icon: <EyeOutlined /> },
    { key: "edit", label: "Edit user", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "Remove user", icon: <DeleteOutlined />, danger: true },
  ];
}

function createUserTableColumns({ onView, onDelete }: UserTableColumnOptions): ColumnsType<UserRecord> {
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
          <p className="font-semibold text-foreground">{record.name}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
      render: (email: string) => <span className="text-sm text-muted">{email}</span>,
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      responsive: ["lg"],
      render: (organization: string) => <span className="text-sm font-medium text-foreground">{organization}</span>,
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
      render: (lastActive: string) => <span className="text-sm text-muted">{lastActive}</span>,
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
