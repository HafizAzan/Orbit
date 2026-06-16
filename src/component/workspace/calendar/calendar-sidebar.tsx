import { CalendarOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import React from "react";
import {
  CALENDAR_FILTER_OPTIONS,
  CALENDAR_PROJECTS,
  type CalendarFilters,
} from "../../../data/workspace-calendar";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";

type CalendarSidebarProps = {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
};

function CalendarSidebar({ filters, onFiltersChange }: CalendarSidebarProps) {
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

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-xs font-bold tracking-wide text-muted uppercase">View Filters</h3>

        <div className="mt-4 space-y-3">
          {CALENDAR_FILTER_OPTIONS.map((option) => (
            <label key={option.key} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={filters[option.key]}
                onChange={(event) => handleFilterToggle(option.key, event.target.checked)}
              />
              <span className={cn("text-sm font-medium", option.colorClass)}>{option.label}</span>
            </label>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-xs font-bold tracking-wide text-muted uppercase">Projects</h3>

        <ul className="mt-4 space-y-3">
          {CALENDAR_PROJECTS.map((project) => (
            <li key={project.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", project.dotClass)} />
                <span className="truncate text-sm font-medium text-foreground">{project.name}</span>
              </div>
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-background px-2 text-xs font-semibold text-muted">
                {project.eventCount}
              </span>
            </li>
          ))}
        </ul>
      </article>

      <article className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-sm">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold">Sprint Focus</h3>
          <p className="mt-2 text-sm leading-6 text-white/85">
            3 critical deadlines are approaching this week. Review blockers and reassign tasks before Friday.
          </p>
          <button
            type="button"
            onClick={() => toast.info("Sprint review — coming soon")}
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
