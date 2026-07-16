import {
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  CopyOutlined,
  DisconnectOutlined,
  GithubOutlined,
  LinkOutlined,
  PullRequestOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Alert, Button, Form, Input, Skeleton, Tag, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import type {
  GithubCheck,
  GithubCommit,
  GithubPullRequest,
  LinkProjectGithubResponse,
} from '../../../api-services/project.service';
import { useLinkProjectGithub, useProjectGithubStatus } from '../../../hooks/use-project-github';
import { showApiErrorToast, showApiSuccessToast } from '../../../lib/api-error';
import { cn } from '../../../lib/utils';
import type { ApiWorkspaceProject } from '../../../types/project.types';
import { Paragraph, Text, Title } from '../../ui/typography';

type ProjectGithubCardProps = {
  projectId: string;
  viewerRole: ApiWorkspaceProject['viewerRole'];
  className?: string;
};

function copyToClipboard(value: string, label: string) {
  void navigator.clipboard.writeText(value).then(() => {
    void message.success(`${label} copied to clipboard`);
  });
}

function canManageGithub(viewerRole: ApiWorkspaceProject['viewerRole']): boolean {
  return viewerRole === 'admin' || viewerRole === 'org_admin';
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <Text size="sm" color="muted">
      {children}
    </Text>
  );
}

function CommitList({ commits }: { commits: GithubCommit[] }) {
  if (commits.length === 0) return <EmptyHint>No recent commits.</EmptyHint>;

  return (
    <ul className="space-y-2.5">
      {commits.slice(0, 5).map((commit) => (
        <li key={commit.sha} className="min-w-0">
          <a
            href={commit.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {commit.message}
          </a>
          <Text size="xs" color="muted" className="mt-0.5 block">
            {commit.author} · {new Date(commit.committedAt).toLocaleDateString()}
          </Text>
        </li>
      ))}
    </ul>
  );
}

function PrList({ pullRequests }: { pullRequests: GithubPullRequest[] }) {
  if (pullRequests.length === 0) return <EmptyHint>No open pull requests.</EmptyHint>;

  return (
    <ul className="space-y-2.5">
      {pullRequests.slice(0, 5).map((pr) => (
        <li key={pr.number} className="min-w-0">
          <a
            href={pr.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <span className="text-muted-foreground">#{pr.number}</span> {pr.title}
          </a>
          <Text size="xs" color="muted" className="mt-0.5 block">
            {pr.author} · {pr.state}
          </Text>
        </li>
      ))}
    </ul>
  );
}

function CheckList({ checks }: { checks: GithubCheck[] }) {
  if (checks.length === 0) return <EmptyHint>No CI checks recorded.</EmptyHint>;

  return (
    <ul className="space-y-2.5">
      {checks.slice(0, 5).map((check) => (
        <li key={check.name} className="flex min-w-0 items-center gap-2">
          {check.conclusion === 'success' ? (
            <CheckCircleOutlined className="shrink-0 text-emerald-500" />
          ) : check.conclusion === 'failure' ? (
            <CloseCircleOutlined className="shrink-0 text-red-500" />
          ) : (
            <SyncOutlined spin className="shrink-0 text-amber-500" />
          )}
          <a
            href={check.url}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 flex-1 truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {check.name}
          </a>
          <Tag className="m-0 shrink-0 text-xs">{check.status}</Tag>
        </li>
      ))}
    </ul>
  );
}

function WebhookReveal({
  data,
  onDismiss,
}: {
  data: LinkProjectGithubResponse;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Text as="p" size="sm" weight="semibold">
            Repository linked
          </Text>
          <Paragraph size="sm" className="mt-1 text-muted-foreground">
            Copy the webhook secret now — it will not be shown again.
          </Paragraph>
        </div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          aria-label="Dismiss webhook details"
          onClick={onDismiss}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Text size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
            Webhook URL
          </Text>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
              {data.webhookUrl ?? '—'}
            </code>
            <Tooltip title="Copy">
              <Button
                size="small"
                icon={<CopyOutlined />}
                disabled={!data.webhookUrl}
                onClick={() => {
                  if (data.webhookUrl) copyToClipboard(data.webhookUrl, 'Webhook URL');
                }}
              />
            </Tooltip>
          </div>
        </div>

        <div className="space-y-1.5">
          <Text size="xs" weight="semibold" color="muted" className="uppercase tracking-wide">
            Webhook Secret
          </Text>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
              {data.githubWebhookSecret ?? '—'}
            </code>
            <Tooltip title="Copy">
              <Button
                size="small"
                icon={<CopyOutlined />}
                disabled={!data.githubWebhookSecret}
                onClick={() => {
                  if (data.githubWebhookSecret) {
                    copyToClipboard(data.githubWebhookSecret, 'Webhook secret');
                  }
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectGithubCard({ projectId, viewerRole, className }: ProjectGithubCardProps) {
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
      showApiSuccessToast('GitHub repository unlinked.');
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
            <GithubOutlined className="text-lg" />
          </div>
          <div className="min-w-0">
            <Title level={5} color="default" className="!mb-0">
              GitHub
            </Title>
            <Paragraph size="sm" className="mt-0.5 text-muted-foreground">
              Commits, pull requests, and CI for this project
            </Paragraph>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status?.linked && status.repoFullName ? (
            <a
              href={`https://github.com/${status.repoFullName}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LinkOutlined className="shrink-0" />
              <span className="truncate">{status.repoFullName}</span>
            </a>
          ) : null}

          {status?.linked ? (
            <Tooltip title="Refresh status">
              <Button
                size="small"
                icon={<SyncOutlined spin={statusQuery.isFetching} />}
                onClick={() => {
                  void statusQuery.refetch();
                }}
              />
            </Tooltip>
          ) : null}

          {status?.linked && canManage ? (
            <Tooltip title="Unlink repository">
              <Button
                size="small"
                danger
                icon={<DisconnectOutlined />}
                loading={isUnlinking}
                onClick={() => {
                  void handleUnlink();
                }}
              />
            </Tooltip>
          ) : null}
        </div>
      </div>

      {statusQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} className="mt-5" />
      ) : (
        <div className="mt-5 space-y-4">
          {linkResult ? (
            <WebhookReveal data={linkResult} onDismiss={() => setLinkResult(null)} />
          ) : null}

          {status?.warning ? <Alert type="warning" message={status.warning} showIcon /> : null}

          {status?.linked ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <section className="rounded-xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <BranchesOutlined />
                  <Text size="xs" weight="semibold" className="uppercase tracking-wide">
                    Recent commits
                  </Text>
                </div>
                <CommitList commits={status.commits} />
              </section>

              <section className="rounded-xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <PullRequestOutlined />
                  <Text size="xs" weight="semibold" className="uppercase tracking-wide">
                    Open pull requests
                  </Text>
                </div>
                <PrList pullRequests={status.pullRequests} />
              </section>

              <section className="rounded-xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <CheckCircleOutlined />
                  <Text size="xs" weight="semibold" className="uppercase tracking-wide">
                    CI checks
                  </Text>
                </div>
                <CheckList checks={status.checks} />
              </section>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/40 p-4 sm:p-5">
              {canManage && !linkResult ? (
                <Form
                  form={form}
                  layout="vertical"
                  requiredMark={false}
                  onFinish={handleLink}
                  className="flex flex-col gap-3 sm:flex-row sm:items-end"
                >
                  <Form.Item
                    name="repoFullName"
                    label={
                      <Text size="sm" weight="semibold">
                        Repository
                      </Text>
                    }
                    rules={[
                      { required: true, message: 'Enter the repository in owner/repo format' },
                      {
                        pattern: /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
                        message: 'Use owner/repo format (e.g. acme/my-project)',
                      },
                    ]}
                    className="mb-0 min-w-0 flex-1"
                  >
                    <Input placeholder="owner/repo" size="large" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<GithubOutlined />}
                    loading={isLinking}
                    size="large"
                    className="sm:shrink-0"
                  >
                    Link repository
                  </Button>
                </Form>
              ) : !canManage ? (
                <Text size="sm" color="muted">
                  Only project admins can link a GitHub repository.
                </Text>
              ) : (
                <Paragraph size="sm" className="text-muted-foreground">
                  Link a GitHub repository to track commits, pull requests, and CI checks.
                </Paragraph>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default React.memo(ProjectGithubCard);
