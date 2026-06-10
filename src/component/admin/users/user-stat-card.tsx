import React from "react";
import { USER_META_STYLES, USER_STAT_ICONS, type UserStat } from "../../../data/admin-users";
import { cn } from "../../../lib/utils";

type UserStatCardProps = {
  stat: UserStat;
};

function UserStatCard({ stat }: UserStatCardProps) {
  const Icon = USER_STAT_ICONS[stat.icon];
  const isDanger = stat.variant === "danger";

  return (
    <article
      className={cn(
        "rounded-2xl border p-5 shadow-sm",
        isDanger ? "border-red-100 bg-red-50/40" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            isDanger ? "bg-red-100 text-red-600" : "bg-indigo-50 text-primary",
          )}
        >
          <Icon className="text-lg" />
        </div>

        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
            USER_META_STYLES[stat.metaVariant],
          )}
        >
          {stat.meta}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-muted">{stat.label}</p>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight lg:text-3xl", isDanger ? "text-red-700" : "text-foreground")}>
        {stat.value}
      </p>
    </article>
  );
}

export default React.memo(UserStatCard);
