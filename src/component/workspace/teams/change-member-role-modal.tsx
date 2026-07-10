import { Button, Form, Select } from "antd";
import React, { useEffect } from "react";
import {
  TEAM_INVITE_ROLE_OPTIONS,
  TEAM_ROLE_LABELS,
  type TeamInviteRole,
  type TeamMember,
} from "../../../data/workspace-teams";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { useUpdateTeamMemberRole } from "../../../hooks/use-workspace-team";
import Modal from "../../ui/modal";
import { Label, Paragraph, Title } from "../../ui/typography";
import MembershipAiImpactNote from "./membership-ai-impact-note";

type ChangeMemberRoleModalProps = {
  member: TeamMember | null;
  onClose: () => void;
};

type ChangeRoleFormValues = {
  role: TeamInviteRole;
};

function ChangeMemberRoleModal({ member, onClose }: ChangeMemberRoleModalProps) {
  const [form] = Form.useForm<ChangeRoleFormValues>();
  const { mutateAsync: updateRole, isPending } = useUpdateTeamMemberRole();
  const selectedRole = Form.useWatch("role", form);

  useEffect(() => {
    if (!member) return;

    if (member.role === "owner") {
      form.resetFields();
      return;
    }

    form.setFieldsValue({ role: member.role as TeamInviteRole });
  }, [form, member]);

  const handleFinish = async (values: ChangeRoleFormValues) => {
    if (!member) return;

    try {
      await updateRole({ memberId: member.id, data: { role: values.role } });
      showApiSuccessToast(`${member.name}'s role updated to ${TEAM_ROLE_LABELS[values.role]}.`);
      onClose();
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <Modal
      open={member !== null}
      onCancel={onClose}
      footer={null}
      width={420}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0!",
      }}
    >
      <div className="px-6 pt-6 pb-5">
        <Title level={4} className="mb-0! text-foreground">
          Change Role
        </Title>
        <Paragraph size="sm" className="mt-1 mb-0! text-muted">
          Update workspace permissions for {member?.name}.
        </Paragraph>

        <Form form={form} layout="vertical" className="mt-5" onFinish={handleFinish}>
          <Form.Item
            name="role"
            label={<Label>Role</Label>}
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select size="large" options={TEAM_INVITE_ROLE_OPTIONS} className="w-full" />
          </Form.Item>
        </Form>

        {member && selectedRole ? (
          <div className="mt-4">
            <MembershipAiImpactNote
              changeType="role_change"
              changeContext={JSON.stringify({
                memberName: member.name,
                currentRole: member.role,
                nextRole: selectedRole,
              })}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Button size="large" onClick={onClose} disabled={isPending} className="font-medium!">
          Cancel
        </Button>
        <Button type="primary" size="large" loading={isPending} onClick={() => form.submit()} className="font-semibold!">
          Save Role
        </Button>
      </div>
    </Modal>
  );
}

export default React.memo(ChangeMemberRoleModal);
