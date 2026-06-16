import {
  CalendarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";

export type WorkspaceNotificationKind = "project" | "task" | "team" | "comment" | "calendar";

export type WorkspaceNotification = {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  kind: WorkspaceNotificationKind;
  href?: string;
};

export const WORKSPACE_NOTIFICATION_VISIBLE_COUNT = 4;

export const WORKSPACE_NOTIFICATION_ITEM_HEIGHT_PX = 76;

export const WORKSPACE_NOTIFICATIONS: WorkspaceNotification[] = [
  {
    id: "wn1",
    title: "Task assigned to you",
    message: "Sarah assigned “Update API documentation” in Nova UI System.",
    timeAgo: "5m ago",
    read: false,
    kind: "task",
    href: WORKSPACE_ROUTES.TASKS,
  },
  {
    id: "wn2",
    title: "Project milestone reached",
    message: "Mobile App Launch crossed 75% completion.",
    timeAgo: "32m ago",
    read: false,
    kind: "project",
    href: WORKSPACE_ROUTES.PROJECTS,
  },
  {
    id: "wn3",
    title: "New team invite accepted",
    message: "Alex Johnson joined your workspace as Member.",
    timeAgo: "1h ago",
    read: false,
    kind: "team",
    href: WORKSPACE_ROUTES.TEAMS,
  },
  {
    id: "wn4",
    title: "Comment mention",
    message: "Elena mentioned you on “Design system audit”.",
    timeAgo: "2h ago",
    read: false,
    kind: "comment",
    href: WORKSPACE_ROUTES.TASKS,
  },
  {
    id: "wn5",
    title: "Sprint review tomorrow",
    message: "Q4 Website Rebrand review starts at 10:00 AM.",
    timeAgo: "4h ago",
    read: true,
    kind: "calendar",
    href: WORKSPACE_ROUTES.CALENDAR,
  },
  {
    id: "wn6",
    title: "Task completed",
    message: "David marked “Security audit checklist” as done.",
    timeAgo: "6h ago",
    read: true,
    kind: "task",
    href: WORKSPACE_ROUTES.TASKS,
  },
  {
    id: "wn7",
    title: "Board updated",
    message: "3 cards moved to Review on Nova UI System board.",
    timeAgo: "8h ago",
    read: true,
    kind: "project",
    href: WORKSPACE_ROUTES.BOARDS,
  },
  {
    id: "wn8",
    title: "Weekly summary ready",
    message: "Your workspace activity digest is available.",
    timeAgo: "1d ago",
    read: true,
    kind: "calendar",
    href: WORKSPACE_ROUTES.DASHBOARD,
  },
];

export const WORKSPACE_NOTIFICATION_KIND_CONFIG: Record<
  WorkspaceNotificationKind,
  { icon: ComponentType<{ className?: string }>; className: string }
> = {
  project: { icon: ProjectOutlined, className: "bg-violet-50 text-violet-600" },
  task: { icon: CheckCircleOutlined, className: "bg-sky-50 text-sky-600" },
  team: { icon: TeamOutlined, className: "bg-indigo-50 text-indigo-600" },
  comment: { icon: CommentOutlined, className: "bg-amber-50 text-amber-600" },
  calendar: { icon: CalendarOutlined, className: "bg-emerald-50 text-emerald-600" },
};
