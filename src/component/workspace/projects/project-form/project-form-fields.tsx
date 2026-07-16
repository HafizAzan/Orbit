import { CloseOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_LEAD_ROLES,
  PROJECT_PRIORITY_OPTIONS,
  generateProjectKey,
  type ProjectFormValues,
} from '../../../../data/workspace-project-form';
import { useAssignableProjectMembers } from '../../../../hooks/use-workspace-projects';
import { getInitial } from '../../../../lib/helper';
import { cn } from '../../../../lib/utils';
import DatePicker, { parseDatePickerValue } from '../../../ui/date-picker';
import { Paragraph, Text } from '../../../ui/typography';

const disablePastDates = (current: Dayjs) => current.isBefore(dayjs(), 'day');

type ProjectFormFieldsProps = {
  values: ProjectFormValues;
  isKeyManual: boolean;
  onChange: (values: ProjectFormValues) => void;
  onKeyManualChange: (manual: boolean) => void;
  canAssignLead: boolean;
  requiresDeliveryLead: boolean;
  showExecutionSquad: boolean;
  disabled?: boolean;
  currentUserId?: string;
  currentUserName?: string;
};

const ROLE_LABELS: Record<string, string> = {
  manager: 'Manager',
  admin: 'Admin',
};

function ProjectFormFields({
  values,
  isKeyManual,
  onChange,
  onKeyManualChange,
  canAssignLead,
  requiresDeliveryLead,
  showExecutionSquad,
  disabled = false,
  currentUserId,
  currentUserName,
}: ProjectFormFieldsProps) {
  const [memberSearch, setMemberSearch] = useState('');
  const { data: assignableMembers = [], isLoading: membersLoading } = useAssignableProjectMembers();

  const leadOptions = useMemo(
    () =>
      assignableMembers
        .filter((member) => PROJECT_LEAD_ROLES.includes(member.role))
        .map((member) => ({
          value: member.id,
          label: `${member.name} (${ROLE_LABELS[member.role] ?? member.role})`,
        })),
    [assignableMembers],
  );

  const selectedLead = useMemo(() => {
    if (canAssignLead) {
      return assignableMembers.find((member) => member.id === values.leadUserId) ?? null;
    }

    if (currentUserId) {
      return assignableMembers.find((member) => member.id === currentUserId) ?? null;
    }

    return null;
  }, [assignableMembers, canAssignLead, currentUserId, values.leadUserId]);

  const squadPool = useMemo(
    () => assignableMembers.filter((member) => member.role === 'member'),
    [assignableMembers],
  );

  const selectedMembers = useMemo(
    () =>
      squadPool.filter(
        (member) => values.memberIds.includes(member.id) && member.id !== values.leadUserId,
      ),
    [squadPool, values.leadUserId, values.memberIds],
  );

  const availableMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    return squadPool.filter((member) => {
      if (member.id === values.leadUserId) return false;
      if (values.memberIds.includes(member.id)) return false;
      if (!query) return true;

      return (
        member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
      );
    });
  }, [memberSearch, squadPool, values.leadUserId, values.memberIds]);

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

  const handleLeadChange = (leadUserId: string) => {
    updateValues({
      leadUserId,
      memberIds: values.memberIds.filter((memberId) => memberId !== leadUserId),
    });
  };

  const handleAddMember = (memberId: string) => {
    if (values.memberIds.includes(memberId) || memberId === values.leadUserId) return;
    updateValues({ memberIds: [...values.memberIds, memberId] });
    setMemberSearch('');
  };

  const handleRemoveMember = (memberId: string) => {
    updateValues({ memberIds: values.memberIds.filter((id) => id !== memberId) });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <Text as="p" size="sm" weight="semibold">
          Project Identity
        </Text>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-foreground"
              htmlFor="project-name"
            >
              Project Name
            </label>
            <Input
              id="project-name"
              value={values.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="e.g. Q4 Website Rebrand"
              size="large"
              className="rounded-xl!"
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            className="mb-2 block text-sm font-medium text-foreground"
            htmlFor="project-description"
          >
            Description
          </label>
          <Input.TextArea
            id="project-description"
            value={values.description}
            onChange={(event) => updateValues({ description: event.target.value })}
            rows={4}
            placeholder="What is this project about?"
            className="rounded-xl!"
            disabled={disabled}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <Text as="p" size="sm" weight="semibold">
          Delivery Lead
        </Text>
        <Paragraph size="sm" className="mt-1">
          {canAssignLead
            ? requiresDeliveryLead
              ? 'Assign a manager to run delivery. Owners oversee projects without joining the execution squad.'
              : 'Choose who leads day-to-day delivery. You can assign another manager or keep yourself as lead.'
            : 'You will lead this project and manage tasks for your execution team.'}
        </Paragraph>

        {canAssignLead ? (
          <div className="mt-4">
            <label
              className="mb-2 block text-sm font-medium text-foreground"
              htmlFor="project-lead"
            >
              Delivery Lead {requiresDeliveryLead ? <span className="text-red-500">*</span> : null}
            </label>
            <Select
              id="project-lead"
              showSearch
              optionFilterProp="label"
              value={values.leadUserId ?? undefined}
              onChange={handleLeadChange}
              options={leadOptions}
              placeholder="Select a manager or admin"
              size="large"
              className="w-full"
              disabled={disabled}
            />
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserOutlined />
            </span>
            <span>
              <Text as="span" size="sm" weight="semibold" className="block">
                {currentUserName ?? 'You'}
              </Text>
              <Text as="span" size="xs" color="muted" className="block">
                Delivery lead on this project
              </Text>
            </span>
          </div>
        )}

        {selectedLead ? (
          <Paragraph size="xs" className="mt-3">
            {selectedLead.name} will own task planning, assignments, and squad coordination.
          </Paragraph>
        ) : null}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <Text as="p" size="sm" weight="semibold">
          Planning
        </Text>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
            <Select
              value={values.category}
              onChange={(category) => updateValues({ category })}
              options={PROJECT_CATEGORY_OPTIONS}
              size="large"
              className="w-full"
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
            <DatePicker
              value={values.startDate || undefined}
              onChange={(startDate) => updateValues({ startDate: startDate ?? '' })}
              className="w-full"
              disabled={disabled}
              disabledDate={disablePastDates}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Due Date</label>
            <DatePicker
              value={values.dueDate || undefined}
              onChange={(dueDate) => updateValues({ dueDate: dueDate ?? '' })}
              className="w-full"
              disabled={disabled}
              allowClear
              disabledDate={(current) => {
                if (disablePastDates(current)) return true;
                const start = parseDatePickerValue(values.startDate);
                return !!start && current.isBefore(start, 'day');
              }}
            />
          </div>
        </div>
      </section>

      {showExecutionSquad ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Text as="p" size="sm" weight="semibold">
                Execution Squad
              </Text>
              <Paragraph size="sm" className="mt-1">
                Add workspace members who will do the work. Admins and owners are not listed here —
                you are the delivery lead.
              </Paragraph>
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
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                    member.avatarColor,
                  )}
                >
                  {getInitial(member.name)}
                </span>
                {member.name}
                <Button
                  type="text"
                  size="small"
                  disabled={disabled}
                  onClick={() => handleRemoveMember(member.id)}
                  icon={<CloseOutlined className="text-xs!" />}
                  aria-label={`Remove ${member.name}`}
                  className="text-muted hover:text-foreground!"
                />
              </span>
            ))}
          </div>

          <div className="mt-4">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-muted" />}
              placeholder="Search team members..."
              value={memberSearch}
              onChange={(event) => setMemberSearch(event.target.value)}
              size="large"
              className="rounded-xl!"
              disabled={disabled}
            />
          </div>

          <div className="mt-4 space-y-2">
            {membersLoading ? (
              <Paragraph size="sm">Loading team members...</Paragraph>
            ) : availableMembers.length === 0 ? (
              <Paragraph size="sm">No workspace members available to add.</Paragraph>
            ) : (
              availableMembers.map((member) => (
                <Button
                  key={member.id}
                  type="default"
                  block
                  disabled={disabled}
                  onClick={() => handleAddMember(member.id)}
                  className="h-auto w-fit! justify-between rounded-xl border-border bg-background px-4 py-8! text-left shadow-none hover:border-primary/25 hover:bg-feature-sync/40!"
                >
                  <span className="flex items-start gap-3">
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold shadow-sm',
                        member.avatarColor,
                      )}
                    >
                      {getInitial(member.name)}
                    </span>
                    <span>
                      <Text as="span" size="sm" weight="semibold" className="block text-start">
                        {member.name}
                      </Text>
                      <Text as="span" size="xs" color="muted" className="block text-start">
                        {member.email}
                      </Text>
                    </span>
                  </span>
                  <PlusOutlined className="text-primary" />
                </Button>
              ))
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default React.memo(ProjectFormFields);
