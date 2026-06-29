import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import Modal from "../../ui/modal";
import { Label } from "../../ui/typography";
import type { OrganizationMember } from "../../../types/organization.types";

type MemberEmailChangeModalProps = {
  open: boolean;
  member: OrganizationMember | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (memberId: string, email: string) => Promise<boolean>;
};

type FormValues = {
  email: string;
};

function MemberEmailChangeModal({
  open,
  member,
  loading = false,
  onClose,
  onSubmit,
}: MemberEmailChangeModalProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleFinish = async (values: FormValues) => {
    if (!member) return;

    const success = await onSubmit(member.id, values.email.trim().toLowerCase());
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      title={
        <div className="flex items-center gap-3">
          <MailOutlined className="text-xl text-primary" />
          <span className="text-lg font-semibold text-foreground">Change member email</span>
        </div>
      }
    >
      {member ? (
        <>
          <p className="mb-4 text-sm text-muted">
            Update the login email for <span className="font-semibold text-foreground">{member.fullName}</span>.
            Current email: <span className="font-medium text-foreground">{member.email}</span>
          </p>

          <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
            <Form.Item
              name="email"
              label={<Label>New email address</Label>}
              rules={[
                { required: true, message: "Please enter a new email" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                size="large"
                placeholder="member@company.com"
                autoComplete="email"
                className="rounded-xl! bg-card!"
              />
            </Form.Item>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={onClose} className="font-medium!">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} className="font-semibold!">
                Update email
              </Button>
            </div>
          </Form>
        </>
      ) : null}
    </Modal>
  );
}

export default React.memo(MemberEmailChangeModal);
