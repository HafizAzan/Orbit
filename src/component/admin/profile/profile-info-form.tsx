import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import React from "react";
import { PLATFORM_ADMIN_ROLE_LABEL, type AdminProfile } from "../../../data/admin-profile";
import { toast } from "../../../lib/toast";
import { Label } from "../../ui/typography";

type ProfileInfoFormProps = {
  profile: AdminProfile;
  onChange: <K extends keyof AdminProfile>(key: K, value: AdminProfile[K]) => void;
};

function ProfileInfoForm({ profile, onChange }: ProfileInfoFormProps) {
  return (
    <article className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Personal Details</h2>
        <p className="mt-1 text-sm text-muted">Update how your name appears across the admin console.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-4">
        <Avatar size={72} className="bg-primary/10! text-primary! font-semibold!" src={profile.avatarUrl} />
        <div>
          <Button icon={<CameraOutlined />} onClick={() => toast.info("Avatar upload coming soon")} className="font-medium!">
            Change Photo
          </Button>
          <p className="mt-2 text-xs text-muted">JPG, PNG or GIF. Max 2MB.</p>
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
          <Input size="large" value={PLATFORM_ADMIN_ROLE_LABEL} readOnly disabled className="rounded-xl! bg-background! [&_input]:text-muted!" />
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProfileInfoForm);
