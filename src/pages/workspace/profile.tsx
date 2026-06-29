import React, { useMemo, useState } from "react";
import ProfileEmailSecurityCard from "../../component/admin/profile/profile-email-security-card";
import ProfileInfoForm from "../../component/admin/profile/profile-info-form";
import ProfilePasswordForm from "../../component/admin/profile/profile-password-form";
import ProfileSaveBar from "../../component/admin/profile/profile-save-bar";
import ProfileSummaryCard from "../../component/admin/profile/profile-summary-card";
import WorkspaceOrganizationCard from "../../component/workspace/profile/workspace-organization-card";
import WorkspaceAboutOrganizationCard from "../../component/workspace/profile/workspace-about-organization-card";
import WorkspaceProfileActivityLogsCard from "../../component/workspace/profile/workspace-profile-activity-logs-card";
import WorkspaceProfileTabs from "../../component/workspace/profile/workspace-profile-tabs";
import { getWorkspaceProfileDisplayName, type WorkspaceProfileTab } from "../../data/workspace-profile";
import useWorkspaceProfile from "../../hooks/use-workspace-profile";
import { canChangeOwnEmail, canRequestOwnEmailChange } from "../../lib/email-access";
import { getWorkspaceRoleLabel } from "../../lib/workspace-routing";
import { Paragraph, Title } from "../../component/ui/typography";

function WorkspaceProfile() {
  const {
    profile,
    profileChangeCount,
    savingProfile,
    changingPassword,
    changingEmail,
    resettingPassword,
    handleProfileFieldChange,
    handleDiscardProfile,
    handleSaveProfile,
    handleChangePassword,
    handleInitiateEmailChange,
    handleCompleteEmailChange,
    handleSendPasswordResetLink,
  } = useWorkspaceProfile();

  const [activeTab, setActiveTab] = useState<WorkspaceProfileTab>("personal");
  const roleLabel = getWorkspaceRoleLabel(profile.role);
  const displayName = getWorkspaceProfileDisplayName(profile);
  const canChangeOwnLoginEmail = canChangeOwnEmail(profile.role);
  const canRequestOwnLoginEmailChange = canRequestOwnEmailChange(profile.role);

  const profileInfo = useMemo(
    () => ({
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
    }),
    [profile.avatarUrl, profile.firstName, profile.lastName],
  );

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <p className="text-xs font-medium text-muted">Account · {profile.organizationName}</p>
        <Title level={2} className="mt-1 text-2xl text-foreground lg:text-3xl">
          My Profile
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage your personal information, security, and organization account details.
        </Paragraph>
      </div>

      <WorkspaceProfileTabs activeTab={activeTab} role={profile.role} onChange={setActiveTab} />

      {activeTab === "personal" ? (
        <div className="space-y-6">
          <ProfileSummaryCard
            profile={profile}
            displayName={displayName}
            roleLabel={roleLabel}
            accountBadge={`${profile.organizationName} workspace account`}
          />

          <ProfileInfoForm
            profile={profileInfo}
            roleLabel={roleLabel}
            organizationName={profile.organizationName}
            title="Personal Details"
            description="Update how your name appears across the workspace."
            onChange={(key, value) => handleProfileFieldChange(key, value)}
          />
        </div>
      ) : null}

      {activeTab === "security" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ProfileEmailSecurityCard
            profile={profile}
            role={profile.role}
            canChangeEmail={canChangeOwnLoginEmail}
            canRequestEmailChange={canRequestOwnLoginEmailChange}
            changingEmail={changingEmail}
            onInitiateEmailChange={handleInitiateEmailChange}
            onCompleteEmailChange={handleCompleteEmailChange}
          />

          <ProfilePasswordForm
            email={profile.email}
            loading={changingPassword}
            resettingPassword={resettingPassword}
            onSubmit={handleChangePassword}
            onSendResetLink={async () => handleSendPasswordResetLink()}
          />
        </div>
      ) : null}

      {activeTab === "organization" ? <WorkspaceOrganizationCard profile={profile} /> : null}

      {activeTab === "about-organization" ? <WorkspaceAboutOrganizationCard role={profile.role} /> : null}

      {activeTab === "activity-logs" ? <WorkspaceProfileActivityLogsCard /> : null}

      {activeTab === "personal" ? (
        <ProfileSaveBar
          changeCount={profileChangeCount}
          saving={savingProfile}
          onDiscard={handleDiscardProfile}
          onSave={handleSaveProfile}
        />
      ) : null}
    </div>
  );
}

export default React.memo(WorkspaceProfile);
