import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { CALENDAR_VIEW_OPTIONS, type CalendarViewMode } from "../../../data/workspace-calendar";
import { formatCalendarHeading } from "../../../lib/calendar-utils";
import { cn } from "../../../lib/utils";
import { Paragraph, Title } from "../../ui/typography";

type CalendarPageHeaderProps = {
  activeDate: Date;
  view: CalendarViewMode;
  eventCount: number;
  eventCountLabel: string;
  onViewChange: (view: CalendarViewMode) => void;
  onNavigate: (direction: -1 | 1) => void;
  onToday: () => void;
  onNewEvent: () => void;
};

function CalendarPageHeader({
  activeDate,
  view,
  eventCount,
  eventCountLabel,
  onViewChange,
  onNavigate,
  onToday,
  onNewEvent,
}: CalendarPageHeaderProps) {
  const heading = formatCalendarHeading(activeDate, view);

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          {heading}
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          You have {eventCount} {eventCount === 1 ? "event" : "events"} scheduled {eventCountLabel}.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex w-full items-center rounded-xl border border-border bg-card p-1 sm:w-auto">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => onNavigate(-1)}
            className="text-muted!"
            aria-label="Previous"
          />
          <Button type="text" onClick={onToday} className="px-4! font-semibold! text-foreground!">
            Today
          </Button>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => onNavigate(1)}
            className="text-muted!"
            aria-label="Next"
          />
        </div>

        <div className="inline-flex w-full rounded-xl border border-border bg-card p-1 sm:w-auto">
          {CALENDAR_VIEW_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onViewChange(option.value)}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none",
                view === option.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="w-full font-semibold! sm:w-auto"
          onClick={onNewEvent}
        >
          New Event
        </Button>
      </div>
    </div>
  );
}

export default React.memo(CalendarPageHeader);
