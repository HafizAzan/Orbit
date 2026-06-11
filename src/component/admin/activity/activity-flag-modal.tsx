import { FlagOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import { ACTIVITY_FLAG_REASON_OPTIONS, type ActivityFlagReason, type ActivityRecord } from "../../../data/admin-activity";
import type { FlagActivityInput } from "../../../lib/activity-review";
import Modal from "../../ui/modal";
import { Paragraph, Text, Title } from "../../ui/typography";

type ActivityFlagModalProps = {
  open: boolean;
  record: ActivityRecord | null;
  onClose: () => void;
  onSubmit: (id: string, input: FlagActivityInput) => void;
};

type ActivityFlagFormValues = {
  reason: ActivityFlagReason;
  note?: string;
};

function ActivityFlagModal({ open, record, onClose, onSubmit }: ActivityFlagModalProps) {
  const [form] = Form.useForm<ActivityFlagFormValues>();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      reason: record?.flagReason ?? "other",
      note: record?.flagNote ?? "",
    });
  }, [form, open, record]);

  const handleSubmit = async () => {
    if (!record) return;

    const values = await form.validateFields();
    onSubmit(record.id, {
      reason: values.reason,
      note: values.note,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={520}
      title={
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FlagOutlined className="text-lg" />
          </span>
          <div>
            <Title level={5} className="mb-0! text-base! text-foreground!">
              Flag for review
            </Title>
            <Paragraph size="xs" className="mb-0! text-muted">
              {record?.title ?? "Add this event to the manual review queue"}
            </Paragraph>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" icon={<FlagOutlined />} onClick={() => void handleSubmit()} className="font-semibold!">
            Flag event
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false} initialValues={{ reason: "other" }}>
        <section className="rounded-2xl border border-border bg-background/50 p-4">
          <Text as="p" size="sm" className="font-semibold text-foreground">
            Review details
          </Text>
          <Paragraph size="xs" className="mt-1 mb-0! text-muted">
            Choose a reason so reviewers can prioritize this event.
          </Paragraph>

          <div className="mt-4 space-y-4">
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: "Select a review reason" }]}
            >
              <Select options={ACTIVITY_FLAG_REASON_OPTIONS} placeholder="Select reason" />
            </Form.Item>

            <Form.Item name="note" label="Notes (optional)">
              <Input.TextArea rows={3} placeholder="Add context for the review team..." maxLength={500} showCount />
            </Form.Item>
          </div>
        </section>
      </Form>
    </Modal>
  );
}

export default React.memo(ActivityFlagModal);
