import { UserOutlined } from "@ant-design/icons";
import { Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import { USER_ROLE_FILTER_OPTIONS, type UserRecord } from "../../../data/admin-users";
import { useUpdateAdminUser } from "../../../hooks/use-admin-users";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import Modal from "../../ui/modal";
import { Paragraph } from "../../ui/typography";

type UserEditFormValues = {
  fullName: string;
  role: UserRecord["role"];
};

type UserEditModalProps = {
  record: UserRecord | null;
  onClose: () => void;
};

function UserEditModal({ record, onClose }: UserEditModalProps) {
  const [form] = Form.useForm<UserEditFormValues>();
  const { mutateAsync: updateUser, isPending } = useUpdateAdminUser();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ fullName: record.name, role: record.role });
    }
  }, [record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const result = await updateUser({
        id: record!.id,
        data: { fullName: values.fullName, role: values.role },
      });
      showApiSuccessToast((result as unknown as { message?: string }).message ?? "User updated successfully.");
      onClose();
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) return;
      showApiErrorToast(error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={record !== null}
      onCancel={handleClose}
      onOk={() => void handleOk()}
      okText="Save changes"
      cancelText="Cancel"
      confirmLoading={isPending}
      title={
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>Edit user</span>
        </div>
      }
      width={480}
    >
      {record ? (
        <>
          <Paragraph size="sm" color="muted" className="mb-4!">
            Update the name and role for <strong>{record.name}</strong>.
          </Paragraph>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              name="fullName"
              label="Full name"
              rules={[{ required: true, message: "Please enter the full name" }]}
            >
              <Input placeholder="Full name" className="rounded-xl! border-border! bg-background!" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                options={USER_ROLE_FILTER_OPTIONS}
                placeholder="Select a role"
                className="w-full [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-border! [&_.ant-select-selector]:bg-background!"
              />
            </Form.Item>
          </Form>
        </>
      ) : null}
    </Modal>
  );
}

export default React.memo(UserEditModal);
