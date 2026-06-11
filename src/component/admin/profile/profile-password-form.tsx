import { KeyOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FORGOT_PASSWORD_FLOW_STEPS, FORGOT_PASSWORD_NOTE, PROFILE_PASSWORD_HINTS } from "../../../data/admin-profile";
import type { ChangeAdminPasswordInput } from "../../../lib/admin-profile";
import { maskEmail, validatePasswordStrength } from "../../../lib/helper";
import { UN_AUTH_ROUTES } from "../../../router/public-routes";
import Modal from "../../ui/modal";
import { Label } from "../../ui/typography";

type ProfilePasswordFormProps = {
  email: string;
  loading?: boolean;
  resettingPassword?: boolean;
  onSubmit: (input: ChangeAdminPasswordInput) => Promise<boolean>;
  onSendResetLink: (email: string) => Promise<boolean>;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ProfilePasswordForm({
  email,
  loading = false,
  resettingPassword = false,
  onSubmit,
  onSendResetLink,
}: ProfilePasswordFormProps) {
  const [form] = Form.useForm<PasswordFormValues>();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleFinish = async (values: PasswordFormValues) => {
    const success = await onSubmit({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (success) {
      form.resetFields();
    }
  };

  const handleSendResetLink = async () => {
    const success = await onSendResetLink(email);
    if (success) {
      setResetModalOpen(false);
    }
  };

  return (
    <>
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
          <p className="mt-1 text-sm text-muted">Know your current password? Update it here. Otherwise use the reset link flow.</p>
        </div>

        <ul className="mb-6 grid gap-2 sm:grid-cols-2">
          {PROFILE_PASSWORD_HINTS.map((hint) => (
            <li key={hint} className="flex items-start gap-2 text-xs text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {hint}
            </li>
          ))}
        </ul>

        <Form form={form} layout="vertical" requiredMark={false} className="[&_.ant-form-item]:mb-5" onFinish={handleFinish}>
          <Form.Item
            name="currentPassword"
            label={<Label>Current password</Label>}
            rules={[{ required: true, message: "Please enter your current password" }]}
            extra={
              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                className="text-sm font-medium text-primary hover:opacity-80"
              >
                Forgot current password?
              </button>
            }
          >
            <Input.Password
              size="large"
              placeholder="Enter current password"
              autoComplete="current-password"
              className="rounded-xl! bg-background!"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-4">
            <Form.Item
              name="newPassword"
              label={<Label>New password</Label>}
              dependencies={["currentPassword"]}
              rules={[
                { required: true, message: "Please enter a new password" },
                {
                  validator: (_, value) => {
                    const message = validatePasswordStrength(value ?? "");
                    return message ? Promise.reject(new Error(message)) : Promise.resolve();
                  },
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("currentPassword") !== value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("New password must be different from your current password"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter new password"
                autoComplete="new-password"
                className="rounded-xl! bg-background!"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<Label>Confirm new password</Label>}
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="rounded-xl! bg-background!"
              />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<KeyOutlined />} className="font-semibold!">
            Update Password
          </Button>
        </Form>
      </article>

      <Modal
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        footer={null}
        width={520}
        title={
          <div className="flex items-center gap-3">
            <MailOutlined className="text-xl text-primary" />
            <span className="text-lg font-semibold text-foreground">Reset via email</span>
          </div>
        }
      >
        <p className="mb-4 text-sm text-muted">{FORGOT_PASSWORD_NOTE}</p>

        <ul className="mb-5 space-y-2 rounded-xl border border-border bg-background p-4">
          {FORGOT_PASSWORD_FLOW_STEPS.map((step, index) => (
            <li key={step} className="flex gap-2 text-xs text-muted">
              <span className="font-semibold text-primary">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>

        <p className="mb-4 text-sm text-foreground">
          Reset link will be sent to: <span className="font-semibold">{maskEmail(email)}</span>
        </p>

        <div className="flex flex-wrap justify-end gap-2">
          <Button onClick={() => setResetModalOpen(false)} className="font-medium!">
            Cancel
          </Button>
          <Button type="primary" loading={resettingPassword} onClick={handleSendResetLink} className="font-semibold!">
            Send reset link
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          Or go to{" "}
          <Link to={UN_AUTH_ROUTES.FORGOT_PASSWORD} className="font-semibold text-primary hover:opacity-80">
            forgot password page
          </Link>
        </p>
      </Modal>
    </>
  );
}

export default React.memo(ProfilePasswordForm);
