import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Upload, type UploadProps } from "antd";
import React, { useState } from "react";
import { uploadAvatar } from "../../../api-services/auth.service";
import { PLATFORM_ADMIN_ROLE_LABEL, type AdminProfile } from "../../../data/admin-profile";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { resolveTaskAttachmentUrl } from "../../../lib/task-attachments";
import type { AuthUser } from "../../../types/auth.types";
import { Label, Paragraph, Title } from "../../ui/typography";

type ProfileInfoFormProfile = Pick<AdminProfile, "firstName" | "lastName" | "avatarUrl">;

type ProfileInfoFormProps = {
  profile: ProfileInfoFormProfile;
  onChange: (key: keyof ProfileInfoFormProfile, value: string) => void;
  roleLabel?: string;
  organizationName?: string;
  title?: string;
  description?: string;
  onAvatarUploaded?: (user: AuthUser) => void;
};

function ProfileInfoForm({
  profile,
  onChange,
  roleLabel = PLATFORM_ADMIN_ROLE_LABEL,
  organizationName,
  title = "Personal Details",
  description = "Update how your name appears across the admin console.",
  onAvatarUploaded,
}: ProfileInfoFormProps) {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload: UploadProps["customRequest"] = async (options) => {
    const file = options.file as File;
    setUploading(true);
    try {
      const user = await uploadAvatar(file);
      const nextUrl = user.avatarUrl
        ? resolveTaskAttachmentUrl(user.avatarUrl)
        : profile.avatarUrl;
      onChange("avatarUrl", nextUrl);
      onAvatarUploaded?.(user);
      showApiSuccessToast("Profile photo updated.");
      options.onSuccess?.(user);
    } catch (error) {
      showApiErrorToast(error);
      options.onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <article className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <Title level={4} color="default">
          {title}
        </Title>
        <Paragraph size="sm" className="mt-1 mb-0!">
          {description}
        </Paragraph>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-4">
        <Avatar
          key={profile.avatarUrl || "avatar-empty"}
          size={72}
          className="bg-primary/10! text-primary! font-semibold!"
          src={profile.avatarUrl || undefined}
        />
        <div>
          <Upload accept="image/png,image/jpeg,image/gif,image/webp" showUploadList={false} customRequest={handleAvatarUpload}>
            <Button icon={<CameraOutlined />} loading={uploading} className="font-medium!">
              Change Photo
            </Button>
          </Upload>
          <Paragraph size="xs" className="mt-2 mb-0!">
            JPG, PNG, GIF or WEBP. Max 2MB.
          </Paragraph>
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
          <Input
            size="large"
            value={roleLabel}
            readOnly
            disabled
            className="rounded-xl! bg-background! [&_input]:text-muted!"
          />
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
