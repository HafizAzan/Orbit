import { CheckOutlined, CreditCardOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import DatePicker from "../../ui/date-picker";
import { PLAN_STYLES, type OrganizationPlan } from "../../../data/admin-organizations";
import {
  SUBSCRIPTION_BILLING_FILTER_OPTIONS,
  SUBSCRIPTION_PLAN_FILTER_OPTIONS,
  SUBSCRIPTION_STATUS_FILTER_OPTIONS,
  SUBSCRIPTION_STATUS_STYLES,
  type BillingCycle,
  type SubscriptionRecord,
  type SubscriptionStatus,
} from "../../../data/admin-subscriptions";
import { useUpdateSubscriptionBilling } from "../../../hooks/use-admin-subscriptions";
import { showApiErrorToast } from "../../../lib/api-error";
import { formatCurrency, getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import Modal from "../../ui/modal";
import { Label, Paragraph, Text, Title } from "../../ui/typography";

type SubscriptionEditBillingModalProps = {
  open: boolean;
  record: SubscriptionRecord | null;
  onClose: () => void;
};

type SubscriptionBillingFormValues = {
  contactEmail: string;
  plan: OrganizationPlan;
  billingCycle: BillingCycle;
  renewalDate: string;
  amount: number;
  status: SubscriptionStatus;
};

type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-background/50 p-4">
      <Text as="p" size="sm" className="font-semibold text-foreground">
        {title}
      </Text>
      {description ? (
        <Paragraph size="xs" className="mt-1 mb-0! text-muted">
          {description}
        </Paragraph>
      ) : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SubscriptionEditBillingModal({ open, record, onClose }: SubscriptionEditBillingModalProps) {
  const [form] = Form.useForm<SubscriptionBillingFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: updateBilling } = useUpdateSubscriptionBilling();
  const selectedPlan = Form.useWatch("plan", form);
  const selectedBillingCycle = Form.useWatch("billingCycle", form);
  const selectedStatus = Form.useWatch("status", form);
  const amount = Form.useWatch("amount", form);

  useEffect(() => {
    if (!open || !record) {
      form.resetFields();
      setSubmitting(false);
      return;
    }

    form.setFieldsValue({
      contactEmail: record.contactEmail,
      plan: record.plan,
      billingCycle: record.billingCycle,
      renewalDate: record.renewalDate,
      amount: record.amount,
      status: record.status,
    });
  }, [open, record, form]);

  const handleFinish = async (values: SubscriptionBillingFormValues) => {
    if (!record) return;

    setSubmitting(true);

    try {
      await updateBilling({
        id: record.id,
        data: {
          contactEmail: values.contactEmail,
          plan: values.plan,
          billingCycle: values.billingCycle,
          renewalDate: values.renewalDate,
          amount: values.amount,
          status: values.status,
        },
      });
      onClose();
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable
      maskClosable={!submitting}
      width={540}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0!",
      }}
    >
      <div className="border-b border-border bg-feature-sync/30 px-6 py-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCardOutlined className="text-lg" />
          </span>
          <div className="min-w-0">
            <Title level={4} className="mb-0! text-foreground">
              Edit billing
            </Title>
            <Paragraph size="sm" className="mt-1 mb-0! text-muted">
              Update plan, billing cycle, amount, and subscription status.
            </Paragraph>
          </div>
        </div>
      </div>

      {record ? (
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="max-h-[min(72vh,38rem)] space-y-4 overflow-y-auto px-6 py-5 [&_.ant-form-item]:mb-0!"
          onFinish={handleFinish}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-feature-sync text-sm font-bold text-primary">
              {getInitial(record.organizationName)}
            </span>
            <div className="min-w-0">
              <Text as="p" size="sm" weight="semibold" className="truncate text-foreground">
                {record.organizationName}
              </Text>
              <Paragraph size="xs" className="mb-0! text-muted">
                Current amount: {formatCurrency(record.amount, "USD", 2)}
              </Paragraph>
            </div>
          </div>

          <FormSection title="Billing contact" description="Invoices and payment notices are sent here.">
            <Form.Item
              name="contactEmail"
              label={<Label>Billing email</Label>}
              rules={[
                { required: true, message: "Please enter a billing email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" placeholder="billing@company.com" autoComplete="email" className="rounded-xl! border-border! bg-card!" />
            </Form.Item>
          </FormSection>

          <FormSection title="Plan & cycle" description="Subscription tier and how often the customer is billed.">
            <div>
              <Label className="mb-2 block">Plan</Label>
              <Form.Item name="plan" rules={[{ required: true, message: "Please select a plan" }]}>
                <div className="grid grid-cols-2 gap-2">
                  {SUBSCRIPTION_PLAN_FILTER_OPTIONS.map((option) => {
                    const isSelected = selectedPlan === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => form.setFieldValue("plan", option.value)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-xl border px-3.5 py-3 text-left transition-all",
                          isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25",
                        )}
                      >
                        <span
                          className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide", PLAN_STYLES[option.value])}
                        >
                          {option.value}
                        </span>
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Form.Item>
            </div>

            <div>
              <Label className="mb-2 block">Billing cycle</Label>
              <Form.Item name="billingCycle" rules={[{ required: true, message: "Please select a billing cycle" }]}>
                <div className="grid grid-cols-2 gap-2">
                  {SUBSCRIPTION_BILLING_FILTER_OPTIONS.map((option) => {
                    const isSelected = selectedBillingCycle === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => form.setFieldValue("billingCycle", option.value)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-xl border px-3.5 py-3 text-sm font-medium transition-all",
                          isSelected ? "border-primary bg-feature-sync text-primary shadow-sm" : "border-border bg-card text-foreground hover:border-primary/25",
                        )}
                      >
                        {option.label}
                        {isSelected ? <CheckOutlined className="text-xs" /> : null}
                      </button>
                    );
                  })}
                </div>
              </Form.Item>
            </div>
          </FormSection>

          <FormSection title="Amount & renewal" description="Billing amount and next renewal date.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Form.Item
                name="amount"
                label={<Label>Amount (USD)</Label>}
                rules={[
                  { required: true, message: "Please enter an amount" },
                  { type: "number", min: 0, message: "Amount must be zero or greater" },
                ]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  prefix="$"
                  className="w-full! rounded-xl! [&_.ant-input-number-input]:rounded-xl!"
                  controls={false}
                  onKeyDown={(event) => {
                    if (["e", "E", "+", "-"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="renewalDate"
                label={<Label>Renewal date</Label>}
                rules={[{ required: true, message: "Please select a renewal date" }]}
              >
                <DatePicker placeholder="Select renewal date" />
              </Form.Item>
            </div>

            {typeof amount === "number" ? (
              <p className="text-xs text-muted">
                New billing total: <span className="font-semibold text-foreground">{formatCurrency(amount, "USD", 2)}</span>
                {selectedBillingCycle ? ` / ${selectedBillingCycle.toLowerCase()}` : null}
              </p>
            ) : null}
          </FormSection>

          <FormSection title="Subscription status" description="Current lifecycle state for this account.">
            <Form.Item name="status" rules={[{ required: true, message: "Please select a status" }]}>
              <div className="space-y-2">
                {SUBSCRIPTION_STATUS_FILTER_OPTIONS.map((option) => {
                  const isSelected = selectedStatus === option.value;
                  const statusStyle = SUBSCRIPTION_STATUS_STYLES[option.value];

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => form.setFieldValue("status", option.value)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                        isSelected ? "border-primary bg-feature-sync shadow-sm" : "border-border bg-card hover:border-primary/25",
                      )}
                    >
                      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusStyle.dot)} />
                      <span className="text-sm font-medium text-foreground">{statusStyle.label}</span>
                      {isSelected ? <CheckOutlined className="ml-auto text-sm text-primary" /> : null}
                    </button>
                  );
                })}
              </div>
            </Form.Item>
          </FormSection>
        </Form>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Button size="large" onClick={onClose} disabled={submitting} className="h-11! rounded-xl! font-medium! sm:min-w-30">
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<EditOutlined />}
          loading={submitting}
          disabled={!record}
          onClick={() => form.submit()}
          className="h-11! rounded-xl! font-semibold! sm:min-w-40"
        >
          Save changes
        </Button>
      </div>
    </Modal>
  );
}

export default React.memo(SubscriptionEditBillingModal);
