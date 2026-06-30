import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import React from "react";
import { PLATFORM_ADMIN_ROLE_LABEL, type AdminProfile } from "../../../data/admin-profile";
import { toast } from "../../../lib/toast";
import { Label, Paragraph, Title } from "../../ui/typography";

type ProfileInfoFormProfile = Pick<AdminProfile, "firstName" | "lastName" | "avatarUrl">;

type ProfileInfoFormProps = {
  profile: ProfileInfoFormProfile;
  onChange: (key: keyof ProfileInfoFormProfile, value: string) => void;
  roleLabel?: string;
  organizationName?: string;
  title?: string;
  description?: string;
};

function ProfileInfoForm({
  profile,
  onChange,
  roleLabel = PLATFORM_ADMIN_ROLE_LABEL,
  organizationName,
  title = "Personal Details",
  description = "Update how your name appears across the admin console.",
}: ProfileInfoFormProps) {
  return (
    <article className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <Title level={4} color="default">{title}</Title>
        <Paragraph size="sm" className="mt-1 mb-0!">{description}</Paragraph>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-4">
        <Avatar size={72} className="bg-primary/10! text-primary! font-semibold!" src={profile.avatarUrl} />
        <div>
          <Button icon={<CameraOutlined />} onClick={() => toast.info("Avatar upload coming soon")} className="font-medium!">
            Change Photo
          </Button>
          <Paragraph size="xs" className="mt-2 mb-0!">JPG, PNG or GIF. Max 2MB.</Paragraph>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>First name</Label>
          <Input
            size="large"
            value={profile.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            autoComplete="given-name"
            className="rounded-xl! bg-background!"
          />
        </div>

        <div className="space-y-2">
          <Label>Last name</Label>
          <Input
            size="large"
            value={profile.lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
            autoComplete="family-name"
            className="rounded-xl! bg-background!"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Role</Label>
          <Input size="large" value={roleLabel} readOnly disabled className="rounded-xl! bg-background! [&_input]:text-muted!" />
        </div>

        {organizationName ? (
          <div className="space-y-2 md:col-span-2">
            <Label>Organization</Label>
            <Input
              size="large"
              value={organizationName}
              readOnly
              disabled
              className="rounded-xl! bg-background! [&_input]:text-muted!"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default React.memo(ProfileInfoForm);
