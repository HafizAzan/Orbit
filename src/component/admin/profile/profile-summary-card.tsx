import { MailOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tag } from "antd";
import React from "react";
import { maskEmail } from "../../../lib/helper";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProfileSummaryProfile = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

type ProfileSummaryCardProps = {
  profile: ProfileSummaryProfile;
  displayName: string;
  roleLabel: string;
  accountBadge: string;
};

function ProfileSummaryCard({ profile, displayName, roleLabel, accountBadge }: ProfileSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-linear-to-r from-card to-feature-sync/40 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar size={72} className="border-2 border-card bg-primary/10! text-primary! shadow-sm" src={profile.avatarUrl} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Title level={4} color="default" className="font-bold">{displayName}</Title>
              <Tag color="processing" className="rounded-full! border-0! px-2.5! py-0.5! text-[10px]! font-semibold! uppercase">
                {roleLabel}
              </Tag>
            </div>
            <Paragraph size="sm" className="mt-1 mb-0! flex items-center gap-2">
              <MailOutlined />
              {maskEmail(profile.email)}
            </Paragraph>
            {profile.emailVerified ? (
              <Tag icon={<SafetyCertificateOutlined />} color="success" className="mt-2 rounded-full!">
                Verified account
              </Tag>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 text-sm text-muted">
          <UserOutlined className="text-lg text-primary" />
          <Text size="sm" color="muted">{accountBadge}</Text>
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProfileSummaryCard);
