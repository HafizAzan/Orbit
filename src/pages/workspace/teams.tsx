import { UserAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import InviteMemberModal from "../../component/workspace/teams/invite-member-modal";
import TeamSummaryCards from "../../component/workspace/teams/team-summary-cards";
import TeamsTable from "../../component/workspace/teams/teams-table";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { TeamsPageSkeleton } from "../../component/skeletons";
import { useAppContext } from "../../context/app-context";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useTeamMembers } from "../../hooks/use-workspace-team";
import { TEAM_MEMBERS_PAGE_SIZE } from "../../data/workspace-teams";
import { mapApiTeamMemberToTeamMember } from "../../types/team.types";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceTeamsContent() {
  const app = useAppContext();
  const role = app?.user?.role;
  const { can } = useWorkspacePermissions();
  const [page, setPage] = useState(1);
  const teamQuery = useTeamMembers({ page, limit: TEAM_MEMBERS_PAGE_SIZE });
  const membersPage = teamQuery.data;
  const members = membersPage?.data ?? [];
  const totalMembers = membersPage?.total ?? 0;
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const canInvite = can("team.invite");
  const teamsDescription =
    role === "manager"
      ? "Manage your delivery squad. Remove members from projects you lead when assignments change."
      : "Invite teammates, manage roles, and monitor workspace activity.";

  const teamMembers = useMemo(() => members.map(mapApiTeamMemberToTeamMember), [members]);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openInviteModal = useCallback(() => {
    setInviteModalOpen(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    setInviteModalOpen(false);
  }, []);

  const inviteButton = useMemo(
    () =>
      canInvite ? (
        <Button type="primary" icon={<UserAddOutlined />} size="large" className="font-semibold!" onClick={openInviteModal}>
          Invite Member
        </Button>
      ) : null,
    [canInvite, openInviteModal],
  );

  return (
    <QueryPageGuard
      query={teamQuery}
      loading={<TeamsPageSkeleton />}
      errorTitle="Unable to load team"
    >
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Title level={2} className="text-2xl text-foreground lg:text-3xl">
              Team Management
            </Title>
            <Paragraph size="sm" className="mt-1 text-muted">
              {teamsDescription}
            </Paragraph>
          </div>

          {inviteButton}
        </div>

        <TeamsTable
          data={teamMembers}
          emptyAction={inviteButton}
          serverPagination={{
            page: membersPage?.page ?? page,
            pageSize: membersPage?.limit ?? TEAM_MEMBERS_PAGE_SIZE,
            total: totalMembers,
            onChange: handlePageChange,
          }}
        />

        <TeamSummaryCards />

        {canInvite ? (
          <InviteMemberModal open={inviteModalOpen} onClose={closeInviteModal} />
        ) : null}
      </div>
    </QueryPageGuard>
  );
}

function WorkspaceTeams() {
  return (
    <WorkspaceRoleGate
      permission="team.view"
      title="Team access restricted"
      description="Members cannot access team management. Contact your workspace admin if you need access."
    >
      <WorkspaceTeamsContent />
    </WorkspaceRoleGate>
  );
}

export default React.memo(WorkspaceTeams);
