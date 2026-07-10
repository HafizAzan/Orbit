import {
  CheckOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import React, { useMemo } from "react";
import { TEAM_ROLE_PERMISSIONS, type TeamInviteRole } from "../../data/workspace-teams";
import { getInitial } from "../../lib/helper";
import { cn } from "../../lib/utils";
import type { InviteValidationResponse } from "../../types/auth.types";
import AnimateOnScroll from "../common/animate-on-scroll";
import { Paragraph, Text, Title } from "../ui/typography";

type AcceptInvitePreviewProps = {
  invite: InviteValidationResponse;
};

function getInviteRoleKey(role: InviteValidationResponse["role"]): TeamInviteRole {
  if (role === "admin" || role === "manager" || role === "member") {
    return role;
  }

  return "member";
}

function AcceptInvitePreview({ invite }: AcceptInvitePreviewProps) {
  const roleKey = getInviteRoleKey(invite.role);
  const roleInfo = TEAM_ROLE_PERMISSIONS[roleKey];

  const expiresLabel = useMemo(() => {
    const expiresAt = new Date(invite.expiresAt);
    return expiresAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [invite.expiresAt]);

  return (
    <aside className="relative hidden overflow-hidden bg-login-panel px-8 py-10 lg:flex lg:flex-col lg:justify-center xl:px-12">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <AnimateOnScroll immediate variant="fade-right" delay={150} className="relative mx-auto w-full max-w-xl space-y-5">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
          <div className="bg-linear-to-br from-primary/10 via-feature-sync to-sky-50 px-6 py-5">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card text-xl font-bold text-primary shadow-sm">
                {getInitial(invite.organizationName)}
              </span>
              <div className="min-w-0">
                <Text as="p" size="xs" weight="semibold" className="tracking-wide text-primary uppercase">
                  Workspace invitation
                </Text>
                <Title level={4} className="mt-1 mb-0! truncate text-foreground">
                  {invite.organizationName}
                </Title>
                <Text as="p" size="sm" color="muted" className="mt-1 truncate">
                  Orbit.io/workspace/{invite.organizationSlug}
                </Text>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wide",
                  roleInfo.accent,
                )}
              >
                <CrownOutlined className="text-[10px]" />
                {invite.roleLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted">
                <TeamOutlined className="text-[10px]" />
                {invite.departmentLabel}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <Text as="p" size="sm" weight="semibold" className="text-foreground">
                {roleInfo.title} access includes
              </Text>
              <ul className="mt-3 space-y-2.5">
                {roleInfo.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-muted">
                    <CheckOutlined className="mt-0.5 shrink-0 text-xs text-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-background/70 p-3.5">
                <Text as="p" size="xs" color="muted">
                  Invited by
                </Text>
                <Text as="p" size="sm" weight="semibold" className="mt-1 text-foreground">
                  {invite.inviterName}
                </Text>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-3.5">
                <Text as="p" size="xs" color="muted">
                  Valid until
                </Text>
                <Text as="p" size="sm" weight="semibold" className="mt-1 text-foreground">
                  {expiresLabel}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/15 bg-feature-sync/70 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
              <SafetyCertificateOutlined />
            </span>
            <div>
              <Text as="p" size="sm" weight="semibold" className="text-foreground">
                Secure workspace onboarding
              </Text>
              <Paragraph size="sm" className="mt-1 mb-0! text-muted">
                Set your password once to activate your account and start collaborating with your team immediately.
              </Paragraph>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserAddOutlined />
          </span>
          <Text as="p" size="sm" color="muted">
            Trusted by product, engineering, and operations teams worldwide.
          </Text>
        </div>
      </AnimateOnScroll>
    </aside>
  );
}

export default React.memo(AcceptInvitePreview);
