import {
  DeleteOutlined,
  EllipsisOutlined,
  MailOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TEAM_DEPARTMENT_LABELS,
  TEAM_ROLE_LABELS,
  TEAM_ROLE_STYLES,
  TEAM_STATUS_STYLES,
  type TeamMember,
} from "../data/workspace-teams";
import { pluralize } from "../lib/helper";
import { getInitial } from "../lib/helper";
import { cn } from "../lib/utils";

type WorkspaceTeamTableColumnOptions = {
  onEditRole?: (record: TeamMember) => void;
  onResendInvite?: (record: TeamMember) => void;
  onDeactivate?: (record: TeamMember) => void;
  canChangeRole?: boolean;
  canManageInvites?: boolean;
};

function getActionItems(
  record: TeamMember,
  { canChangeRole = false, canManageInvites = false }: Pick<WorkspaceTeamTableColumnOptions, "canChangeRole" | "canManageInvites">,
): MenuProps["items"] {
  const items: MenuProps["items"] = [];

  if (canChangeRole) {
    items.push({ key: "edit-role", label: "Change role", icon: <UserSwitchOutlined /> });
  }

  if (canManageInvites && record.status === "invited") {
    items.push({ key: "resend", label: "Resend invite", icon: <MailOutlined /> });
  }

  if (canChangeRole && record.role !== "owner") {
    items.push({ type: "divider" });
    items.push({
      key: "deactivate",
      label: record.status === "deactivated" ? "Reactivate member" : "Deactivate member",
      icon: <DeleteOutlined />,
      danger: record.status !== "deactivated",
    });
  }

  return items;
}

function createWorkspaceTeamTableColumns({
  onEditRole,
  onResendInvite,
  onDeactivate,
  canChangeRole = false,
  canManageInvites = false,
}: WorkspaceTeamTableColumnOptions = {}): ColumnsType<TeamMember> {
  const showActions = canChangeRole || canManageInvites;

  return [
    {
      title: "Member",
      key: "member",
      width: 260,
      fixed: "left",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            className={cn("shrink-0 font-semibold!", record.avatarColor ?? "bg-primary/10! text-primary!")}
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(record.name)}`}
          >
            {getInitial(record.name)}
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{record.name}</p>
            <p className="truncate text-sm text-muted">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 130,
      render: (department: TeamMember["department"]) => (
        <span className="text-sm font-medium text-foreground">{TEAM_DEPARTMENT_LABELS[department]}</span>
      ),
    },
    {
      title: "Projects",
      dataIndex: "projects",
      key: "projects",
      width: 110,
      render: (projects: number) => (
        <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
          {projects} {pluralize(projects, "project")}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joinedDate",
      key: "joinedDate",
      width: 130,
      responsive: ["lg"],
      render: (joinedDate: string) => <span className="text-sm text-muted">{joinedDate}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: TeamMember["role"]) => (
        <span className={TEAM_ROLE_STYLES[role]}>{TEAM_ROLE_LABELS[role]}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: TeamMember["status"]) => {
        const config = TEAM_STATUS_STYLES[status];

        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              config.pill,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      responsive: ["md"],
      width: 140,
      render: (lastActive: string) => <span className="text-sm text-muted">{lastActive}</span>,
    },
    ...(showActions
      ? [
          {
            title: "Actions",
            key: "actions",
            width: 64,
            align: "center" as const,
            render: (_: unknown, record: TeamMember) => (
              <Dropdown
                menu={{
                  items: getActionItems(record, { canChangeRole, canManageInvites }),
                  onClick: ({ key }) => {
                    if (key === "edit-role") onEditRole?.(record);
                    if (key === "resend") onResendInvite?.(record);
                    if (key === "deactivate") onDeactivate?.(record);
                  },
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button type="text" icon={<EllipsisOutlined />} className="text-muted!" aria-label="Member actions" />
              </Dropdown>
            ),
          },
        ]
      : []),
  ];
}

export default createWorkspaceTeamTableColumns;
