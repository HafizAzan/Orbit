import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Spin } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/app-context";
import type { ApiNotification } from "../../../api-services/notification.service";
import { cn } from "../../../lib/utils";
import { resolveWorkspaceNotificationHref } from "../../../lib/workspace-notification-routing";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "../../../hooks/use-notifications";
import {
  WORKSPACE_NOTIFICATION_ITEM_HEIGHT_PX,
  WORKSPACE_NOTIFICATION_KIND_CONFIG,
  WORKSPACE_NOTIFICATION_VISIBLE_COUNT,
  type WorkspaceNotification,
} from "../../../data/workspace-notifications";
import { Text } from "../../ui/typography";

function WorkspaceNotificationsDropdown() {
  const navigate = useNavigate();
  const app = useAppContext();
  const role = app?.user?.role;
  const isMember = role === "member";
  const [open, setOpen] = useState(false);
  const notificationsQuery = useNotifications();
  const unreadQuery = useUnreadNotificationCount();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = unreadQuery.data ?? notifications.filter((notification) => !notification.read).length;

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => Number(a.read) - Number(b.read)),
    [notifications],
  );

  const handleNotificationClick = useCallback(
    (notification: WorkspaceNotification & Pick<ApiNotification, "resourceType" | "resourceId">) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }

      setOpen(false);

      const href = resolveWorkspaceNotificationHref(notification, role);
      if (href) {
        navigate(href);
      }
    },
    [markAsRead, navigate, role],
  );

  const dropdownContent = (
    <div className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <Text as="p" size="sm" weight="semibold">
            Notifications
          </Text>
          <Text as="p" size="xs" color="muted">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </Text>
        </div>

        {unreadCount > 0 ? (
          <Button
            type="link"
            size="small"
            loading={isMarkingAll}
            onClick={() => markAllAsRead()}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold!"
          >
            <CheckOutlined className="text-[10px]" />
            Mark all read
          </Button>
        ) : null}
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: WORKSPACE_NOTIFICATION_VISIBLE_COUNT * WORKSPACE_NOTIFICATION_ITEM_HEIGHT_PX }}
      >
        {notificationsQuery.isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => {
            const config = WORKSPACE_NOTIFICATION_KIND_CONFIG[notification.kind];
            const Icon = config.icon;

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-background/80",
                  !notification.read && "bg-feature-sync/40",
                )}
                style={{ minHeight: WORKSPACE_NOTIFICATION_ITEM_HEIGHT_PX }}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    config.className,
                  )}
                >
                  <Icon className="text-sm" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <Text as="span" size="sm" weight="semibold" className="line-clamp-1">
                      {notification.title}
                    </Text>
                    {!notification.read ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    ) : null}
                  </span>
                  <Text as="span" size="xs" color="muted" className="mt-0.5 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </Text>
                  <Text as="span" size="xs" weight="medium" color="muted" className="mt-1 block text-[11px]!">
                    {notification.timeAgo}
                  </Text>
                </span>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <BellOutlined className="text-lg" />
            </span>
            <Text as="p" size="sm" weight="semibold">
              No notifications
            </Text>
            <Text as="p" size="xs" color="muted" className="mt-1">
              New workspace alerts will appear here in real time.
            </Text>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/60 px-4 py-3">
        {isMember ? (
          <Link
            to={WORKSPACE_ROUTES.MY_TASKS}
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View my tasks
          </Link>
        ) : (
          <Link
            to={WORKSPACE_ROUTES.ACTIVITY_LOGS}
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View all activity
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => dropdownContent}
      styles={{ root: { boxShadow: "none", background: "transparent", padding: 0 } }}
    >
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-background hover:text-foreground"
      >
        <Badge count={unreadCount} size="small" offset={[-2, 2]} overflowCount={9}>
          <BellOutlined className="text-lg" />
        </Badge>
      </button>
    </Dropdown>
  );
}

export default React.memo(WorkspaceNotificationsDropdown);
