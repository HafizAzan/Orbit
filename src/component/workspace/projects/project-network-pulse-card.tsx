import React, { useMemo } from "react";
import type { ProjectDetailMember } from "../../../data/workspace-project-detail";
import type { ApiWorkspaceTask } from "../../../types/task.types";
import { cn } from "../../../lib/utils";
import { getInitial } from "../../../lib/helper";
import { Paragraph, Text, Title } from "../../ui/typography";
import OnlineStatusDot from "../common/online-status-dot";
import { useOrgPresence } from "../workspace-realtime-provider";

type ProjectNetworkPulseCardProps = {
  members: ProjectDetailMember[];
  tasks: ApiWorkspaceTask[];
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeeklyActivitySeries(tasks: ApiWorkspaceTask[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });

  const counts = days.map((day) => {
    const dayStart = day.getTime();
    const dayEnd = dayStart + 86_400_000;

    return tasks.filter((task) => {
      const updatedAt = new Date(task.updatedAt).getTime();
      return updatedAt >= dayStart && updatedAt < dayEnd;
    }).length;
  });

  const maxCount = Math.max(...counts, 1);

  return days.map((date, index) => ({
    label: DAY_LABELS[date.getDay()],
    count: counts[index],
    heightPercent: Math.round((counts[index] / maxCount) * 100),
    isToday: index === days.length - 1,
  }));
}

function ProjectNetworkPulseCard({ members, tasks }: ProjectNetworkPulseCardProps) {
  const { isOnline } = useOrgPresence();

  const onlineMembers = useMemo(
    () => members.filter((member) => isOnline(member.id)),
    [isOnline, members],
  );

  const weeklyActivity = useMemo(() => buildWeeklyActivitySeries(tasks), [tasks]);
  const updatesThisWeek = useMemo(
    () => weeklyActivity.reduce((total, day) => total + day.count, 0),
    [weeklyActivity],
  );

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Title level={5} color="default">
            Live Network Pulse
          </Title>
          <Paragraph size="sm" className="mt-1">
            Real-time squad activity and task momentum for this project.
          </Paragraph>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-background/70 px-4 py-3">
          <Text as="p" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
            Online now
          </Text>
          <Text as="p" weight="bold" className="mt-1 text-2xl tabular-nums">
            {onlineMembers.length}
            <Text as="span" size="sm" weight="medium" color="muted">
              {" "}
              / {members.length}
            </Text>
          </Text>
        </div>

        <div className="rounded-xl border border-border bg-background/70 px-4 py-3">
          <Text as="p" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
            Task updates
          </Text>
          <Text as="p" weight="bold" className="mt-1 text-2xl tabular-nums">
            {updatesThisWeek}
          </Text>
          <Text as="span" size="xs" color="muted">
            Last 7 days
          </Text>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
        <Text as="p" size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
          Weekly momentum
        </Text>

        <div className="mt-4 flex h-28 items-end justify-between gap-2">
          {weeklyActivity.map((day) => (
            <div key={day.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <Text as="span" size="xs" weight="semibold" className="tabular-nums text-muted">
                {day.count}
              </Text>
              <div className="flex h-20 w-full items-end justify-center">
                <div
                  className={cn(
                    "w-full max-w-8 rounded-t-lg transition-all",
                    day.isToday ? "bg-primary" : "bg-primary/35",
                  )}
                  style={{ height: `${Math.max(day.heightPercent, 8)}%` }}
                />
              </div>
              <Text
                as="span"
                size="xs"
                weight={day.isToday ? "semibold" : "medium"}
                className={day.isToday ? "text-primary" : "text-muted"}
              >
                {day.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {onlineMembers.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {onlineMembers.slice(0, 4).map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5"
            >
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    member.avatarColor,
                  )}
                >
                  {getInitial(member.name)}
                </div>
                <OnlineStatusDot online className="absolute -right-0.5 -bottom-0.5" />
              </div>
              <div className="min-w-0">
                <Text as="p" size="sm" weight="semibold" className="truncate">
                  {member.name}
                </Text>
                <Text as="p" size="xs" color="muted" className="truncate">
                  {member.role}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Paragraph size="sm" className="mt-5 rounded-xl border border-dashed border-border bg-background/50 px-3 py-3">
          No squad members online right now. Activity still tracks task updates throughout the week.
        </Paragraph>
      )}
    </article>
  );
}

export default React.memo(ProjectNetworkPulseCard);
