import {
  CheckCircleFilled,
  CheckOutlined,
  InfoCircleOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  findTeamMemberByEmail,
  getDuplicateInviteMessage,
  TEAM_DEPARTMENT_OPTIONS,
  TEAM_INVITE_ROLE_OPTIONS,
  TEAM_ROLE_PERMISSIONS,
  type TeamInvitePayload,
  type TeamInviteRole,
  type TeamMemberDepartment,
} from "../../../data/workspace-teams";
import { useInviteTeamMember, useTeamMembers, useTeamStats } from "../../../hooks/use-workspace-team";
import { mapApiTeamMemberToTeamMember, mapTeamInvitePayloadToRequest } from "../../../types/team.types";
import { normalizeEmail } from "../../../lib/helper";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { cn } from "../../../lib/utils";
import Modal from "../../ui/modal";
import { Label, Paragraph, Text, Title } from "../../ui/typography";

type InviteMemberModalProps = {
  open: boolean;
  onClose: () => void;
};

type InviteMemberFormValues = {
  email: string;
  name?: string;
  role: TeamInviteRole;
  department: TeamMemberDepartment;
  message?: string;
  sendWelcomeEmail: boolean;
};

type InviteModalStep = "form" | "success";

const DEFAULT_FORM_VALUES: InviteMemberFormValues = {
  email: "",
  name: "",
  role: "member",
  department: "engineering",
  message: "",
  sendWelcomeEmail: true,
};

function SeatUsageBanner({
  used,
  total,
}: {
  used: number;
  total: number;
}) {
  const remainingSeats = total - used;
  const seatUsagePercent = total > 0 ? Math.round((used / total) * 100) : 0;
  const isFull = remainingSeats <= 0;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        isFull ? "border-amber-200 bg-amber-50/80" : "border-border bg-background/70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Text as="p" size="sm" className="font-semibold text-foreground">
            {isFull ? "No seats available" : `${remainingSeats} seat${remainingSeats === 1 ? "" : "s"} remaining`}
          </Text>
          <Paragraph size="xs" className="mt-1 mb-0! text-muted">
            {used} of {total} seats used in your workspace.
          </Paragraph>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
            isFull ? "bg-amber-100 text-amber-700" : "bg-feature-sync text-primary",
          )}
        >
          {seatUsagePercent}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all", isFull ? "bg-amber-500" : "bg-primary")}
          style={{ width: `${Math.min(seatUsagePercent, 100)}%` }}
        />
      </div>
    </div>
  );
}

const MODAL_SHELL_CLASS = "flex min-h-[min(420px,70vh)] max-h-[min(720px,85vh)] flex-col";

function InviteSuccessContent({ email, role }: { email: string; role: TeamInviteRole }) {
  const roleInfo = TEAM_ROLE_PERMISSIONS[role];

  return (
    <div className="px-6 py-8 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <CheckCircleFilled className="text-3xl" />
      </span>

      <Title level={4} className="mt-5 mb-0! text-foreground">
        Invitation sent
      </Title>
      <Paragraph size="sm" className="mx-auto mt-2 mb-0! max-w-sm text-muted">
        We emailed <span className="font-semibold text-foreground">{email}</span> with instructions to join as{" "}
        <span className="font-semibold text-foreground">{roleInfo.title}</span>.
      </Paragraph>

      <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-border bg-background/60 px-4 py-3 text-left">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MailOutlined className="text-primary" />
          What happens next
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          <li>They receive a secure invite link valid for 7 days.</li>
          <li>Once accepted, they appear in your team list as Active.</li>
          <li>You can resend or revoke the invite anytime.</li>
        </ul>
      </div>
    </div>
  );
}

function InviteMemberModal({ open, onClose }: InviteMemberModalProps) {
  const [form] = Form.useForm<InviteMemberFormValues>();
  const { data: stats } = useTeamStats();
  const { data: membersPage } = useTeamMembers({ limit: 100 });
  const { mutateAsync: inviteMember, isPending } = useInviteTeamMember();
  const [step, setStep] = useState<InviteModalStep>("form");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedRole, setInvitedRole] = useState<TeamInviteRole>(DEFAULT_FORM_VALUES.role);

  const members = useMemo(
    () => (membersPage?.data ?? []).map(mapApiTeamMemberToTeamMember),
    [membersPage?.data],
  );

  const selectedRole = Form.useWatch("role", form) ?? DEFAULT_FORM_VALUES.role;
  const permissions = TEAM_ROLE_PERMISSIONS[selectedRole];

  const totalSeats = stats?.totalSeats ?? { used: 0, total: 0 };
  const remainingSeats = totalSeats.total - totalSeats.used;
  const seatsAvailable = remainingSeats > 0;

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setStep("form");
      setInvitedEmail("");
      setInvitedRole(DEFAULT_FORM_VALUES.role);
    }
  }, [form, open]);

  const validateEmailAvailability = async (_: unknown, value: string) => {
    if (!value?.trim()) return;

    const normalized = normalizeEmail(value);
    const existing = findTeamMemberByEmail(normalized, members);

    if (!existing) return;

    throw new Error(getDuplicateInviteMessage(existing));
  };

  const resetToForm = () => {
    form.resetFields();
    setStep("form");
    setInvitedEmail("");
    setInvitedRole(DEFAULT_FORM_VALUES.role);
  };

  const handleFinish = async (values: InviteMemberFormValues) => {
    if (!seatsAvailable) {
      showApiErrorToast(new Error("No seats available. Upgrade your plan or free up a seat first."));
      return;
    }

    const normalizedEmail = normalizeEmail(values.email);
    const existingMember = findTeamMemberByEmail(normalizedEmail, members);

    if (existingMember) {
      showApiErrorToast(new Error(getDuplicateInviteMessage(existingMember)));
      return;
    }

    const payload: TeamInvitePayload = {
      email: normalizedEmail,
      name: values.name?.trim() || undefined,
      role: values.role,
      department: values.department,
      message: values.message?.trim() || undefined,
      sendWelcomeEmail: values.sendWelcomeEmail,
    };

    try {
      await inviteMember(mapTeamInvitePayloadToRequest(payload));
      setInvitedEmail(normalizedEmail);
      setInvitedRole(values.role);
      setStep("success");
      showApiSuccessToast(`Invitation sent to ${normalizedEmail}`);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const handleInviteAnother = () => {
    resetToForm();
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={!isPending}
      maskClosable={!isPending && step === "form"}
      width={step === "success" ? 460 : 540}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0! max-h-[85vh]! overflow-hidden!",
      }}
    >
      {step === "success" ? (
        <div className={MODAL_SHELL_CLASS}>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <InviteSuccessContent email={invitedEmail} role={invitedRole} />
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-center">
            <Button size="large" onClick={handleDone} className="h-11! rounded-xl! font-medium! sm:min-w-32">
              Done
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={handleInviteAnother}
              className="h-11! rounded-xl! font-semibold! sm:min-w-40"
            >
              Invite Another
            </Button>
          </div>
        </div>
      ) : (
        <div className={MODAL_SHELL_CLASS}>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="px-6 pt-6 pb-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-feature-sync text-primary">
                  <UserAddOutlined className="text-lg" />
                </span>
                <div className="min-w-0">
                  <Title level={4} className="mb-0! text-foreground">
                    Invite Team Member
                  </Title>
                  <Paragraph size="sm" className="mt-1 mb-0! text-muted">
                    Send a secure invite link and assign a role before they join your workspace.
                  </Paragraph>
                </div>
              </div>

              <div className="mt-5">
                <SeatUsageBanner used={totalSeats.used} total={totalSeats.total} />
              </div>

              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={DEFAULT_FORM_VALUES}
                className="mt-5 space-y-4 [&_.ant-form-item]:mb-0!"
                onFinish={handleFinish}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Form.Item
                    name="email"
                    label={<Label>Email Address</Label>}
                    className="sm:col-span-2"
                    rules={[
                      { required: true, message: "Please enter an email address" },
                      { type: "email", message: "Please enter a valid email address" },
                      { validator: validateEmailAvailability },
                    ]}
                    validateTrigger={["onBlur", "onChange"]}
                  >
                    <Input
                      size="large"
                      prefix={<MailOutlined className="text-muted" />}
                      placeholder="e.g. alex@example.com"
                      autoComplete="email"
                      className="rounded-xl! border-border! bg-card!"
                    />
                  </Form.Item>

                  <Form.Item name="name" label={<Label>Full Name</Label>} extra="Optional — helps personalize the invite email.">
                    <Input
                      size="large"
                      placeholder="e.g. Alex Johnson"
                      autoComplete="name"
                      className="rounded-xl! border-border! bg-card!"
                    />
                  </Form.Item>

                  <Form.Item
                    name="department"
                    label={<Label>Department</Label>}
                    rules={[{ required: true, message: "Please select a department" }]}
                  >
                    <Select
                      size="large"
                      options={TEAM_DEPARTMENT_OPTIONS}
                      placeholder="Select department"
                      className="w-full"
                    />
                  </Form.Item>
                </div>

                <div>
                  <Label className="mb-2 block">Role</Label>
                  <Form.Item name="role" rules={[{ required: true, message: "Please select a role" }]}>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {TEAM_INVITE_ROLE_OPTIONS.map((option) => {
                        const isSelected = selectedRole === option.value;
                        const roleInfo = TEAM_ROLE_PERMISSIONS[option.value];

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => form.setFieldValue("role", option.value)}
                            className={cn(
                              "flex flex-col items-start gap-2 rounded-xl border px-3.5 py-3 text-left transition-all",
                              isSelected
                                ? "border-primary bg-feature-sync shadow-sm"
                                : "border-border bg-card hover:border-primary/25",
                            )}
                          >
                            <span className="flex w-full items-center gap-2">
                              <span
                                className={cn(
                                  "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide",
                                  roleInfo.accent,
                                )}
                              >
                                {roleInfo.title}
                              </span>
                              {isSelected ? <CheckOutlined className="ml-auto text-xs text-primary" /> : null}
                            </span>
                            <span className="text-xs leading-relaxed text-muted">{roleInfo.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Form.Item>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-feature-sync/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <InfoCircleOutlined />
                    {permissions.title} permissions
                  </p>
                  <ul className="mt-3 space-y-2">
                    {permissions.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-muted">
                        <CheckOutlined className="mt-0.5 shrink-0 text-xs text-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Form.Item
                  name="message"
                  label={<Label>Personal Message</Label>}
                  extra="Optional note included in the invitation email."
                >
                  <Input.TextArea
                    rows={3}
                    maxLength={280}
                    showCount
                    placeholder="Welcome to the team! Looking forward to working with you."
                    className="rounded-xl! border-border! bg-card!"
                  />
                </Form.Item>

                <Form.Item name="sendWelcomeEmail" valuePropName="checked" className="mb-0!">
                  <Checkbox className="text-sm text-muted">Send welcome email with workspace overview</Checkbox>
                </Form.Item>
              </Form>
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              size="large"
              onClick={onClose}
              disabled={isPending}
              className="h-11! rounded-xl! font-medium! sm:min-w-30"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={isPending}
              disabled={!seatsAvailable}
              onClick={() => form.submit()}
              className="h-11! rounded-xl! font-semibold! sm:min-w-40"
            >
              Send Invitation
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default React.memo(InviteMemberModal);
