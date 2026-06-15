import { MailOutlined, SafetyOutlined } from "@ant-design/icons";
import { Button, Form, Input, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { EMAIL_CHANGE_STEPS } from "../../../data/admin-profile";
import Modal from "../../ui/modal";
import { Label } from "../../ui/typography";

type ProfileEmailChangeProfile = {
  email: string;
};

type ProfileEmailChangeModalProps = {
  open: boolean;
  profile: ProfileEmailChangeProfile;
  loading?: boolean;
  onClose: () => void;
  onInitiate: (newEmail: string, currentPassword: string) => Promise<boolean>;
  onComplete: (newEmail: string, otp: string) => Promise<boolean>;
};

type CredentialsFormValues = {
  newEmail: string;
  currentPassword: string;
};

type OtpFormValues = {
  otp: string;
};

function ProfileEmailChangeModal({
  open,
  profile,
  loading = false,
  onClose,
  onInitiate,
  onComplete,
}: ProfileEmailChangeModalProps) {
  const [step, setStep] = useState(0);
  const [pendingEmail, setPendingEmail] = useState("");
  const [credentialsForm] = Form.useForm<CredentialsFormValues>();
  const [otpForm] = Form.useForm<OtpFormValues>();

  useEffect(() => {
    if (!open) {
      setStep(0);
      setPendingEmail("");
      credentialsForm.resetFields();
      otpForm.resetFields();
    }
  }, [open, credentialsForm, otpForm]);

  const handleCredentialsSubmit = async (values: CredentialsFormValues) => {
    const success = await onInitiate(values.newEmail, values.currentPassword);
    if (success) {
      setPendingEmail(values.newEmail.trim().toLowerCase());
      setStep(1);
    }
  };

  const handleOtpSubmit = async (values: OtpFormValues) => {
    const success = await onComplete(pendingEmail, values.otp);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      title={
        <div className="flex items-center gap-3">
          <MailOutlined className="text-xl text-primary" />
          <span className="text-lg font-semibold text-foreground">Change email address</span>
        </div>
      }
    >
      <Steps
        size="small"
        current={step}
        className="mb-6"
        items={[{ title: "Verify" }, { title: "Confirm OTP" }]}
      />

      <ul className="mb-6 space-y-2 rounded-xl border border-border bg-background p-4">
        {EMAIL_CHANGE_STEPS.map((item, index) => (
          <li key={item} className="flex gap-2 text-xs text-muted">
            <span className="font-semibold text-primary">{index + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {step === 0 ? (
        <Form form={credentialsForm} layout="vertical" requiredMark={false} onFinish={handleCredentialsSubmit}>
          <Form.Item
            name="newEmail"
            label={<Label>New email address</Label>}
            rules={[
              { required: true, message: "Please enter a new email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input size="large" placeholder="you@company.com" autoComplete="email" className="rounded-xl! bg-card!" />
          </Form.Item>

          <Form.Item
            name="currentPassword"
            label={<Label>Current password</Label>}
            rules={[{ required: true, message: "Please enter your current password" }]}
            extra={<span className="text-xs text-muted">Required to confirm it&apos;s really you.</span>}
          >
            <Input.Password
              size="large"
              placeholder="Enter current password"
              autoComplete="current-password"
              className="rounded-xl! bg-card!"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={onClose} className="font-medium!">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="font-semibold!">
              Send OTP
            </Button>
          </div>
        </Form>
      ) : (
        <Form form={otpForm} layout="vertical" requiredMark={false} onFinish={handleOtpSubmit}>
          <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-foreground">
            <SafetyOutlined className="mr-2 text-primary" />
            OTP sent to <span className="font-semibold">{pendingEmail}</span>
          </div>

          <Form.Item
            name="otp"
            label={<Label>6-digit verification code</Label>}
            rules={[
              { required: true, message: "Please enter the OTP" },
              { len: 6, message: "OTP must be 6 digits" },
            ]}
          >
            <Input
              size="large"
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              className="rounded-xl! bg-card! tracking-[0.3em]!"
            />
          </Form.Item>

          <div className="flex justify-between gap-2 pt-2">
            <Button onClick={() => setStep(0)} className="font-medium!">
              Back
            </Button>
            <div className="flex gap-2">
              <Button onClick={onClose} className="font-medium!">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} className="font-semibold!">
                Confirm email
              </Button>
            </div>
          </div>
        </Form>
      )}

      <p className="mt-4 text-xs text-muted">Current email on file: {profile.email}</p>
    </Modal>
  );
}

export default React.memo(ProfileEmailChangeModal);
