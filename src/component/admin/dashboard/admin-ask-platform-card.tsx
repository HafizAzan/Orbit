import React, { useState } from "react";
import { Input } from "antd";
import { RobotOutlined, SendOutlined } from "@ant-design/icons";
import { useAskPlatform } from "../../../hooks/use-ai";
import { showApiErrorToast } from "../../../lib/api-error";
import { Paragraph, Text, Title } from "../../ui/typography";

function AdminAskPlatformCard() {
  const [question, setQuestion] = useState("");
  const { mutateAsync, data, isPending } = useAskPlatform();

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    try {
      await mutateAsync({ question: trimmed });
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <RobotOutlined />
        </span>
        <div>
          <Title level={5} className="mb-0!">
            Ask Orbit AI
          </Title>
          <Paragraph size="xs" className="mb-0! text-muted">
            Ask about organizations, subscriptions, users, or recent platform activity.
          </Paragraph>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          size="large"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. How many orgs are on trial?"
          onPressEnter={() => void handleAsk()}
          className="rounded-xl!"
        />
        <button
          type="button"
          disabled={isPending || !question.trim()}
          onClick={() => void handleAsk()}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          <SendOutlined />
          Ask
        </button>
      </div>

      {data?.draft ? (
        <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
          <Text as="p" size="sm" className="leading-relaxed">
            {data.draft.answer}
          </Text>
          <Text as="p" size="xs" color="muted" className="mt-2">
            Confidence: {data.draft.confidence}
            {data.draft.sources?.length
              ? ` · Sources: ${data.draft.sources.join(", ")}`
              : ""}
          </Text>
        </div>
      ) : null}
    </article>
  );
}

export default React.memo(AdminAskPlatformCard);
