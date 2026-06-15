import React from "react";
import { Link } from "react-router-dom";
import type { WorkspaceProfile } from "../../../data/workspace-profile";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import { getWorkspaceRoleLabel } from "../../../lib/workspace-routing";
import { cn } from "../../../lib/utils";
import RecordDetailField from "../../admin/shared/record-detail-field";

type WorkspaceOrganizationCardProps = {
  profile: WorkspaceProfile;
};

const ACCOUNT_STATUS_LABELS: Record<WorkspaceProfile["accountStatus"], string> = {
  active: "Active",
  pending: "Pending verification",
  suspended: "Suspended",
};

function WorkspaceOrganizationCard({ profile }: WorkspaceOrganizationCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Organization Details</h2>
        <p className="mt-1 text-sm text-muted">
          Workspace and account information for owners and admins.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RecordDetailField label="Organization name" value={profile.organizationName} />
        <RecordDetailField label="Organization ID" value={profile.organizationId ?? "—"} />
        <RecordDetailField label="Your role" value={getWorkspaceRoleLabel(profile.role)} />
        <RecordDetailField label="Account status" value={ACCOUNT_STATUS_LABELS[profile.accountStatus]} />
        <RecordDetailField label="Email verification" value={profile.emailVerified ? "Verified" : "Pending"} />
        <RecordDetailField label="Login email" value={profile.email} />
      </div>

      {(profile.role === "owner" || profile.role === "admin") && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-feature-sync/40 p-4">
          <p className="text-sm text-muted">
            Manage billing, members, and workspace policies from organization settings.
          </p>
          <Link
            to={WORKSPACE_ROUTES.SETTINGS}
            className={cn(
              "mt-3 inline-flex text-sm font-semibold text-primary transition-opacity hover:opacity-80",
            )}
          >
            Open workspace settings →
          </Link>
        </div>
      )}
    </article>
  );
}

export default React.memo(WorkspaceOrganizationCard);
