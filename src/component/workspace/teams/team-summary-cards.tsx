import { ArrowUpOutlined, ReloadOutlined } from "@ant-design/icons";
import React from "react";
import {
  TEAM_SUMMARY_ICONS,
  TEAM_SUMMARY_STATS,
} from "../../../data/workspace-teams";
import { toast } from "../../../lib/toast";
import { cn } from "../../../lib/utils";

function TeamSummaryCards() {
  const { totalSeats, pendingInvites, activeToday, activeTodayTrend } = TEAM_SUMMARY_STATS;
  const seatUsagePercent = Math.round((totalSeats.used / totalSeats.total) * 100);
  const SeatsIcon = TEAM_SUMMARY_ICONS.seats;
  const InvitesIcon = TEAM_SUMMARY_ICONS.invites;
  const ActiveIcon = TEAM_SUMMARY_ICONS.active;

  const handleResendAll = () => {
    toast.success("Pending invites resent successfully");
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Total Seats</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-feature-sync text-primary">
            <SeatsIcon className="text-base" />
          </div>
        </div>

        <p className="mt-4 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {totalSeats.used}{" "}
          <span className="text-base font-medium text-muted">/ {totalSeats.total} available</span>
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${seatUsagePercent}%` }}
          />
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Pending Invites</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <InvitesIcon className="text-base" />
          </div>
        </div>

        <p className="mt-4 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{pendingInvites}</p>

        <button
          type="button"
          onClick={handleResendAll}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700"
        >
          <ReloadOutlined className="text-xs" />
          Resend all pending
        </button>
      </article>

      <article className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm md:col-span-2 xl:col-span-1")}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Active Today</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ActiveIcon className="text-base" />
          </div>
        </div>

        <p className="mt-4 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{activeToday}</p>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
          <ArrowUpOutlined className="text-[10px]" />
          {activeTodayTrend}
        </span>
      </article>
    </div>
  );
}

export default React.memo(TeamSummaryCards);
