import { PlusOutlined } from "@ant-design/icons";
import React from "react";

function ProjectTemplateCard() {
  return (
    <button
      type="button"
      className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
        <PlusOutlined className="text-2xl" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">New Project Template</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        Quickly launch a new workspace with pre-built workflows.
      </p>
    </button>
  );
}

export default React.memo(ProjectTemplateCard);
