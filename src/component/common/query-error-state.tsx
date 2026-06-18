import { CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../lib/api-error";
import { Paragraph, Title } from "../ui/typography";

type QueryErrorStateProps = {
  error?: unknown;
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  retryLabel?: string;
  homePath?: string;
  homeLabel?: string;
};

function QueryErrorState({
  error,
  title = "Something went wrong",
  description,
  onRetry,
  isRetrying = false,
  retryLabel = "Try again",
  homePath,
  homeLabel = "Back to home",
}: QueryErrorStateProps) {
  const errorMessage = getApiErrorMessage(error);
  const resolvedDescription =
    description ??
    errorMessage ??
    "We could not load this data. The server may be unavailable — please try again shortly.";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <CloseCircleOutlined className="text-2xl" />
      </span>
      <Title level={3} className="mt-5 text-foreground">
        {title}
      </Title>
      <Paragraph size="sm" className="mt-2 text-muted">
        {resolvedDescription}
      </Paragraph>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={isRetrying}
            onClick={onRetry}
            className="font-semibold!"
          >
            {retryLabel}
          </Button>
        ) : null}

        {homePath ? (
          <Link
            to={homePath}
            className="inline-flex rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            {homeLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(QueryErrorState);
