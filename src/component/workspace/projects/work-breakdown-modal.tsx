import { ThunderboltOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Tag } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import type { AiWorkBreakdownDraft } from "../../../types/ai.types";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { useApplyWorkBreakdown, useGenerateWorkBreakdown } from "../../../hooks/use-ai";
import Modal from "../../ui/modal";
import { Paragraph, Text, Title } from "../../ui/typography";
import ProjectAiGeneratingOverlay from "../projects/project-form/project-ai-generating-overlay";

type WorkBreakdownModalProps = {
  open: boolean;
  projectId: string;
  projectName: string;
  onClose: () => void;
};

function flattenDraftTasks(draft: AiWorkBreakdownDraft) {
  return draft.stories.flatMap((story) =>
    story.tasks.map((task) => ({
      title: task.title,
      description: [task.description, `Story: ${story.title}`].filter(Boolean).join("\n\n"),
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      labels: task.labels,
      acceptanceCriteria: task.acceptanceCriteria,
      definitionOfDone: task.definitionOfDone,
    })),
  );
}

function WorkBreakdownModal({ open, projectId, projectName, onClose }: WorkBreakdownModalProps) {
  const [requirement, setRequirement] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<AiWorkBreakdownDraft | null>(null);
  const [updateDescription, setUpdateDescription] = useState(true);
  const { mutateAsync: generate, isPending: generating } = useGenerateWorkBreakdown();
  const { mutateAsync: apply, isPending: applying } = useApplyWorkBreakdown();

  useEffect(() => {
    if (!open) return;
    setRequirement("");
    setError("");
    setDraft(null);
    setUpdateDescription(true);
  }, [open]);

  const flatTasks = useMemo(() => (draft ? flattenDraftTasks(draft) : []), [draft]);
  const taskCount = flatTasks.length;

  const handleGenerate = async () => {
    const trimmed = requirement.trim();
    if (!trimmed) {
      setError("Describe the requirement for AI to break down.");
      return;
    }

    setError("");
    try {
      const result = await generate({ projectId, requirement: trimmed });
      setDraft(result.draft);
      showApiSuccessToast(result.message);
    } catch (err) {
      showApiErrorToast(err);
    }
  };

  const handleApply = async () => {
    if (!draft || taskCount === 0) return;

    try {
      const result = await apply({
        projectId,
        updateProjectDescription: updateDescription,
        tasks: flatTasks,
      });
      showApiSuccessToast(result.message);
      onClose();
    } catch (err) {
      showApiErrorToast(err);
    }
  };

  return (
    <>
      <ProjectAiGeneratingOverlay open={generating || applying} />
      <Modal
        open={open}
        onCancel={generating || applying ? undefined : onClose}
        title={
          <span className="inline-flex items-center gap-2">
            <ThunderboltOutlined className="text-primary" />
            AI Work Breakdown
          </span>
        }
        footer={null}
        destroyOnHidden
        maskClosable={!generating && !applying}
        closable={!generating && !applying}
        width={720}
      >
        <Paragraph size="sm" color="muted" className="mb-4!">
          Describe what to build for <Text as="span" weight="semibold">{projectName}</Text>. AI drafts
          an epic, stories, and tasks — you review, then Apply creates real todo tasks.
        </Paragraph>

        {!draft ? (
          <>
            <Text as="label" size="sm" weight="semibold" className="mb-2! block">
              Requirement <span className="text-red-500">*</span>
            </Text>
            <Input.TextArea
              rows={5}
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              placeholder="e.g. Build checkout with Stripe, guest cart, and order confirmation email..."
              disabled={generating}
              className="rounded-xl!"
            />
            {error ? (
              <Paragraph size="sm" className="mt-3 mb-0! text-red-500">
                {error}
              </Paragraph>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={onClose} disabled={generating}>
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                loading={generating}
                onClick={() => {
                  void handleGenerate();
                }}
              >
                Generate draft
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 max-h-28 min-h-16 overflow-y-auto overscroll-contain rounded-xl border border-border bg-muted/30 px-4 py-3">
              <Title level={5} className="mb-1!">
                {draft.epicTitle}
              </Title>
              <Paragraph size="sm" color="muted" className="mb-0!">
                {draft.epicSummary}
              </Paragraph>
            </div>

            <div className="mb-3 flex items-center justify-between gap-2">
              <Text as="span" size="sm" weight="semibold">
                Preview · {draft.stories.length} stories · {taskCount} tasks
              </Text>
              <Button
                type="link"
                size="small"
                disabled={generating || applying}
                onClick={() => setDraft(null)}
              >
                Edit requirement
              </Button>
            </div>

            <div className="min-h-40 max-h-72 space-y-3 overflow-y-auto overscroll-contain pr-1">
              {draft.stories.map((story) => (
                <div key={story.title} className="rounded-xl border border-border px-3 py-3">
                  <Text as="p" size="sm" weight="semibold" className="mb-1!">
                    {story.title}
                    {story.storyPoints != null ? (
                      <Tag className="ml-2! rounded-full!">{story.storyPoints} pts</Tag>
                    ) : null}
                  </Text>
                  <Paragraph size="xs" color="muted" className="mb-2! line-clamp-3">
                    {story.description}
                  </Paragraph>
                  <ul className="mb-0! list-disc space-y-1 pl-4">
                    {story.tasks.map((task) => (
                      <li key={task.title}>
                        <Text as="span" size="sm">
                          {task.title}
                        </Text>
                        <Tag className="ml-2! rounded-full! text-[10px]!">{task.priority}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Checkbox
                checked={updateDescription}
                onChange={(event) => setUpdateDescription(event.target.checked)}
                disabled={applying}
              >
                Append task titles to project description
              </Checkbox>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={onClose} disabled={applying}>
                Cancel
              </Button>
              <Button
                type="primary"
                loading={applying}
                disabled={taskCount === 0}
                onClick={() => {
                  void handleApply();
                }}
              >
                Apply {taskCount} task{taskCount === 1 ? "" : "s"}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default React.memo(WorkBreakdownModal);
