import { CheckOutlined, ClockCircleOutlined, CloseOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Input } from "antd";
import React, { useMemo, useState } from "react";
import {
  type TaskAssigneeOption,
  type TaskFormValues,
} from "../../../../data/workspace-task-form";
import { getInitial } from "../../../../lib/helper";
import { cn } from "../../../../lib/utils";
import DatePicker from "../../../ui/date-picker";
import TaskLabelsModal from "./task-labels-modal";

type TaskFormSidebarProps = {
  values: TaskFormValues;
  reporterName: string;
  onChange: (values: TaskFormValues) => void;
  assigneeOptions: TaskAssigneeOption[];
  assigneeLoading?: boolean;
  hasSelectedProject?: boolean;
};

function TaskFormSidebar({
  values,
  reporterName,
  onChange,
  assigneeOptions,
  assigneeLoading = false,
  hasSelectedProject = false,
}: TaskFormSidebarProps) {
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState("");

  const selectedAssignee = useMemo(
    () =>
      values.assigneeId
        ? assigneeOptions.find((option) => option.id === values.assigneeId) ?? null
        : null,
    [assigneeOptions, values.assigneeId],
  );

  const filteredAssigneeOptions = useMemo(() => {
    const query = assigneeSearch.trim().toLowerCase();
    if (!query) return assigneeOptions;

    return assigneeOptions.filter((option) => option.name.toLowerCase().includes(query));
  }, [assigneeOptions, assigneeSearch]);

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

              {hasSelectedProject && assigneeOptions.length > 0 ? (
                <Input
                  allowClear
                  prefix={<SearchOutlined className="text-muted" />}
                  placeholder="Search members..."
                  value={assigneeSearch}
                  onChange={(event) => setAssigneeSearch(event.target.value)}
                  disabled={assigneeLoading}
                  size="large"
                  className="rounded-xl! border-border! bg-background/50!"
                />
              ) : null}

              <div className={hasSelectedProject && assigneeOptions.length > 0 ? "mt-3" : undefined}>
                <AssigneeMemberList
                options={filteredAssigneeOptions}
                selectedAssignee={selectedAssignee}
                loading={assigneeLoading}
                disabled={!hasSelectedProject}
                emptyHint={
                  !hasSelectedProject
                    ? "Select a project first"
                    : assigneeOptions.length === 0
                      ? "No members on this project"
                      : "No matching members"
                }
                onSelect={(assigneeId) => updateValues({ assigneeId })}
                onClear={() => updateValues({ assigneeId: "" })}
                />
              </div>

              <p className="mt-2 text-xs text-muted">
                Only members added to the selected project can be assigned.
              </p>
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

type AssigneeMemberListProps = {
  options: TaskAssigneeOption[];
  selectedAssignee: TaskAssigneeOption | null;
  loading?: boolean;
  disabled?: boolean;
  emptyHint?: string;
  onSelect: (assigneeId: string) => void;
  onClear: () => void;
};

function AssigneeMemberList({
  options,
  selectedAssignee,
  loading = false,
  disabled = false,
  emptyHint = "No members found",
  onSelect,
  onClear,
}: AssigneeMemberListProps) {
  return (
    <div className="space-y-2">
      {selectedAssignee ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/25 bg-feature-sync px-3 py-2.5">
          <AssigneeOptionContent assignee={selectedAssignee} />
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Remove ${selectedAssignee.name}`}
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>
      ) : null}

      <div className="min-h-20 max-h-48 overflow-y-auto rounded-xl border border-border bg-background/50 p-1.5">
        {loading ? (
          <p className="px-3 py-4 text-sm text-muted">Loading project members...</p>
        ) : options.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted">{emptyHint}</p>
        ) : (
          <ul className="space-y-1">
            {options.map((assignee) => {
              const isSelected = assignee.id === selectedAssignee?.id;

              return (
                <li key={assignee.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(isSelected ? "" : assignee.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors",
                      isSelected
                        ? "border border-primary/20 bg-feature-sync"
                        : "border border-transparent hover:border-border hover:bg-background",
                      disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <AssigneeOptionContent assignee={assignee} />
                    {isSelected ? <CheckOutlined className="shrink-0 text-xs text-primary" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default React.memo(TaskFormSidebar);
