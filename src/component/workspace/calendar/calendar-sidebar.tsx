import { CalendarOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React from "react";
import {
  CALENDAR_FILTER_OPTIONS,
  type CalendarFilters,
  type CalendarProject,
} from "../../../data/workspace-calendar";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type CalendarSidebarProps = {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  projects?: CalendarProject[];
  projectsLoading?: boolean;
};

function CalendarSidebar({
  filters,
  onFiltersChange,
  projects = [],
  projectsLoading = false,
}: CalendarSidebarProps) {
  const handleFilterToggle = (key: keyof CalendarFilters, checked: boolean) => {
    if (key === "deadlinesOnly" && checked) {
      onFiltersChange({ myTasks: false, teamEvents: false, deadlinesOnly: true });
      return;
    }

    if (key !== "deadlinesOnly" && checked) {
      onFiltersChange({ ...filters, [key]: true, deadlinesOnly: false });
      return;
    }

    onFiltersChange({ ...filters, [key]: checked });
  };

  const upcomingDeadlines = projects.reduce((total, project) => total + project.eventCount, 0);

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Text as="p" size="xs" weight="bold" color="muted" className="tracking-wide uppercase">
          View Filters
        </Text>

        <div className="mt-4 space-y-3">
          {CALENDAR_FILTER_OPTIONS.map((option) => (
            <label key={option.key} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={filters[option.key]}
                onChange={(event) => handleFilterToggle(option.key, event.target.checked)}
              />
              <Text as="span" size="sm" weight="medium" className={option.colorClass}>
                {option.label}
              </Text>
            </label>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Text as="p" size="xs" weight="bold" color="muted" className="tracking-wide uppercase">
          Projects
        </Text>

        {projectsLoading ? (
          <Paragraph size="sm" className="mt-4">Loading projects...</Paragraph>
        ) : projects.length === 0 ? (
          <Paragraph size="sm" className="mt-4">No projects available.</Paragraph>
        ) : (
          <ul className="mt-4 max-h-48 space-y-3 overflow-y-auto pr-1">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", project.dotClass)} />
                  <Text as="span" size="sm" weight="medium" className="truncate">
                    {project.name}
                  </Text>
                </div>
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-background px-2 text-xs font-semibold text-muted">
                  {project.eventCount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-sm">
        <div className="relative z-10">
          <Title level={5} className="text-white">
            Sprint Focus
          </Title>
          <Paragraph size="sm" className="mt-2 leading-6 text-white/85">
            {upcomingDeadlines > 0
              ? `${upcomingDeadlines} scheduled project event${upcomingDeadlines === 1 ? "" : "s"} are on your calendar.`
              : "Create team events and track deadlines alongside task due dates."}
          </Paragraph>
          <button
            type="button"
            onClick={() => toast.info("Use New Event to schedule your next milestone.")}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Review Now
          </button>
        </div>

        <CalendarOutlined className="pointer-events-none absolute -right-2 -bottom-2 text-7xl text-white/10" />
      </article>
    </aside>
  );
}

export default React.memo(CalendarSidebar);
