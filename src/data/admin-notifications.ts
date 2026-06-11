import {
  AlertOutlined,
  AuditOutlined,
  BankOutlined,
  CreditCardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import { ADMIN_ROUTES } from "../router/admin-routes";

export type AdminNotificationKind = "review" | "billing" | "organization" | "user" | "system";

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  kind: AdminNotificationKind;
  href?: string;
};

export const ADMIN_NOTIFICATION_VISIBLE_COUNT = 4;

export const ADMIN_NOTIFICATION_ITEM_HEIGHT_PX = 76;

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "n1",
    title: "Review queue updated",
    message: "3 critical events are waiting for manual review.",
    timeAgo: "2m ago",
    read: false,
    kind: "review",
    href: ADMIN_ROUTES.ACTIVITY_REVIEW,
  },
  {
    id: "n2",
    title: "Payment failed",
    message: "Invoice #INV-2041 could not be processed for Pied Piper.",
    timeAgo: "15m ago",
    read: false,
    kind: "billing",
    href: ADMIN_ROUTES.ACTIVITY,
  },
  {
    id: "n3",
    title: "New organization registered",
    message: "Global Corp joined with Enterprise plan · 120 seats.",
    timeAgo: "1h ago",
    read: false,
    kind: "organization",
    href: ADMIN_ROUTES.ORGANIZATIONS,
  },
  {
    id: "n4",
    title: "API rate limit exceeded",
    message: "Oscorp exceeded production API threshold on US East cluster.",
    timeAgo: "2h ago",
    read: false,
    kind: "system",
    href: ADMIN_ROUTES.ACTIVITY,
  },
  {
    id: "n5",
    title: "Admin role assigned",
    message: "Michael Chen was registered as platform administrator.",
    timeAgo: "3h ago",
    read: true,
    kind: "user",
    href: ADMIN_ROUTES.USERS,
  },
  {
    id: "n6",
    title: "Subscription upgraded",
    message: "Acme Inc. moved from Pro to Enterprise plan.",
    timeAgo: "5h ago",
    read: true,
    kind: "billing",
    href: ADMIN_ROUTES.SUBSCRIPTIONS,
  },
  {
    id: "n7",
    title: "Webhook delivery failed",
    message: "3 consecutive failures for Stark Industries event endpoint.",
    timeAgo: "8h ago",
    read: true,
    kind: "system",
    href: ADMIN_ROUTES.ACTIVITY,
  },
  {
    id: "n8",
    title: "Weekly digest ready",
    message: "Platform usage summary for the last 7 days is available.",
    timeAgo: "1d ago",
    read: true,
    kind: "review",
    href: ADMIN_ROUTES.DASHBOARD,
  },
];

export const ADMIN_NOTIFICATION_KIND_CONFIG: Record<
  AdminNotificationKind,
  { icon: ComponentType<{ className?: string }>; className: string }
> = {
  review: { icon: AuditOutlined, className: "bg-amber-50 text-amber-600" },
  billing: { icon: CreditCardOutlined, className: "bg-emerald-50 text-emerald-600" },
  organization: { icon: BankOutlined, className: "bg-violet-50 text-violet-600" },
  user: { icon: TeamOutlined, className: "bg-indigo-50 text-indigo-600" },
  system: { icon: AlertOutlined, className: "bg-red-50 text-red-600" },
};
