import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Input, Tag } from "antd";
import React, { useState } from "react";
import { PROFILE_EMAIL_SECURITY_NOTE } from "../../../data/admin-profile";
import { maskEmail } from "../../../lib/helper";
import { Label } from "../../ui/typography";
import ProfileEmailChangeModal from "./profile-email-change-modal";

type ProfileEmailSecurityProfile = {
  email: string;
  emailVerified: boolean;
};

type ProfileEmailSecurityCardProps = {
  profile: ProfileEmailSecurityProfile;
  changingEmail?: boolean;
  onInitiateEmailChange: (newEmail: string, currentPassword: string) => Promise<boolean>;
  onCompleteEmailChange: (newEmail: string, otp: string) => Promise<boolean>;
};

function ProfileEmailSecurityCard({
  profile,
  changingEmail = false,
  onInitiateEmailChange,
  onCompleteEmailChange,
}: ProfileEmailSecurityCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Email Security</h2>
            <p className="mt-1 text-sm text-muted">{PROFILE_EMAIL_SECURITY_NOTE}</p>
          </div>
          {profile.emailVerified ? (
            <Tag icon={<SafetyCertificateOutlined />} color="success" className="rounded-full!">
              Verified
            </Tag>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4">
          <div className="space-y-2">
            <Label>Login email</Label>
            <Input
              size="large"
              value={maskEmail(profile.email)}
              readOnly
              disabled
              prefix={<LockOutlined className="text-muted" />}
              className="rounded-xl! bg-background! [&_input]:text-muted!"
            />
          </div>

          <Button
            type="default"
            icon={<MailOutlined />}
            onClick={() => setModalOpen(true)}
            className="mt-auto w-fit font-medium!"
          >
            Change email
          </Button>
        </div>
      </article>

      <ProfileEmailChangeModal
        open={modalOpen}
        profile={profile}
        loading={changingEmail}
        onClose={() => setModalOpen(false)}
        onInitiate={onInitiateEmailChange}
        onComplete={onCompleteEmailChange}
      />
    </>
  );
}

export default React.memo(ProfileEmailSecurityCard);
