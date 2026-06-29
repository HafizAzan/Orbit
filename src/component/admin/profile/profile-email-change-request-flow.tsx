import { MailOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  getEmailChangeRequestRecipients,
  submitEmailChangeRequest,
} from "../../../api-services/auth.service";
import type { EmailChangeRequestRecipient, RegisterAs } from "../../../types/auth.types";
import { getEmailChangeRequestRecipientLabel } from "../../../lib/email-access";
import { getApiErrorMessage } from "../../../lib/api-error";
import { getWorkspaceRoleLabel } from "../../../lib/workspace-routing";
import { toast } from "../../../lib/toast";
import Modal from "../../ui/modal";
import { Label } from "../../ui/typography";

type RequestFormValues = {
  subject: string;
  newEmail: string;
  currentEmail: string;
  reason: string;
};

type ProfileEmailChangeRequestFlowProps = {
  open: boolean;
  role: RegisterAs;
  currentEmail: string;
  onClose: () => void;
};

function ProfileEmailChangeRequestFlow({
  open,
  role,
  currentEmail,
  onClose,
}: ProfileEmailChangeRequestFlowProps) {
  const [step, setStep] = useState<"form" | "recipients">("form");
  const [form] = Form.useForm<RequestFormValues>();
  const [pendingRequest, setPendingRequest] = useState<RequestFormValues | null>(null);
  const [recipients, setRecipients] = useState<EmailChangeRequestRecipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const recipientLabel = getEmailChangeRequestRecipientLabel(role);

  useEffect(() => {
    if (!open) {
      setStep("form");
      setPendingRequest(null);
      setRecipients([]);
      setSelectedRecipientIds([]);
      form.resetFields();
    } else {
      form.setFieldsValue({ currentEmail });
    }
  }, [open, currentEmail, form]);

  const allSelected = useMemo(
    () => recipients.length > 0 && selectedRecipientIds.length === recipients.length,
    [recipients.length, selectedRecipientIds.length],
  );

  const handleFormSubmit = async (values: RequestFormValues) => {
    setPendingRequest({
      ...values,
      currentEmail: values.currentEmail.trim().toLowerCase(),
      newEmail: values.newEmail.trim().toLowerCase(),
    });
    setLoadingRecipients(true);
    setStep("recipients");

    try {
      const response = await getEmailChangeRequestRecipients();
      setRecipients(response.data);
      setSelectedRecipientIds(response.data.map((recipient) => recipient.id));

      if (response.data.length === 0) {
        toast.error(`No ${recipientLabel} is available to receive this request right now.`);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Unable to load recipients.");
      setStep("form");
      setPendingRequest(null);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleSendRequest = async () => {
    if (!pendingRequest) return;

    if (selectedRecipientIds.length === 0) {
      toast.error("Select at least one recipient.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitEmailChangeRequest({
        ...pendingRequest,
        recipientIds: selectedRecipientIds,
      });
      toast.success(result.message);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Unable to send email change request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        open={open && step === "form"}
        onCancel={onClose}
        footer={null}
        width={560}
        title={
          <div className="flex items-center gap-3">
            <MailOutlined className="text-xl text-primary" />
            <span className="text-lg font-semibold text-foreground">Request email change</span>
          </div>
        }
      >
        <p className="mb-4 text-sm text-muted">
          You cannot change your login email directly. Submit a request and choose which {recipientLabel}(s)
          should receive it.
        </p>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ currentEmail }}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="subject"
            label={<Label>Subject</Label>}
            rules={[
              { required: true, message: "Please enter a subject" },
              { min: 3, message: "Subject must be at least 3 characters" },
            ]}
          >
            <Input size="large" placeholder="Request to update my login email" className="rounded-xl! bg-card!" />
          </Form.Item>

          <Form.Item
            name="newEmail"
            label={<Label>New email</Label>}
            rules={[
              { required: true, message: "Please enter your new email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input size="large" placeholder="you@company.com" autoComplete="email" className="rounded-xl! bg-card!" />
          </Form.Item>

          <Form.Item
            name="currentEmail"
            label={<Label>Old email</Label>}
            rules={[
              { required: true, message: "Current email is required" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input size="large" readOnly disabled className="rounded-xl! bg-background!" />
          </Form.Item>

          <Form.Item
            name="reason"
            label={<Label>Describe your reason</Label>}
            rules={[
              { required: true, message: "Please describe why you need this change" },
              { min: 10, message: "Please provide at least 10 characters" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Explain why you need to update your login email..."
              className="rounded-xl! bg-card!"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={onClose} className="font-medium!">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="font-semibold!">
              Continue
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={open && step === "recipients"}
        onCancel={() => {
          setStep("form");
          setPendingRequest(null);
          setRecipients([]);
          setSelectedRecipientIds([]);
        }}
        footer={null}
        width={560}
        title={
          <div className="flex items-center gap-3">
            <UserOutlined className="text-xl text-primary" />
            <span className="text-lg font-semibold text-foreground">Select recipients</span>
          </div>
        }
      >
        <p className="mb-4 text-sm text-muted">
          Choose who should receive your email change request. Only selected {recipientLabel}s will get the email.
        </p>

        {loadingRecipients ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : recipients.length === 0 ? (
          <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted">
            No eligible recipients were found. Ask your workspace owner to assign an admin first.
          </div>
        ) : (
          <div className="space-y-3">
            <Checkbox
              checked={allSelected}
              indeterminate={selectedRecipientIds.length > 0 && !allSelected}
              onChange={(event) => {
                setSelectedRecipientIds(event.target.checked ? recipients.map((recipient) => recipient.id) : []);
              }}
            >
              Select all
            </Checkbox>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-border p-3">
              {recipients.map((recipient) => (
                <label
                  key={recipient.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-background"
                >
                  <Checkbox
                    checked={selectedRecipientIds.includes(recipient.id)}
                    onChange={(event) => {
                      setSelectedRecipientIds((current) =>
                        event.target.checked
                          ? [...current, recipient.id]
                          : current.filter((id) => id !== recipient.id),
                      );
                    }}
                  />
                  <span>
                    <span className="block font-medium text-foreground">{recipient.fullName}</span>
                    <span className="block text-sm text-muted">{recipient.email}</span>
                    <span className="block text-xs text-muted">{getWorkspaceRoleLabel(recipient.role)}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between gap-2">
          <Button
            onClick={() => {
              setStep("form");
              setPendingRequest(null);
              setRecipients([]);
              setSelectedRecipientIds([]);
            }}
            className="font-medium!"
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button onClick={onClose} className="font-medium!">
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={submitting}
              disabled={recipients.length === 0}
              onClick={() => {
                void handleSendRequest();
              }}
              className="font-semibold!"
            >
              Send request
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(ProfileEmailChangeRequestFlow);
