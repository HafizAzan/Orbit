import {
  BankOutlined,
  CrownOutlined,
  MailOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React from "react";
import type { OrganizationAbout, OrganizationAboutPerson } from "../../../types/organization.types";
import type { RegisterAs } from "../../../types/auth.types";
import { useOrganizationAbout } from "../../../hooks/use-workspace-organization";
import { formatDate } from "../../../lib/helper";
import { getWorkspaceRoleLabel } from "../../../lib/workspace-routing";
import QueryErrorState from "../../common/query-error-state";
import RecordDetailField from "../../admin/shared/record-detail-field";

type WorkspaceAboutOrganizationCardProps = {
  role: RegisterAs;
};

function PersonRow({ person }: { person: OrganizationAboutPerson }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-foreground">{person.fullName}</p>
        <p className="text-sm text-muted">{getWorkspaceRoleLabel(person.role)}</p>
      </div>
      <a
        href={`mailto:${person.email}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80"
      >
        <MailOutlined />
        {person.email}
      </a>
    </div>
  );
}

function PeopleSection({
  title,
  description,
  count,
  people,
  emptyMessage,
}: {
  title: string;
  description: string;
  count: number;
  people: OrganizationAboutPerson[];
  emptyMessage: string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted">
          Total: <span className="font-semibold text-foreground">{count}</span>
        </p>
      </div>

      {people.length > 0 ? (
        <div className="space-y-3">
          {people.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

function WorkspaceAboutOrganizationCard({ role }: WorkspaceAboutOrganizationCardProps) {
  const aboutQuery = useOrganizationAbout(role === "manager" || role === "member");
  const about: OrganizationAbout | undefined = aboutQuery.data;

  if (aboutQuery.isPending) {
    return (
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-background" />
          <div className="h-24 rounded-xl bg-background" />
          <div className="h-24 rounded-xl bg-background" />
        </div>
      </article>
    );
  }

  if (aboutQuery.isError || !about) {
    return (
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <QueryErrorState
          error={aboutQuery.error}
          title="Unable to load organization details"
          onRetry={() => {
            void aboutQuery.refetch();
          }}
          isRetrying={aboutQuery.isFetching}
        />
      </article>
    );
  }

  const managerTitle = role === "member" ? "Your managers" : "Your manager profile";
  const managerDescription =
    role === "member"
      ? "Managers who lead the projects you are assigned to."
      : "Your own manager profile in this organization.";
  const managerEmptyMessage =
    role === "member"
      ? "No project managers are linked to your assignments yet."
      : "Your manager profile could not be loaded.";

  return (
    <div className="space-y-6">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-feature-sync text-primary">
            <BankOutlined className="text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">About Organization</h2>
            <p className="mt-1 text-sm text-muted">
              Key details about your workspace leadership and structure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <RecordDetailField label="Organization name" value={about.organization.name} />
          <RecordDetailField label="Organization slug" value={about.organization.slug} />
          <RecordDetailField
            label="Founded on"
            value={formatDate(about.organization.createdAt, { month: "long" })}
          />
          <RecordDetailField label="Organization ID" value={about.organization.id} />
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <CrownOutlined className="text-lg text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Organization owner</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <RecordDetailField label="Full name" value={about.owner.fullName} />
          <RecordDetailField label="Email" value={about.owner.email} />
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <PeopleSection
          title="Workspace admins"
          description="Admins who help manage this organization."
          count={about.admins.count}
          people={about.admins.data}
          emptyMessage="No active admins are listed for this organization."
        />
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <PeopleSection
          title={managerTitle}
          description={managerDescription}
          count={about.managers.count}
          people={about.managers.data}
          emptyMessage={managerEmptyMessage}
        />
      </article>

      <div className="rounded-xl border border-border bg-background px-4 py-3 text-xs text-muted">
        <TeamOutlined className="mr-2" />
        Member directory access is limited. This view does not list all workspace members.
      </div>
    </div>
  );
}

export default React.memo(WorkspaceAboutOrganizationCard);
