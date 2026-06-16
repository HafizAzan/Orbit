import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import {
  WORKSPACE_MEMBER_PREVIEWS,
  WORKSPACE_SEAT_USAGE,
} from "../../../data/workspace-settings";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import SettingsSection from "../../admin/settings/settings-section";

type WorkspaceMembersSectionProps = {
  expanded?: boolean;
};

function WorkspaceMembersSection({ expanded = false }: WorkspaceMembersSectionProps) {
  const remainingCount = WORKSPACE_SEAT_USAGE.occupied - WORKSPACE_MEMBER_PREVIEWS.length;

  return (
    <SettingsSection
      id="workspace-members"
      title="Team Members"
      description="Manage seat allocation and workspace access for your organization."
      action={
        <Link to={WORKSPACE_ROUTES.TEAMS}>
          <Button type="default" className="font-semibold!">
            Manage Members
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {WORKSPACE_SEAT_USAGE.occupied}{" "}
            <span className="text-base font-medium text-muted">seats occupied out of {WORKSPACE_SEAT_USAGE.total}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {WORKSPACE_SEAT_USAGE.total - WORKSPACE_SEAT_USAGE.occupied} seats available for new members.
          </p>
        </div>

        <div className="flex items-center">
          {WORKSPACE_MEMBER_PREVIEWS.map((member, index) => (
            <div
              key={member.id}
              title={member.name}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-card text-sm font-bold",
                member.avatarColor,
                index > 0 && "-ml-2",
              )}
            >
              {getInitial(member.name)}
            </div>
          ))}
          {remainingCount > 0 ? (
            <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-slate-100 text-xs font-semibold text-muted">
              +{remainingCount}
            </div>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4">
          <p className="text-sm text-muted">
            Invite managers, assign roles, and monitor activity from the dedicated team management page.
          </p>
          <Link
            to={WORKSPACE_ROUTES.TEAMS}
            className="mt-3 inline-flex text-sm font-semibold text-primary transition-opacity hover:opacity-80"
          >
            Open Team Management →
          </Link>
        </div>
      ) : null}
    </SettingsSection>
  );
}

export default React.memo(WorkspaceMembersSection);
