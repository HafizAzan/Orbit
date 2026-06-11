import React from "react";
import ProfileInfoForm from "../../component/admin/profile/profile-info-form";
import ProfilePasswordForm from "../../component/admin/profile/profile-password-form";
import ProfileSaveBar from "../../component/admin/profile/profile-save-bar";
import { Paragraph, Title } from "../../component/ui/typography";
import useAdminProfile from "../../hooks/use-admin-profile";

function AdminProfile() {
  const {
    profile,
    profileChangeCount,
    savingProfile,
    changingPassword,
    resettingPassword,
    handleProfileFieldChange,
    handleDiscardProfile,
    handleSaveProfile,
    handleChangePassword,
    handleSendPasswordResetLink,
  } = useAdminProfile();

  return (
    <div className="mx-auto max-w-8xl">
      <div className="mb-6">
        <p className="text-xs font-medium text-muted">Account · Platform Admin</p>
        <Title level={2} className="mt-1 text-2xl text-foreground lg:text-3xl">
          My Profile
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage your personal information and account security.
        </Paragraph>
      </div>

      <div className="space-y-6">
        <ProfileInfoForm profile={profile} onChange={handleProfileFieldChange} />

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
