import { ThunderboltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import type { ApiWorkspaceTask } from "../../../types/task.types";
import type { AiTaskTipDraft } from "../../../types/ai.types";
import { showApiErrorToast } from "../../../lib/api-error";
import { useGenerateTaskTip } from "../../../hooks/use-ai";
import { Paragraph, Text } from "../../ui/typography";

type TaskAiTipCardProps = {
  task: ApiWorkspaceTask;
};

function isTaskTipEligible(task: ApiWorkspaceTask) {
  const isReview = task.status === "review";
  const isOverdue =
    Boolean(task.dueDate) &&
    task.status !== "done" &&
    new Date(task.dueDate as string) < new Date();
  return isReview || isOverdue;
}

function TaskAiTipCard({ task }: TaskAiTipCardProps) {
  const eligible = useMemo(() => isTaskTipEligible(task), [task]);
  const { mutateAsync: generate, isPending } = useGenerateTaskTip();
  const [draft, setDraft] = useState<AiTaskTipDraft | null>(null);

  useEffect(() => {
    setDraft(null);
  }, [task.id, task.status, task.dueDate]);

  if (!eligible) return null;

  const handleGenerate = async () => {
    try {
      const result = await generate({ taskId: task.id });
      setDraft(result.draft);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <section className="flex min-h-28 max-h-56 flex-col overflow-hidden rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 shadow-sm sm:p-6">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2">
          <ThunderboltOutlined className="text-amber-600" />
          <Text as="p" size="sm" weight="semibold">
            AI tip
          </Text>
        </div>
        <Button
          size="small"
          icon={<ThunderboltOutlined />}
          loading={isPending}
          onClick={() => {
            void handleGenerate();
          }}
        >
          {draft ? "Refresh tip" : "Why / next"}
        </Button>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        {!draft && !isPending ? (
          <Paragraph size="sm" color="muted" className="mb-0!">
            This task is overdue or in review. Ask AI for a short reason and next step.
          </Paragraph>
        ) : null}

        {isPending && !draft ? (
          <Paragraph size="sm" color="muted" className="mb-0!">
            Generating tip…
          </Paragraph>
        ) : null}

        {draft ? (
          <div className="space-y-2">
            <div>
              <Text as="p" size="xs" weight="semibold" className="mb-0.5! uppercase tracking-wide text-muted">
                Why
              </Text>
              <Paragraph size="sm" className="mb-0!">
                {draft.reason}
              </Paragraph>
            </div>
            <div>
              <Text as="p" size="xs" weight="semibold" className="mb-0.5! uppercase tracking-wide text-muted">
                Next
              </Text>
              <Paragraph size="sm" className="mb-0!">
                {draft.nextStep}
              </Paragraph>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default React.memo(TaskAiTipCard);
