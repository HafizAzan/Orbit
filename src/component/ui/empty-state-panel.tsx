import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Text } from "./typography";

type EmptyStatePanelProps = {
  title?: string;
  description: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
};

function EmptyStatePanel({
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStatePanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background text-center",
        compact ? "px-4 py-8" : "px-6 py-10",
        className,
      )}
    >
      {title ? (
        <Text as="p" weight="semibold" className="mb-1">
          {title}
        </Text>
      ) : null}
      <Paragraph size="sm" color="muted" className="mb-0! max-w-sm">
        {description}
      </Paragraph>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyStatePanel;
export type { EmptyStatePanelProps };
