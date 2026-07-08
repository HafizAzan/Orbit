import { Button, Form, Input, Select } from "antd";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/app-context";
import { useTransferOrganizationOwnership } from "../../../hooks/use-workspace-organization";
import { useLogout } from "../../../hooks/user-authentication";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import { clearAuthSession } from "../../../lib/auth-session";
import { UN_AUTH_ROUTES } from "../../../router/public-routes";
import type { OrganizationMember } from "../../../types/organization.types";
import Modal from "../../ui/modal";
import { Label, Paragraph, Text, Title } from "../../ui/typography";

type TransferOwnershipModalProps = {
  open: boolean;
  onClose: () => void;
  members: OrganizationMember[];
};

type TransferOwnershipFormValues = {
  targetMemberId: string;
  password: string;
};

function TransferOwnershipModal({ open, onClose, members }: TransferOwnershipModalProps) {
  const [form] = Form.useForm<TransferOwnershipFormValues>();
  const navigate = useNavigate();
  const app = useAppContext();
  const { mutateAsync: transferOwnership, isPending } = useTransferOrganizationOwnership();
  const { mutateAsync: logout } = useLogout();

  const adminOptions = useMemo(
    () =>
      members
        .filter((member) => member.role === "admin" && member.accountStatus === "active")
        .map((member) => ({
          value: member.id,
          label: `${member.fullName} (${member.email})`,
        })),
    [members],
  );

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleFinish = async (values: TransferOwnershipFormValues) => {
    try {
      const result = await transferOwnership({
        targetMemberId: values.targetMemberId,
        password: values.password,
      });

      showApiSuccessToast(result.message);
      handleClose();

      if (result.requiresReauth) {
        try {
          await logout();
        } catch {
          // Session may already be invalid after role change.
        }

        clearAuthSession();
        app?.setUser(null);
        navigate(UN_AUTH_ROUTES.LOGIN, { replace: true });
      }
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={480} destroyOnHidden>
      <div className="space-y-5">
        <div>
          <Title level={4} className="mb-1! text-foreground">
            Transfer organization ownership
          </Title>
          <Paragraph size="sm" color="muted" className="mb-0!">
            Choose an admin to become the new owner. You will become an admin and must sign in again.
          </Paragraph>
        </div>

        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
          <Form.Item
            name="targetMemberId"
            label={<Label>New owner</Label>}
            rules={[{ required: true, message: "Select an admin to transfer ownership to" }]}
          >
            <Select
              size="large"
              placeholder={adminOptions.length ? "Select workspace admin" : "No active admins available"}
              options={adminOptions}
              disabled={adminOptions.length === 0}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Label>Confirm your password</Label>}
            rules={[
              { required: true, message: "Enter your password to confirm" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password size="large" placeholder="••••••••" className="rounded-lg!" />
          </Form.Item>

          <Text as="p" size="sm" color="muted" className="mb-4">
            Billing contact email will move to the new owner after transfer.
          </Text>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button size="large" className="rounded-xl! font-medium!" disabled={isPending} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isPending}
              disabled={adminOptions.length === 0}
              className="rounded-xl! font-semibold!"
            >
              Transfer ownership
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default React.memo(TransferOwnershipModal);
