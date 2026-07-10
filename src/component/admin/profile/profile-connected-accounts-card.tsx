import { GithubOutlined, GoogleOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import React, { useState } from "react";
import { unlinkGitHub, unlinkGoogle } from "../../../api-services/auth.service";
import { useAppContext } from "../../../context/app-context";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { saveStoredUser } from "../../../lib/auth-session";
import type { AuthUser } from "../../../types/auth.types";
import { Label, Paragraph, Title } from "../../ui/typography";

type ProfileConnectedAccountsCardProps = {
  user: AuthUser;
};

function ProfileConnectedAccountsCard({ user }: ProfileConnectedAccountsCardProps) {
  const app = useAppContext();
  const [unlinking, setUnlinking] = useState<"github" | "google" | null>(null);

  const applyUser = (next: AuthUser, message: string) => {
    saveStoredUser(next);
    app?.setUser(next);
    showApiSuccessToast(message);
  };

  const confirmUnlink = (provider: "github" | "google") => {
    const label = provider === "github" ? "GitHub" : "Google";
    Modal.confirm({
      title: `Disconnect ${label}?`,
      content:
        provider === "github"
          ? "After disconnecting GitHub, you can sign in with Google (same email) or email/password. You will stay logged in for now."
          : "After disconnecting Google, you can sign in with GitHub (same email) or email/password. You will stay logged in for now.",
      okText: `Disconnect ${label}`,
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        setUnlinking(provider);
        try {
          const next =
            provider === "github" ? await unlinkGitHub() : await unlinkGoogle();
          applyUser(next, `${label} disconnected.`);
        } catch (error) {
          showApiErrorToast(error);
          throw error;
        } finally {
          setUnlinking(null);
        }
      },
    });
  };

  const githubConnected = Boolean(user.githubConnected);
  const googleConnected = Boolean(user.googleConnected);
  const primary =
    user.authProvider === "github"
      ? "GitHub"
      : user.authProvider === "google"
        ? "Google"
        : "Email";

  return (
    <article className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Title level={4} color="default">
            Connected accounts
          </Title>
          <Paragraph size="sm" className="mt-1 mb-0!">
            Primary sign-in method: <strong>{primary}</strong>. Disconnect a provider before switching to the other.
          </Paragraph>
        </div>
        <Tag icon={<LinkOutlined />} className="rounded-full!">
          OAuth
        </Tag>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <div className="min-w-0">
            <Label className="flex items-center gap-2">
              <GithubOutlined />
              GitHub
            </Label>
            <Paragraph size="sm" className="mb-0! mt-1 text-muted">
              {githubConnected
                ? user.githubLogin
                  ? `Connected as @${user.githubLogin}`
                  : "Connected"
                : "Not connected"}
            </Paragraph>
          </div>
          {githubConnected ? (
            <Button
              danger
              loading={unlinking === "github"}
              onClick={() => confirmUnlink("github")}
            >
              Disconnect
            </Button>
          ) : (
            <Tag>Not linked</Tag>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <div className="min-w-0">
            <Label className="flex items-center gap-2">
              <GoogleOutlined />
              Google
            </Label>
            <Paragraph size="sm" className="mb-0! mt-1 text-muted">
              {googleConnected ? "Connected" : "Not connected"}
            </Paragraph>
          </div>
          {googleConnected ? (
            <Button
              danger
              loading={unlinking === "google"}
              onClick={() => confirmUnlink("google")}
            >
              Disconnect
            </Button>
          ) : (
            <Tag>Not linked</Tag>
          )}
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProfileConnectedAccountsCard);
