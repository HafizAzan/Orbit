import { LoadingOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import React, { useEffect } from "react";
import type { ActivityEvent } from "../../../types/activity.types";
import type { AiActivityDescribeDraft } from "../../../types/ai.types";
import { formatDate } from "../../../lib/helper";
import { showApiErrorToast } from "../../../lib/api-error";
import { useDescribeActivity } from "../../../hooks/use-ai";
import Modal from "../../ui/modal";
import { Paragraph, Text, Title } from "../../ui/typography";

type ActivityAiDescribeModalProps = {
  open: boolean;
  activity: ActivityEvent | null;
  onClose: () => void;
};

function ActivityAiDescribeModal({
  open,
  activity,
  onClose,
}: ActivityAiDescribeModalProps) {
  const { mutateAsync: describeActivity, isPending, data, reset } = useDescribeActivity();
  const draft: AiActivityDescribeDraft | undefined = data?.draft;

  useEffect(() => {
    if (!open || !activity) return;

    reset();
    void describeActivity({ activityId: activity.id }).catch((error) => {
      showApiErrorToast(error);
    });
    // Fetch once per open + activity id; mutate helpers are stable enough for this modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: avoid re-fetch loops
  }, [open, activity?.id]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <ThunderboltOutlined className="text-primary" />
          AI Describe Activity
        </span>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      }
      destroyOnHidden
      width={560}
    >
      <div className="flex min-h-56 max-h-[min(28rem,70vh)] flex-col overflow-hidden">
        {activity ? (
          <div className="mb-4 shrink-0 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <Text as="p" size="sm" weight="medium" className="mb-1!">
              {activity.summary}
            </Text>
            <Text as="p" size="xs" color="muted" className="mb-0!">
              {activity.actorName} · {formatDate(activity.createdAt, { month: "short" })}
            </Text>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Spin indicator={<LoadingOutlined className="text-2xl text-primary" spin />} />
              <Text as="p" weight="semibold" className="mt-4 mb-1!">
                AI is describing this activity
              </Text>
              <Paragraph size="sm" color="muted" className="mb-0!">
                Turning the audit entry into a plain-language explanation.
              </Paragraph>
            </div>
          ) : null}

          {!isPending && draft ? (
            <div className="space-y-4">
              <div>
                <Title level={5} className="mb-1!">
                  {draft.headline}
                </Title>
                <Paragraph size="sm" className="mb-0!">
                  {draft.explanation}
                </Paragraph>
              </div>

              <div>
                <Text as="p" size="sm" weight="semibold" className="mb-1!">
                  Impact
                </Text>
                <Paragraph size="sm" color="muted" className="mb-0!">
                  {draft.impact}
                </Paragraph>
              </div>

              <div>
                <Text as="p" size="sm" weight="semibold" className="mb-1!">
                  Suggested follow-up
                </Text>
                <Paragraph size="sm" color="muted" className="mb-0!">
                  {draft.suggestedFollowUp}
                </Paragraph>
              </div>
            </div>
          ) : null}

          {!isPending && !draft ? (
            <Paragraph size="sm" color="muted" className="mb-0!">
              Could not load an AI description for this activity. Close and try again.
            </Paragraph>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(ActivityAiDescribeModal);
