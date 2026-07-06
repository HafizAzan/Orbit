import React from "react";
import {
  CALENDAR_EVENT_TYPE_META,
  CALENDAR_FILTER_OPTIONS,
  type CalendarEventType,
  type CalendarFilters,
  type CalendarProject,
} from "../../../data/workspace-calendar";
import { cn } from "../../../lib/utils";
import type { CalendarEventStats } from "./calendar-page-header";
import { Paragraph, Text, Title } from "../../ui/typography";

type CalendarSidebarProps = {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  projects?: CalendarProject[];
  projectsLoading?: boolean;
  eventStats: CalendarEventStats;
  readOnly?: boolean;
};

function CalendarSidebar({
  filters,
  onFiltersChange,
  projects = [],
  projectsLoading = false,
  eventStats,
  readOnly = false,
}: CalendarSidebarProps) {
  const handleFilterToggle = (key: keyof CalendarFilters) => {
    const isActive = filters[key];

    if (key === "deadlinesOnly") {
      onFiltersChange(
        isActive
          ? { myTasks: true, teamEvents: true, deadlinesOnly: false }
          : { myTasks: false, teamEvents: false, deadlinesOnly: true },
      );
      return;
    }

    if (isActive) {
      const next = { ...filters, [key]: false };
      if (!next.myTasks && !next.teamEvents && !next.deadlinesOnly) {
        next.deadlinesOnly = false;
        next[key] = true;
      }
      onFiltersChange(next);
      return;
    }

    onFiltersChange({ ...filters, [key]: true, deadlinesOnly: false });
  };

  const totalVisible = (Object.keys(eventStats) as CalendarEventType[]).reduce(
    (sum, type) => sum + eventStats[type],
    0,
  );

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Title level={5} className="text-sm! text-foreground">
          What you&apos;re seeing
        </Title>
        <Paragraph size="sm" className="mt-1">
          Colors match the event types shown on the grid.
        </Paragraph>

        <ul className="mt-4 space-y-2.5">
          {(Object.keys(CALENDAR_EVENT_TYPE_META) as CalendarEventType[]).map((type) => {
            const meta = CALENDAR_EVENT_TYPE_META[type];

            return (
              <li key={type} className="flex items-center justify-between gap-3 rounded-xl bg-background/70 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", meta.dotClass)} />
                  <Text as="span" size="sm" weight="medium">
                    {meta.label}
                  </Text>
                </div>
                <Text as="span" size="sm" weight="semibold" color="muted" className="tabular-nums">
                  {eventStats[type]}
                </Text>
              </li>
            );
          })}
        </ul>

        <Paragraph size="xs" className="mt-4 rounded-xl border border-dashed border-border bg-background/50 px-3 py-2.5 text-muted">
          {readOnly
            ? totalVisible > 0
              ? "Tap a task or deadline to open its detail page. Team meetings are view-only."
              : "No scheduled items in this period for your assigned projects."
            : totalVisible > 0
              ? "Your scheduled events open with edit and delete options. Tasks and project deadlines open their detail pages."
              : "No items in this period. Try another date range or adjust filters."}
        </Paragraph>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Title level={5} className="text-sm! text-foreground">
          Show on calendar
        </Title>

        <div className="mt-4 space-y-2">
          {CALENDAR_FILTER_OPTIONS.map((option) => {
            const isActive = filters[option.key];

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => handleFilterToggle(option.key)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                  isActive
                    ? "border-primary/30 bg-feature-sync"
                    : "border-border bg-background/50 hover:border-border hover:bg-background",
                )}
              >
                <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", option.dotClass)} />
                <span className="min-w-0">
                  <Text as="span" size="sm" weight="semibold" className="block text-foreground">
                    {option.label}
                  </Text>
                  <Text as="span" size="xs" color="muted" className="mt-0.5 block leading-5">
                    {option.description}
                  </Text>
                </span>
              </button>
            );
          })}
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <Title level={5} className="text-sm! text-foreground">
            {readOnly ? "Your projects" : "Projects"}
          </Title>
          <Text as="span" size="xs" color="muted">
            {readOnly ? `${projects.length} assigned` : "Scheduled events"}
          </Text>
        </div>

        {projectsLoading ? (
          <Paragraph size="sm" className="mt-4">
            Loading projects...
          </Paragraph>
        ) : projects.length === 0 ? (
          <Paragraph size="sm" className="mt-4">
            {readOnly
              ? "You are not assigned to any projects yet."
              : "No projects yet. Events you create can be linked to a project."}
          </Paragraph>
        ) : (
          <ul className="mt-4 max-h-52 space-y-2 overflow-y-auto pr-1">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-background/70 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", project.dotClass)} />
                  <Text as="span" size="sm" weight="medium" className="truncate">
                    {project.name}
                  </Text>
                </div>
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border bg-card px-2 text-xs font-semibold text-muted">
                  {project.eventCount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </aside>
  );
}

export default React.memo(CalendarSidebar);
