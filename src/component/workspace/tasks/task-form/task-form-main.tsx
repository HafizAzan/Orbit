import {
  BoldOutlined,
  CloudUploadOutlined,
  CodeOutlined,
  ItalicOutlined,
  LinkOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Input, InputNumber, Select } from "antd";
import React from "react";
import {
  TASK_FORM_PRIORITY_OPTIONS,
  TASK_FORM_STATUS_OPTIONS,
  TASK_PROJECT_OPTIONS,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { cn } from "../../../../lib/utils";

type TaskFormMainProps = {
  values: TaskFormValues;
  onChange: (values: TaskFormValues) => void;
};

function TaskFormMain({ values, onChange }: TaskFormMainProps) {
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
              options={TASK_PROJECT_OPTIONS}
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
            <InputNumber
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

        <div className="mb-3 flex flex-wrap items-center gap-1 rounded-xl border border-border bg-background/60 p-2">
          {[BoldOutlined, ItalicOutlined, UnorderedListOutlined, LinkOutlined, CodeOutlined].map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-foreground"
              aria-label="Formatting option"
            >
              <Icon />
            </button>
          ))}
        </div>

        <Input.TextArea
          value={values.description}
          onChange={(event) => updateValues({ description: event.target.value })}
          placeholder="Add a detailed description..."
          rows={8}
          className="rounded-xl! border-border! bg-background! resize-none!"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Attachments</label>
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 px-6 py-10 text-center transition-colors hover:border-primary/30 hover:bg-background"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-feature-sync text-primary">
            <CloudUploadOutlined className="text-xl" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-muted">PNG, JPG, PDF up to 10MB</p>
        </button>
      </div>
    </div>
  );
}

export default React.memo(TaskFormMain);
