import { ThunderboltOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import React, { useState } from "react";
import type { AiProjectSummaryDraft } from "../../../types/ai.types";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { useGenerateProjectSummary } from "../../../hooks/use-ai";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { Paragraph, Text, Title } from "../../ui/typography";

const RISK_TAG: Record<AiProjectSummaryDraft["riskLevel"], string> = {
  low: "green",
  medium: "gold",
  high: "red",
};

type ProjectAiHealthCardProps = {
  projectId: string;
  projectName: string;
};

function ProjectAiHealthCard({ projectId, projectName }: ProjectAiHealthCardProps) {
  const { role } = useWorkspacePermissions();
  const canUse = role === "owner" || role === "admin" || role === "manager";
  const { mutateAsync: generate, isPending, data } = useGenerateProjectSummary();
  const [draft, setDraft] = useState<AiProjectSummaryDraft | null>(null);

  if (!canUse) return null;

  const handleGenerate = async () => {
    try {
      const result = await generate({ projectId });
      setDraft(result.draft);
      showApiSuccessToast(result.message);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const summary = draft ?? data?.draft ?? null;

  return (
    <div className="flex min-h-40 max-h-80 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2">
          <ThunderboltOutlined className="text-primary" />
          <Title level={4} className="mb-0!">
            AI Project Health
          </Title>
        </div>
        <Button
          type="primary"
          size="small"
          icon={<ThunderboltOutlined />}
          loading={isPending}
          onClick={() => {
            void handleGenerate();
          }}
        >
          {summary ? "Refresh" : "Generate"}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        {!summary && !isPending ? (
          <Paragraph size="sm" color="muted" className="mb-0!">
            Get an executive summary, risk level, and next actions for {projectName}.
          </Paragraph>
        ) : null}

        {isPending && !summary ? (
          <Paragraph size="sm" color="muted" className="mb-0!">
            Analyzing project tasks and deadlines…
          </Paragraph>
        ) : null}

        {summary ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Tag color={RISK_TAG[summary.riskLevel]} className="rounded-full!">
                Risk: {summary.riskLevel}
              </Tag>
              <Text as="span" size="sm" color="muted">
                Health {summary.healthScore}/100 · Confidence {summary.confidence}%
              </Text>
            </div>

            <Paragraph size="sm" className="mb-0!">
              {summary.executiveSummary}
            </Paragraph>

            {summary.risks.length > 0 ? (
              <div>
                <Text as="p" size="sm" weight="semibold" className="mb-1!">
                  Risks
                </Text>
                <ul className="mb-0! list-disc space-y-1 pl-4">
                  {summary.risks.slice(0, 4).map((risk) => (
                    <li key={risk}>
                      <Text as="span" size="sm" color="muted">
                        {risk}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {summary.recommendedNextActions.length > 0 ? (
              <div>
                <Text as="p" size="sm" weight="semibold" className="mb-1!">
                  Next actions
                </Text>
                <ul className="mb-0! list-disc space-y-1 pl-4">
                  {summary.recommendedNextActions.slice(0, 4).map((action) => (
                    <li key={action}>
                      <Text as="span" size="sm" color="muted">
                        {action}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(ProjectAiHealthCard);
