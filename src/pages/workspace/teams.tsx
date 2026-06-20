import { UserAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import InviteMemberModal from "../../component/workspace/teams/invite-member-modal";
import TeamSummaryCards from "../../component/workspace/teams/team-summary-cards";
import TeamsTable from "../../component/workspace/teams/teams-table";
import QueryPageGuard from "../../component/common/query-page-guard";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import { AdminListPageSkeleton } from "../../component/skeletons";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { useTeamMembers } from "../../hooks/use-workspace-team";
import { mapApiTeamMemberToTeamMember } from "../../types/team.types";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceTeamsContent() {
  const { can } = useWorkspacePermissions();
  const teamQuery = useTeamMembers();
  const { data: members = [] } = teamQuery;
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const canInvite = can("team.invite");

  const teamMembers = useMemo(() => members.map(mapApiTeamMemberToTeamMember), [members]);

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
      loading={<AdminListPageSkeleton tableColumns={7} />}
      errorTitle="Unable to load team"
    >
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Title level={2} className="text-2xl text-foreground lg:text-3xl">
              Team Management
            </Title>
            <Paragraph size="sm" className="mt-1 text-muted">
              View your project squad. Managers only see people from their own projects.
            </Paragraph>
          </div>

          {inviteButton}
        </div>

        <TeamsTable data={teamMembers} emptyAction={inviteButton} />

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
