import { ThunderboltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import type { AiMembershipImpactDraft } from "../../../types/ai.types";
import { showApiErrorToast } from "../../../lib/api-error";
import { useGenerateMembershipImpact } from "../../../hooks/use-ai";
import { Paragraph, Text } from "../../ui/typography";

type MembershipAiImpactNoteProps = {
  changeType: string;
  changeContext: string;
  enabled?: boolean;
};

function MembershipAiImpactNote({
  changeType,
  changeContext,
  enabled = true,
}: MembershipAiImpactNoteProps) {
  const { mutateAsync: generate, isPending } = useGenerateMembershipImpact();
  const [draft, setDraft] = useState<AiMembershipImpactDraft | null>(null);

  if (!enabled) return null;

  const handleGenerate = async () => {
    if (!changeContext.trim()) return;

    try {
      const result = await generate({
        changeType,
        changeContext,
      });
      setDraft(result.draft);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <div className="flex min-h-24 max-h-44 flex-col overflow-hidden rounded-xl border border-border bg-muted/20 px-3 py-3">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <Text as="span" size="sm" weight="semibold" className="inline-flex items-center gap-1.5">
          <ThunderboltOutlined className="text-primary" />
          AI impact note
        </Text>
        <Button
          type="link"
          size="small"
          loading={isPending}
          disabled={!changeContext.trim()}
          onClick={() => {
            void handleGenerate();
          }}
        >
          {draft ? "Refresh" : "Explain impact"}
        </Button>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        {draft ? (
          <div className="space-y-1.5">
            <Text as="p" size="sm" weight="medium" className="mb-0!">
              {draft.headline}
            </Text>
            <Paragraph size="sm" color="muted" className="mb-0!">
              {draft.impact}
            </Paragraph>
            <Paragraph size="xs" color="muted" className="mb-0!">
              Caution: {draft.caution}
            </Paragraph>
          </div>
        ) : (
          <Paragraph size="xs" color="muted" className="mb-0!">
            Optional: ask AI what this invite or role change means for permissions.
          </Paragraph>
        )}
      </div>
    </div>
  );
}

export default React.memo(MembershipAiImpactNote);
