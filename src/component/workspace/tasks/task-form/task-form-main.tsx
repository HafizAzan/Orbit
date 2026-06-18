import React from "react";
import { Input, Select } from "antd";
import MarkdownEditor from "../../../common/markdown-editor";
import IntegerInput from "../../../ui/integer-input";
import {
  TASK_FORM_PRIORITY_OPTIONS,
  TASK_FORM_STATUS_OPTIONS,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { cn } from "../../../../lib/utils";
import TaskAttachmentsField from "./task-attachments-field";

type TaskFormMainProps = {
  values: TaskFormValues;
  onChange: (values: TaskFormValues) => void;
  projectOptions: Array<{ value: string; label: string }>;
  disableProject?: boolean;
};

function TaskFormMain({
  values,
  onChange,
  projectOptions,
  disableProject = false,
}: TaskFormMainProps) {
  const updateValues = (patch: Partial<TaskFormValues>) => {
    onChange({ ...values, ...patch });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="task-title">
          Task Title
        </label>
        <Input
          id="task-title"
          value={values.title}
          onChange={(event) => updateValues({ title: event.target.value })}
          placeholder="What needs to be done?"
          size="large"
          className="rounded-xl! bg-background! text-base!"
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Project</label>
            <Select
              value={values.projectId}
              onChange={(projectId) => updateValues({ projectId })}
              options={projectOptions}
              disabled={disableProject}
              size="large"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
            <Select
              value={values.status}
              onChange={(status) => updateValues({ status })}
              size="large"
              className="w-full"
              options={TASK_FORM_STATUS_OPTIONS.map((option) => ({
                value: option.value,
                label: (
                  <span className="inline-flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", option.dot)} />
                    {option.label}
                  </span>
                ),
              }))}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Priority</label>
            <Select
              value={values.priority}
              onChange={(priority) => updateValues({ priority })}
              size="large"
              className="w-full"
              options={TASK_FORM_PRIORITY_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Estimated Hours</label>
            <IntegerInput
              min={0}
              max={999}
              value={values.estimatedHours ?? undefined}
              onChange={(value) => updateValues({ estimatedHours: typeof value === "number" ? value : null })}
              size="large"
              className="w-full! rounded-xl!"
              addonAfter="hrs"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Task Description</label>
        <MarkdownEditor
          value={values.description}
          onChange={(description) => updateValues({ description })}
          placeholder="Add a detailed description..."
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Attachments</label>
        <TaskAttachmentsField
          attachments={values.attachments}
          onChange={(attachments) => updateValues({ attachments })}
        />
      </div>
    </div>
  );
}

export default React.memo(TaskFormMain);
