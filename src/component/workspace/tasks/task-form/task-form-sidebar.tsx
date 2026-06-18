import { ClockCircleOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Select } from "antd";
import React, { useState } from "react";
import {
  getTaskAssigneeById,
  type TaskAssigneeOption,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { getInitial } from "../../../../lib/helper";
import DatePicker from "../../../ui/date-picker";
import TaskLabelsModal from "./task-labels-modal";

type TaskFormSidebarProps = {
  values: TaskFormValues;
  reporterName: string;
  onChange: (values: TaskFormValues) => void;
  assigneeOptions: TaskAssigneeOption[];
};

function TaskFormSidebar({
  values,
  reporterName,
  onChange,
  assigneeOptions,
}: TaskFormSidebarProps) {
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);

  const updateValues = (patch: Partial<TaskFormValues>) => {
    onChange({ ...values, ...patch });
  };

  const handleRemoveLabel = (label: string) => {
    updateValues({ labels: values.labels.filter((item) => item !== label) });
  };

  return (
    <>
      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">People</h3>

          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">Assignee</p>
              <SelectAssignee
                value={values.assigneeId}
                onChange={(assigneeId) => updateValues({ assigneeId })}
                options={assigneeOptions}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">Reporter</p>
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/50 p-3">
                <Avatar size={32} className="bg-primary! text-xs! font-semibold! text-white!">
                  {getInitial(reporterName)}
                </Avatar>
                <span className="text-sm font-medium text-foreground">Me ({reporterName.split(" ")[0]})</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Dates</h3>
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">Due Date</p>
            <DatePicker value={values.dueDate} onChange={(dueDate) => updateValues({ dueDate })} placeholder="mm/dd/yyyy" />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Classification</h3>
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">Labels</p>
            <div className="flex flex-wrap items-center gap-2">
              {values.labels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-semibold text-primary"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(label)}
                    className="text-primary/70 transition-colors hover:text-primary"
                    aria-label={`Remove ${label}`}
                  >
                    <CloseOutlined className="text-[10px]" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={() => setLabelsModalOpen(true)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border text-muted transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Add labels"
              >
                <PlusOutlined className="text-xs" />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-center">
          <ClockCircleOutlined className="text-xl text-muted" />
          <p className="mt-3 text-sm text-muted">Activity will appear here as the task progresses.</p>
        </section>
      </aside>

      <TaskLabelsModal
        open={labelsModalOpen}
        selectedLabels={values.labels}
        onClose={() => setLabelsModalOpen(false)}
        onSave={(labels) => updateValues({ labels })}
      />
    </>
  );
}

function AssigneeOptionContent({ assignee }: { assignee: TaskAssigneeOption }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-feature-sync text-[11px] font-bold text-primary">
        {assignee.initials}
      </div>
      <span className="text-sm font-medium text-foreground">{assignee.name}</span>
    </div>
  );
}

type SelectAssigneeProps = {
  value: string;
  onChange: (value: string) => void;
  options: TaskAssigneeOption[];
};

function SelectAssignee({ value, onChange, options }: SelectAssigneeProps) {
  const selectedAssignee = options.find((item) => item.id === value) ?? getTaskAssigneeById(value, options);

  return (
    <Select
      value={value || undefined}
      onChange={onChange}
      size="large"
      showSearch
      allowClear
      optionFilterProp="label"
      placeholder="Select assignee"
      className="w-full [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-border! [&_.ant-select-selector]:bg-background/50!"
      options={options.map((option) => ({
        value: option.id,
        label: option.name,
      }))}
      optionRender={(option) => {
        const assignee = options.find((item) => item.id === option.value);
        if (!assignee) return option.label;
        return <AssigneeOptionContent assignee={assignee} />;
      }}
      labelRender={() => {
        if (!selectedAssignee) {
          return <span className="text-sm text-muted">Unassigned</span>;
        }

        return <AssigneeOptionContent assignee={selectedAssignee} />;
      }}
    />
  );
}

export default React.memo(TaskFormSidebar);
