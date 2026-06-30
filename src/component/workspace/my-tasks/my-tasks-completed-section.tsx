import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { Paragraph, Title } from "../../ui/typography";

type MyTasksCompletedSectionProps = {
  count: number;
  onClearAll?: () => void;
};

function MyTasksCompletedSection({ count, onClearAll }: MyTasksCompletedSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Title level={5} color="default">Completed</Title>
          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-slate-500 px-2 py-0.5 text-xs font-bold text-white">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onClearAll ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              Clear all
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className={cn("text-muted transition-colors hover:text-foreground")}
            aria-label={expanded ? "Collapse completed tasks" : "Expand completed tasks"}
          >
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </button>
        </div>
      </div>

      {expanded ? (
        <Paragraph size="sm" className="mt-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          Completed tasks are archived here. Open a task from your active sections to review details.
        </Paragraph>
      ) : null}
    </section>
  );
}

export default React.memo(MyTasksCompletedSection);
