import { UserAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import InviteMemberModal from "../../component/workspace/teams/invite-member-modal";
import TeamSummaryCards from "../../component/workspace/teams/team-summary-cards";
import TeamsTable from "../../component/workspace/teams/teams-table";
import WorkspaceRoleGate from "../../component/workspace/workspace-role-gate";
import useWorkspacePermissions from "../../hooks/use-workspace-permissions";
import { TEAM_MEMBERS, type TeamMember } from "../../data/workspace-teams";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceTeamsContent() {
  const { can } = useWorkspacePermissions();
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const canInvite = can("team.invite");

  const openInviteModal = useCallback(() => {
    setInviteModalOpen(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    setInviteModalOpen(false);
  }, []);

  const handleMemberInvited = useCallback((member: TeamMember) => {
    setMembers((current) => [member, ...current]);
  }, []);

  const inviteButton = useMemo(
    () =>
      canInvite ? (
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          className="font-semibold!"
          onClick={openInviteModal}
        >
          Invite Member
        </Button>
      ) : null,
    [canInvite, openInviteModal],
  );

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            Team Management
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Manage your workspace members, assign roles, and monitor team activity.
          </Paragraph>
        </div>

        {inviteButton}
      </div>

      <TeamsTable data={members} emptyAction={inviteButton} />

      <TeamSummaryCards />

      {canInvite ? (
        <InviteMemberModal
          open={inviteModalOpen}
          onClose={closeInviteModal}
          members={members}
          onInvited={handleMemberInvited}
        />
      ) : null}
    </div>
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
