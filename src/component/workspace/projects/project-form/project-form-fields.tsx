import { CloseOutlined, GlobalOutlined, LockOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useMemo, useState } from "react";
import {
  ASSIGNABLE_PROJECT_MEMBERS,
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_PRIORITY_OPTIONS,
  PROJECT_VISIBILITY_OPTIONS,
  generateProjectKey,
  type ProjectFormValues,
} from "../../../../data/workspace-project-form";
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

  const selectedMembers = useMemo(
    () => ASSIGNABLE_PROJECT_MEMBERS.filter((member) => values.memberIds.includes(member.id)),
    [values.memberIds],
  );

  const availableMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    return ASSIGNABLE_PROJECT_MEMBERS.filter((member) => {
      if (values.memberIds.includes(member.id)) return false;
      if (!query) return true;

      return member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
    });
  }, [memberSearch, values.memberIds]);

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
              className="rounded-xl! bg-background!"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="project-key">
              Project Key
            </label>
            <div className="relative">
              <Input
                id="project-key"
                value={values.key}
                onChange={(event) => {
                  onKeyManualChange(true);
                  updateValues({ key: event.target.value.toUpperCase().slice(0, 6) });
                }}
                placeholder="WBR"
                size="large"
                className="rounded-xl! bg-background! pr-16!"
              />
              {!isKeyManual ? (
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-feature-sync px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                  Auto
                </span>
              ) : null}
            </div>
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
            placeholder="Briefly describe the purpose of this project..."
            rows={4}
            className="rounded-xl! border-border! bg-background! resize-none!"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Categorization & Priority</h3>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="project-category">
              Project Category
            </label>
            <Select
              id="project-category"
              value={values.category}
              onChange={(category) => updateValues({ category })}
              options={PROJECT_CATEGORY_OPTIONS}
              size="large"
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-foreground">Priority</span>
            <div className="inline-flex w-full rounded-xl border border-border bg-background p-1">
              {PROJECT_PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateValues({ priority: option.value })}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    values.priority === option.value
                      ? "bg-feature-sync text-primary shadow-sm"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
            <DatePicker
              value={values.startDate}
              onChange={(startDate) => updateValues({ startDate })}
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Due Date</label>
            <DatePicker
              value={values.dueDate}
              onChange={(dueDate) => updateValues({ dueDate })}
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Visibility</h3>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROJECT_VISIBILITY_OPTIONS.map((option) => {
            const isSelected = values.visibility === option.value;
            const Icon = option.value === "private" ? LockOutlined : GlobalOutlined;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateValues({ visibility: option.value })}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-feature-sync/60 shadow-sm"
                    : "border-border bg-background/50 hover:border-primary/30 hover:bg-background",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isSelected ? "bg-primary text-white" : "bg-card text-muted",
                    )}
                  >
                    <Icon />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Team Assignment</h3>

        <div className="relative mt-5">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-muted" />}
            value={memberSearch}
            onChange={(event) => setMemberSearch(event.target.value)}
            placeholder="Search team members by name or email..."
            size="large"
            className="rounded-xl! bg-background!"
          />

          {memberSearch.trim() && availableMembers.length > 0 ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {availableMembers.slice(0, 5).map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleAddMember(member.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-background"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      member.avatarColor,
                    )}
                  >
                    {getInitial(member.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{member.name}</span>
                    <span className="block text-xs text-muted">{member.email}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {selectedMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
            >
              {member.name}
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="text-muted transition-colors hover:text-foreground"
                aria-label={`Remove ${member.name}`}
              >
                <CloseOutlined className="text-[10px]" />
              </button>
            </span>
          ))}

          {availableMembers[0] ? (
            <button
              type="button"
              onClick={() => handleAddMember(availableMembers[0].id)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <PlusOutlined className="text-xs" />
              Add Member
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default React.memo(ProjectFormFields);
