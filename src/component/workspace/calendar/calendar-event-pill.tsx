import {
  CalendarOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { CALENDAR_EVENT_TYPE_META, type CalendarEvent } from "../../../data/workspace-calendar";
import { useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import { isManageableCalendarEvent } from "../../../lib/calendar-utils";
import { getProjectDetailPath } from "../../../data/workspace-project-detail";
import { getTaskDetailPath } from "../../../data/workspace-task-form";
import { cn } from "../../../lib/utils";
import type { CalendarEventInteractionProps } from "./calendar-event-interaction";

type CalendarEventPillProps = CalendarEventInteractionProps & {
  event: CalendarEvent;
  compact?: boolean;
};

function resolveEventHref(event: CalendarEvent) {
  if (event.source === "task" || event.id.startsWith("task-")) {
    return getTaskDetailPath(event.id.replace("task-", ""));
  }

  if (event.source === "project" || event.id.startsWith("project-")) {
    return getProjectDetailPath(event.id.replace("project-", ""));
  }

  return null;
}

function EventTypeIcon({ type }: { type: CalendarEvent["type"] }) {
  if (type === "task") return <CheckSquareOutlined className="shrink-0 text-[10px]!" />;
  if (type === "deadline") return <WarningOutlined className="shrink-0 text-[10px]!" />;
  return <CalendarOutlined className="shrink-0 text-[10px]!" />;
}

function CalendarEventPill({
  event,
  compact = false,
  currentUserId,
  onEditEvent,
  onDeleteEvent,
}: CalendarEventPillProps) {
  const isDark = useIsDarkAppTheme();
  const meta = CALENDAR_EVENT_TYPE_META[event.type];
  const href = resolveEventHref(event);
  const canManage = isManageableCalendarEvent(event, currentUserId);

  const menuItems = useMemo<MenuProps["items"]>(
    () => [
      { key: "edit", label: "Edit event", icon: <EditOutlined /> },
      { type: "divider" },
      { key: "delete", label: "Delete event", icon: <DeleteOutlined />, danger: true },
    ],
    [],
  );

  const className = cn(
    "flex min-w-0 w-full items-center gap-1 rounded-lg border font-medium",
    isDark ? meta.pillClassDark : meta.pillClass,
    compact ? "px-1 py-0.5 text-[10px] leading-tight sm:text-[11px]" : "px-2 py-1.5 text-xs",
  );

  const menuButtonClass = cn(
    "inline-flex shrink-0 items-center justify-center rounded-md text-current/70 transition-colors hover:bg-black/5 hover:text-current",
    compact ? "h-4 w-4 text-[10px]!" : "h-5 w-5 text-xs!",
    isDark && "hover:bg-white/10",
  );

  const actionMenu = canManage ? (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      menu={{
        items: menuItems,
        onClick: ({ key, domEvent }) => {
          domEvent.stopPropagation();
          if (key === "edit") onEditEvent?.(event);
          if (key === "delete") onDeleteEvent?.(event);
        },
      }}
    >
      <button
        type="button"
        aria-label="Event actions"
        className={menuButtonClass}
        onClick={(domEvent) => domEvent.stopPropagation()}
      >
        <EllipsisOutlined />
      </button>
    </Dropdown>
  ) : null;

  if (href) {
    return (
      <div className={className} title={`${meta.label}: ${event.title}`}>
        <Link
          to={href}
          className="flex min-w-0 flex-1 items-center gap-1.5 truncate transition-opacity hover:opacity-85"
          onClick={(domEvent) => domEvent.stopPropagation()}
        >
          <EventTypeIcon type={event.type} />
          <span className="truncate">{event.title}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={className} title={`${meta.label}: ${event.title}`}>
      <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate">
        <EventTypeIcon type={event.type} />
        <span className="truncate">{event.title}</span>
      </span>
      {actionMenu}
    </div>
  );
}

export default React.memo(CalendarEventPill);
