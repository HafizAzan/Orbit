import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import {
  CALENDAR_EVENT_TYPE_META,
  CALENDAR_VIEW_OPTIONS,
  type CalendarEventType,
  type CalendarViewMode,
} from "../../../data/workspace-calendar";
import { formatCalendarHeading } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

export type CalendarEventStats = Record<CalendarEventType, number>;

type CalendarPageHeaderProps = {
  activeDate: Date;
  view: CalendarViewMode;
  eventCount: number;
  eventCountLabel: string;
  eventStats: CalendarEventStats;
  readOnly?: boolean;
  assignedProjectCount?: number;
  onViewChange: (view: CalendarViewMode) => void;
  onNavigate: (direction: -1 | 1) => void;
  onToday: () => void;
  onNewEvent?: () => void;
};

function CalendarPageHeader({
  activeDate,
  view,
  eventCount,
  eventCountLabel,
  eventStats,
  readOnly = false,
  assignedProjectCount = 0,
  onViewChange,
  onNavigate,
  onToday,
  onNewEvent,
}: CalendarPageHeaderProps) {
  const heading = formatCalendarHeading(activeDate, view);

  return (
    <div className="mb-6 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Calendar
          </Title>
          <Paragraph size="sm" className="mt-1 max-w-2xl text-muted">
            {readOnly
              ? "View your task due dates, project deadlines, and team events. Calendar events are read-only for members."
              : "Track task due dates, project deadlines, and team meetings in one timeline."}
          </Paragraph>
          {readOnly ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-semibold text-primary">
                {assignedProjectCount} assigned {assignedProjectCount === 1 ? "project" : "projects"}
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted">
                Read-only schedule view
              </span>
            </div>
          ) : null}
        </div>

        {!readOnly && onNewEvent ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="w-full shrink-0 font-semibold! sm:w-auto"
            onClick={onNewEvent}
          >
            New Event
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-border bg-background p-1">
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={() => onNavigate(-1)}
                className="text-muted!"
                aria-label="Previous period"
              />
              <Text as="span" weight="semibold" className="min-w-[9rem] px-2 text-center text-sm text-foreground sm:min-w-[11rem] sm:text-base">
                {heading}
              </Text>
              <Button
                type="text"
                icon={<RightOutlined />}
                onClick={() => onNavigate(1)}
                className="text-muted!"
                aria-label="Next period"
              />
            </div>

            <Button onClick={onToday} className="rounded-xl! font-semibold!">
              Today
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
              {eventCount} {eventCount === 1 ? "item" : "items"} {eventCountLabel}
            </span>
            {(Object.keys(CALENDAR_EVENT_TYPE_META) as CalendarEventType[]).map((type) => {
              const count = eventStats[type];
              if (count === 0) return null;

              const meta = CALENDAR_EVENT_TYPE_META[type];

              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                >
                  <span className={cn("h-2 w-2 rounded-full", meta.dotClass)} />
                  {count} {meta.shortLabel.toLowerCase()}
                </span>
              );
            })}
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 sm:px-5" aria-label="Calendar view">
          {CALENDAR_VIEW_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onViewChange(option.value)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                view === option.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:border-border hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default React.memo(CalendarPageHeader);
