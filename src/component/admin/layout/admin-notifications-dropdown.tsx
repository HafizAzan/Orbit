import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { Badge, Dropdown } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ADMIN_NOTIFICATION_ITEM_HEIGHT_PX,
  ADMIN_NOTIFICATION_KIND_CONFIG,
  ADMIN_NOTIFICATION_VISIBLE_COUNT,
  ADMIN_NOTIFICATIONS,
  type AdminNotification,
} from "../../../data/admin-notifications";
import { ADMIN_ROUTES } from "../../../router/admin-routes";
import { cn } from "../../../lib/utils";

function AdminNotificationsDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(ADMIN_NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }, []);

  const handleNotificationClick = useCallback(
    (notification: AdminNotification) => {
      markAsRead(notification.id);
      setOpen(false);

      if (notification.href) {
        navigate(notification.href);
      }
    },
    [markAsRead, navigate],
  );

  const dropdownContent = (
    <div className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-feature-sync"
          >
            <CheckOutlined className="text-[10px]" />
            Mark all read
          </button>
        ) : null}
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: ADMIN_NOTIFICATION_VISIBLE_COUNT * ADMIN_NOTIFICATION_ITEM_HEIGHT_PX }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const config = ADMIN_NOTIFICATION_KIND_CONFIG[notification.kind];
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
                style={{ minHeight: ADMIN_NOTIFICATION_ITEM_HEIGHT_PX }}
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
                    <span className="line-clamp-1 text-sm font-semibold text-foreground">{notification.title}</span>
                    {!notification.read ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    ) : null}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{notification.message}</span>
                  <span className="mt-1 block text-[11px] font-medium text-muted">{notification.timeAgo}</span>
                </span>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <BellOutlined className="text-lg" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">No notifications</p>
            <p className="mt-1 text-xs text-muted">New platform alerts will appear here.</p>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/60 px-4 py-3">
        <Link
          to={ADMIN_ROUTES.ACTIVITY}
          onClick={() => setOpen(false)}
          className="block text-center text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          View all activity
        </Link>
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

export default React.memo(AdminNotificationsDropdown);
