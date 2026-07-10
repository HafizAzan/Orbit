import {
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DisconnectOutlined,
  GithubOutlined,
  LinkOutlined,
  PullRequestOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input, Skeleton, Tag, Tooltip, message } from "antd";
import React, { useState } from "react";
import type { ApiWorkspaceProject } from "../../../types/project.types";
import type { GithubCheck, GithubCommit, GithubPullRequest, LinkProjectGithubResponse } from "../../../api-services/project.service";
import { useLinkProjectGithub, useProjectGithubStatus } from "../../../hooks/use-project-github";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProjectGithubCardProps = {
  projectId: string;
  viewerRole: ApiWorkspaceProject["viewerRole"];
};

function copyToClipboard(value: string, label: string) {
  void navigator.clipboard.writeText(value).then(() => {
    void message.success(`${label} copied to clipboard`);
  });
}

function CommitList({ commits }: { commits: GithubCommit[] }) {
  if (commits.length === 0) {
    return (
      <Text size="sm" color="muted">
        No recent commits.
      </Text>
    );
  }

  return (
    <ul className="space-y-2">
      {commits.slice(0, 5).map((commit) => (
        <li key={commit.sha} className="flex items-start gap-2">
          <BranchesOutlined className="mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <a
              href={commit.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-medium text-primary hover:opacity-80"
            >
              {commit.message}
            </a>
            <Text size="xs" color="muted">
              {commit.author} · {new Date(commit.committedAt).toLocaleDateString()}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PrList({ pullRequests }: { pullRequests: GithubPullRequest[] }) {
  if (pullRequests.length === 0) {
    return (
      <Text size="sm" color="muted">
        No open pull requests.
      </Text>
    );
  }

  return (
    <ul className="space-y-2">
      {pullRequests.slice(0, 5).map((pr) => (
        <li key={pr.number} className="flex items-start gap-2">
          <PullRequestOutlined className="mt-0.5 shrink-0 text-purple-500" />
          <div className="min-w-0 flex-1">
            <a
              href={pr.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-medium text-primary hover:opacity-80"
            >
              #{pr.number} {pr.title}
            </a>
            <Text size="xs" color="muted">
              {pr.author} · {pr.state}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CheckList({ checks }: { checks: GithubCheck[] }) {
  if (checks.length === 0) {
    return (
      <Text size="sm" color="muted">
        No CI checks recorded.
      </Text>
    );
  }

  return (
    <ul className="space-y-2">
      {checks.slice(0, 5).map((check) => (
        <li key={check.name} className="flex items-center gap-2">
          {check.conclusion === "success" ? (
            <CheckCircleOutlined className="text-green-500" />
          ) : check.conclusion === "failure" ? (
            <CloseCircleOutlined className="text-red-500" />
          ) : (
            <SyncOutlined spin className="text-yellow-500" />
          )}
          <a
            href={check.url}
            target="_blank"
            rel="noreferrer"
            className="truncate text-sm font-medium text-primary hover:opacity-80"
          >
            {check.name}
          </a>
          <Tag className="ml-auto shrink-0 text-xs">{check.status}</Tag>
        </li>
      ))}
    </ul>
  );
}

type WebhookRevealProps = {
  data: LinkProjectGithubResponse;
};

function WebhookReveal({ data }: WebhookRevealProps) {
  return (
    <Alert
      type="success"
      className="mt-4"
      message="Repository linked"
      description={
        <div className="mt-2 space-y-3">
          <Paragraph size="sm" className="text-muted">
            Save the webhook secret now — it will not be shown again.
          </Paragraph>

          <div className="space-y-1">
            <Text size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
              Webhook URL
            </Text>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-slate-100 px-2 py-1 text-xs">{data.webhookUrl ?? "—"}</code>
              <Tooltip title="Copy">
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  disabled={!data.webhookUrl}
                  onClick={() => {
                    if (data.webhookUrl) copyToClipboard(data.webhookUrl, "Webhook URL");
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <div className="space-y-1">
            <Text size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
              Webhook Secret
            </Text>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-slate-100 px-2 py-1 text-xs">
                {data.githubWebhookSecret ?? "—"}
              </code>
              <Tooltip title="Copy">
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  disabled={!data.githubWebhookSecret}
                  onClick={() => {
                    if (data.githubWebhookSecret) {
                      copyToClipboard(data.githubWebhookSecret, "Webhook secret");
                    }
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      }
    />
  );
}

function canManageGithub(viewerRole: ApiWorkspaceProject["viewerRole"]): boolean {
  return viewerRole === "admin" || viewerRole === "org_admin";
}

function ProjectGithubCard({ projectId, viewerRole }: ProjectGithubCardProps) {
  const [form] = Form.useForm<{ repoFullName: string }>();
  const [linkResult, setLinkResult] = useState<LinkProjectGithubResponse | null>(null);
  const statusQuery = useProjectGithubStatus(projectId);
  const { mutateAsync: linkGithub, isPending: isLinking } = useLinkProjectGithub(projectId);
  const { mutateAsync: unlinkGithub, isPending: isUnlinking } = useLinkProjectGithub(projectId);
  const canManage = canManageGithub(viewerRole);

  const status = statusQuery.data;

  const handleLink = async (values: { repoFullName: string }) => {
    try {
      const result = await linkGithub({ repoFullName: values.repoFullName.trim() });
      setLinkResult(result);
      showApiSuccessToast(result.message);
      form.resetFields();
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const handleUnlink = async () => {
    try {
      await unlinkGithub({ unlink: true });
      setLinkResult(null);
      showApiSuccessToast("GitHub repository unlinked.");
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GithubOutlined className="text-lg" />
          <Title level={5} color="default">
            GitHub
          </Title>
        </div>

        {status?.linked && (
          <Tooltip title="Refresh status">
            <Button
              size="small"
              icon={<SyncOutlined spin={statusQuery.isFetching} />}
              onClick={() => { void statusQuery.refetch(); }}
            />
          </Tooltip>
        )}
      </div>

      {statusQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
      ) : (
        <div className="mt-4 space-y-5">
          {status?.linked ? (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3 py-2">
                <LinkOutlined className="shrink-0 text-primary" />
                <a
                  href={`https://github.com/${status.repoFullName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 truncate text-sm font-medium text-primary hover:opacity-80"
                >
                  {status.repoFullName}
                </a>
                {canManage && (
                  <Tooltip title="Unlink repository">
                    <Button
                      size="small"
                      danger
                      icon={<DisconnectOutlined />}
                      loading={isUnlinking}
                      onClick={() => { void handleUnlink(); }}
                    />
                  </Tooltip>
                )}
              </div>

              {status.warning && (
                <Alert type="warning" message={status.warning} showIcon />
              )}

              {linkResult && <WebhookReveal data={linkResult} />}

              <div className="space-y-2">
                <Text size="sm" weight="semibold">
                  Recent Commits
                </Text>
                <CommitList commits={status.commits} />
              </div>

              <div className="space-y-2">
                <Text size="sm" weight="semibold">
                  Open Pull Requests
                </Text>
                <PrList pullRequests={status.pullRequests} />
              </div>

              <div className="space-y-2">
                <Text size="sm" weight="semibold">
                  CI Checks
                </Text>
                <CheckList checks={status.checks} />
              </div>
            </>
          ) : (
            <>
              <Paragraph size="sm" className="text-muted">
                Link a GitHub repository to track commits, pull requests, and CI checks.
              </Paragraph>

              {linkResult && <WebhookReveal data={linkResult} />}

              {canManage && !linkResult && (
                <Form form={form} layout="vertical" requiredMark={false} onFinish={handleLink}>
                  <Form.Item
                    name="repoFullName"
                    label={
                      <Text size="sm" weight="semibold">
                        Repository
                      </Text>
                    }
                    rules={[
                      { required: true, message: "Enter the repository in owner/repo format" },
                      {
                        pattern: /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
                        message: "Use owner/repo format (e.g. acme/my-project)",
                      },
                    ]}
                    className="mb-3"
                  >
                    <Input placeholder="owner/repo" size="middle" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<GithubOutlined />}
                    loading={isLinking}
                    block
                  >
                    Link Repository
                  </Button>
                </Form>
              )}

              {!canManage && (
                <Text size="sm" color="muted">
                  Only project admins can link a GitHub repository.
                </Text>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default React.memo(ProjectGithubCard);
