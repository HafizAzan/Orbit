import { CloseOutlined, GlobalOutlined, LockOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useMemo, useState } from "react";
import {
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_PRIORITY_OPTIONS,
  PROJECT_VISIBILITY_OPTIONS,
  generateProjectKey,
  type ProjectFormValues,
} from "../../../../data/workspace-project-form";
import { useAssignableProjectMembers } from "../../../../hooks/use-workspace-projects";
import { getInitial } from "../../../../lib/helper";
import { cn } from "../../../../lib/utils";
import DatePicker from "../../../ui/date-picker";

type ProjectFormFieldsProps = {
  values: ProjectFormValues;
  isKeyManual: boolean;
  onChange: (values: ProjectFormValues) => void;
  onKeyManualChange: (manual: boolean) => void;
};

function ProjectFormFields({ values, isKeyManual, onChange, onKeyManualChange }: ProjectFormFieldsProps) {
  const [memberSearch, setMemberSearch] = useState("");
  const { data: assignableMembers = [], isLoading: membersLoading } = useAssignableProjectMembers();

  const selectedMembers = useMemo(
    () => assignableMembers.filter((member) => values.memberIds.includes(member.id)),
    [assignableMembers, values.memberIds],
  );

  const availableMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    return assignableMembers.filter((member) => {
      if (values.memberIds.includes(member.id)) return false;
      if (!query) return true;

      return member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
    });
  }, [assignableMembers, memberSearch, values.memberIds]);

  const updateValues = (patch: Partial<ProjectFormValues>) => {
    onChange({ ...values, ...patch });
  };

  const handleNameChange = (name: string) => {
    const nextValues: ProjectFormValues = { ...values, name };

    if (!isKeyManual) {
      nextValues.key = generateProjectKey(name);
    }

    onChange(nextValues);
  };

  const handleAddMember = (memberId: string) => {
    if (values.memberIds.includes(memberId)) return;
    updateValues({ memberIds: [...values.memberIds, memberId] });
    setMemberSearch("");
  };

  const handleRemoveMember = (memberId: string) => {
    updateValues({ memberIds: values.memberIds.filter((id) => id !== memberId) });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Project Identity</h3>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="project-name">
              Project Name
            </label>
            <Input
              id="project-name"
              value={values.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="e.g. Q4 Website Rebrand"
              size="large"
              className="rounded-xl!"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="project-key">
              Project Key
            </label>
            <Input
              id="project-key"
              value={values.key}
              onChange={(event) => {
                onKeyManualChange(true);
                updateValues({ key: event.target.value.toUpperCase() });
              }}
              placeholder="QWR"
              size="large"
              className="rounded-xl! font-mono uppercase"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="project-description">
            Description
          </label>
          <Input.TextArea
            id="project-description"
            value={values.description}
            onChange={(event) => updateValues({ description: event.target.value })}
            rows={4}
            placeholder="What is this project about?"
            className="rounded-xl!"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Planning</h3>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
            <Select
              value={values.category}
              onChange={(category) => updateValues({ category })}
              options={PROJECT_CATEGORY_OPTIONS}
              size="large"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Priority</label>
            <Select
              value={values.priority}
              onChange={(priority) => updateValues({ priority })}
              options={PROJECT_PRIORITY_OPTIONS}
              size="large"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
            <DatePicker
              value={values.startDate || undefined}
              onChange={(startDate) => updateValues({ startDate: startDate ?? "" })}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Due Date</label>
            <DatePicker
              value={values.dueDate || undefined}
              onChange={(dueDate) => updateValues({ dueDate: dueDate ?? "" })}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Visibility</h3>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROJECT_VISIBILITY_OPTIONS.map((option) => {
            const isSelected = values.visibility === option.value;
            const Icon = option.value === "private" ? LockOutlined : GlobalOutlined;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateValues({ visibility: option.value })}
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left transition-all",
                  isSelected
                    ? "border-primary bg-feature-sync shadow-sm"
                    : "border-border bg-background hover:border-primary/25",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon className={isSelected ? "text-primary" : "text-muted"} />
                  {option.label}
                </span>
                <p className="mt-2 text-sm text-muted">{option.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Project Squad</h3>
            <p className="mt-1 text-sm text-muted">
              Add members from your workspace squad. Managers only see people from their projects.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {selectedMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm"
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  member.avatarColor,
                )}
              >
                {getInitial(member.name)}
              </span>
              {member.name}
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="text-muted transition-colors hover:text-foreground"
                aria-label={`Remove ${member.name}`}
              >
                <CloseOutlined className="text-xs" />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-4">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-muted" />}
            placeholder="Search squad members..."
            value={memberSearch}
            onChange={(event) => setMemberSearch(event.target.value)}
            size="large"
            className="rounded-xl!"
          />
        </div>

        <div className="mt-4 space-y-2">
          {membersLoading ? (
            <p className="text-sm text-muted">Loading squad members...</p>
          ) : availableMembers.length === 0 ? (
            <p className="text-sm text-muted">No more squad members available.</p>
          ) : (
            availableMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleAddMember(member.id)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/25 hover:bg-feature-sync/40"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                      member.avatarColor,
                    )}
                  >
                    {getInitial(member.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{member.name}</span>
                    <span className="block text-xs text-muted">{member.email}</span>
                  </span>
                </span>
                <PlusOutlined className="text-primary" />
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default React.memo(ProjectFormFields);
