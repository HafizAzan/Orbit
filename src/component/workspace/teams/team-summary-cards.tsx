import { ArrowUpOutlined, ReloadOutlined } from "@ant-design/icons";
import React from "react";
import { TEAM_SUMMARY_ICONS } from "../../../data/workspace-teams";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { useResendAllPendingInvites, useTeamStats } from "../../../hooks/use-workspace-team";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { cn } from "../../../lib/utils";
import { Text } from "../../ui/typography";

function TeamSummaryCards() {
  const { can } = useWorkspacePermissions();
  const canInvite = can("team.invite");
  const { data: stats } = useTeamStats();
  const { mutateAsync: resendAllPending, isPending } = useResendAllPendingInvites();

  const totalSeats = stats?.totalSeats ?? { used: 0, total: 0 };
  const pendingInvites = stats?.pendingInvites ?? 0;
  const activeToday = stats?.activeToday ?? 0;
  const activeTodayTrend = stats?.activeTodayTrend ?? "+0% from last week";
  const seatUsagePercent = totalSeats.total > 0 ? Math.round((totalSeats.used / totalSeats.total) * 100) : 0;
  const SeatsIcon = TEAM_SUMMARY_ICONS.seats;
  const InvitesIcon = TEAM_SUMMARY_ICONS.invites;
  const ActiveIcon = TEAM_SUMMARY_ICONS.active;

  const handleResendAll = async () => {
    try {
      const result = await resendAllPending();
      showApiSuccessToast(result.message);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {canInvite ? (
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">Total Seats</Text>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-feature-sync text-primary">
              <SeatsIcon className="text-base" />
            </div>
          </div>

          <Text as="p" weight="bold" className="mt-4 text-2xl tracking-tight lg:text-3xl">
            {totalSeats.used}{" "}
            <Text as="span" size="base" weight="medium" color="muted">/ {totalSeats.total} available</Text>
          </Text>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${seatUsagePercent}%` }}
            />
          </div>
        </article>
      ) : null}

      {canInvite ? (
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">Pending Invites</Text>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <InvitesIcon className="text-base" />
            </div>
          </div>

          <Text as="p" weight="bold" className="mt-4 text-2xl tracking-tight lg:text-3xl">{pendingInvites}</Text>

          <button
            type="button"
            onClick={handleResendAll}
            disabled={!canInvite || isPending || pendingInvites === 0}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ReloadOutlined className="text-xs" />
            Resend all pending
          </button>
        </article>
      ) : null}

      <article
        className={cn(
          "rounded-2xl border border-border bg-card p-5 shadow-sm",
          !canInvite ? "md:col-span-2 xl:col-span-3" : "md:col-span-2 xl:col-span-1",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Text as="p" size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">Active Today</Text>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ActiveIcon className="text-base" />
          </div>
        </div>

        <Text as="p" weight="bold" className="mt-4 text-2xl tracking-tight lg:text-3xl">{activeToday}</Text>

        <Text as="span" size="sm" weight="medium" className="mt-4 inline-flex items-center gap-1 text-emerald-600">
          <ArrowUpOutlined className="text-[10px]" />
          {activeTodayTrend}
        </Text>
      </article>
    </div>
  );
}

export default React.memo(TeamSummaryCards);
