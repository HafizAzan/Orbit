import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { getProjectBoardPath } from "../data/workspace-project-detail";
import { getTaskDetailPath } from "../data/workspace-task-form";
import {
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  type WorkspaceTask,
} from "../data/workspace-tasks";
import { formatDate } from "../lib/helper";
import { cn } from "../lib/utils";

type WorkspaceTaskTableColumnOptions = {
  onView?: (record: WorkspaceTask) => void;
  onEdit?: (record: WorkspaceTask) => void;
  onDelete?: (record: WorkspaceTask) => void;
  canEdit?: boolean;
  canDelete?: boolean;
};

function getActionItems(
  record: WorkspaceTask,
  { canEdit = false, canDelete = false }: Pick<WorkspaceTaskTableColumnOptions, "canEdit" | "canDelete">,
): MenuProps["items"] {
  const items: MenuProps["items"] = [{ key: "view", label: "View details", icon: <EyeOutlined /> }];

  if (canEdit) {
    items.push({ key: "edit", label: "Edit task", icon: <EditOutlined /> });
  }

  if (canDelete) {
    items.push({ type: "divider" });
    items.push({
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      disabled: record.status === "done",
    });
  }

  return items;
}

function createWorkspaceTaskTableColumns({
  onView,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: WorkspaceTaskTableColumnOptions = {}): ColumnsType<WorkspaceTask> {
  const showActions = Boolean(onView) || canEdit || canDelete;

  return [
    {
      title: "Task ID",
      dataIndex: "taskCode",
      key: "taskCode",
      width: 110,
      sorter: (a, b) => a.taskCode.localeCompare(b.taskCode),
      render: (taskCode: string, record) => (
        <Link
          to={getTaskDetailPath(record.id)}
          className="font-mono text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          {taskCode}
        </Link>
      ),
    },
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string, record) => (
        <Link
          to={getTaskDetailPath(record.id)}
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          {title}
        </Link>
      ),
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      responsive: ["lg"],
      render: (project: string, record) => (
        <Link
          to={getProjectBoardPath(record.projectId)}
          className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          {project}
        </Link>
      ),
    },
    {
      title: "Assignee",
      key: "assignee",
      responsive: ["md"],
      render: (_, record) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-feature-sync text-[11px] font-bold text-primary">
            {record.assignee.initials}
          </div>
          <span className="text-sm font-medium text-foreground">{record.assignee.name}</span>
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      responsive: ["sm"],
      render: (priority: WorkspaceTask["priority"]) => {
        const config = TASK_PRIORITY_CONFIG[priority];

        return (
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
              config.badgeClass,
            )}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: WorkspaceTask["status"]) => {
        const config = TASK_STATUS_CONFIG[status];

        return (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <span className={cn("h-2 w-2 rounded-full", config.dot)} />
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      responsive: ["xl"],
      sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
      render: (dueDate: string) => <span className="text-sm text-muted">{formatDate(dueDate)}</span>,
    },
    ...(showActions
      ? [
          {
            title: "Actions",
            key: "actions",
            width: 48,
            render: (_: unknown, record: WorkspaceTask) => (
              <Dropdown
                menu={{
                  items: getActionItems(record, { canEdit, canDelete }),
                  onClick: ({ key }) => {
                    if (key === "view") onView?.(record);
                    if (key === "edit") onEdit?.(record);
                    if (key === "delete") onDelete?.(record);
                  },
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button type="text" icon={<EllipsisOutlined />} className="text-muted!" aria-label="Actions" />
              </Dropdown>
            ),
          },
        ]
      : []),
  ];
}

export default createWorkspaceTaskTableColumns;
