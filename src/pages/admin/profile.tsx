import React from "react";
import PageSeo from "../../component/seo/page-seo";
import ProfileInfoForm from "../../component/admin/profile/profile-info-form";
import ProfilePasswordForm from "../../component/admin/profile/profile-password-form";
import ProfileSaveBar from "../../component/admin/profile/profile-save-bar";
import { Paragraph, Text, Title } from "../../component/ui/typography";
import useAdminProfile from "../../hooks/use-admin-profile";

function AdminProfile() {
  const {
    profile,
    profileChangeCount,
    savingProfile,
    changingPassword,
    resettingPassword,
    handleProfileFieldChange,
    handleAvatarUploaded,
    handleDiscardProfile,
    handleSaveProfile,
    handleChangePassword,
    handleSendPasswordResetLink,
  } = useAdminProfile();

  return (
    <div className="mx-auto max-w-8xl">
      <PageSeo title="Admin Profile" description="Manage your admin account profile and security settings." noIndex />
      <div className="mb-6">
        <Text as="p" size="xs" color="muted" weight="medium">Account · Platform Admin</Text>
        <Title level={2} className="mt-1 text-2xl text-foreground lg:text-3xl">
          My Profile
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage your personal information and account security.
        </Paragraph>
      </div>

      <div className="space-y-6">
        <ProfileInfoForm
          profile={profile}
          onChange={handleProfileFieldChange}
          onAvatarUploaded={handleAvatarUploaded}
        />

        <ProfilePasswordForm
          email={profile.email}
          loading={changingPassword}
          resettingPassword={resettingPassword}
          onSubmit={handleChangePassword}
          onSendResetLink={async () => handleSendPasswordResetLink()}
        />
      </div>

      <ProfileSaveBar
        changeCount={profileChangeCount}
        saving={savingProfile}
        onDiscard={handleDiscardProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

export default React.memo(AdminProfile);
