import { BankOutlined, CheckOutlined, EditOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  ORGANIZATION_PLAN_FILTER_OPTIONS,
  ORGANIZATION_STATUS_FILTER_OPTIONS,
  PLAN_STYLES,
  STATUS_STYLES,
  type OrganizationPlan,
  type OrganizationRecord,
  type OrganizationStatus,
} from "../../../data/admin-organizations";
import { useCreateOrganization, useUpdateOrganization } from "../../../hooks/use-admin-organizations";
import { showApiErrorToast } from "../../../lib/api-error";
import { formatDate } from "../../../lib/helper";
import { generateOrganizationSlug } from "../../../lib/organization";
import { cn } from "../../../lib/utils";
import Modal from "../../ui/modal";
import { Label, Paragraph, Text, Title } from "../../ui/typography";

type OrganizationCreateModalProps = {
  open: boolean;
  record?: OrganizationRecord | null;
  onClose: () => void;
};

type OrganizationCreateFormValues = {
  name: string;
  ownerName: string;
  ownerEmail: string;
  plan: OrganizationPlan;
  status: OrganizationStatus;
};

const DEFAULT_FORM_VALUES: OrganizationCreateFormValues = {
  name: "",
  ownerName: "",
  ownerEmail: "",
  plan: "FREE",
  status: "trial",
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

function OrganizationCreateModal({ open, record = null, onClose }: OrganizationCreateModalProps) {
  const isEditMode = record !== null;
  const [form] = Form.useForm<OrganizationCreateFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: createOrganization } = useCreateOrganization();
  const { mutateAsync: updateOrganization } = useUpdateOrganization();

  const organizationName = Form.useWatch("name", form) ?? "";
  const selectedPlan = Form.useWatch("plan", form) ?? DEFAULT_FORM_VALUES.plan;
  const selectedStatus = Form.useWatch("status", form) ?? DEFAULT_FORM_VALUES.status;

  const previewSlug = useMemo(() => {
    if (!organizationName.trim()) return "your-workspace";
    return generateOrganizationSlug(organizationName);
  }, [organizationName]);

  const usersCount = isEditMode ? record.users : 0;
  const projectsCount = isEditMode ? record.projects : 0;
  const createdDateLabel = isEditMode ? formatDate(record.createdAt) : formatDate(new Date());

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSubmitting(false);
      return;
    }

    if (record) {
      form.setFieldsValue({
        name: record.name,
        ownerName: record.ownerName,
        ownerEmail: record.ownerEmail,
        plan: record.plan.code,
        status: record.status,
      });
    } else {
      form.setFieldsValue(DEFAULT_FORM_VALUES);
    }
  }, [open, record, form]);

  const handleFinish = async (values: OrganizationCreateFormValues) => {
    setSubmitting(true);

    try {
      if (isEditMode && record) {
        await updateOrganization({
          id: record.id,
          data: {
            name: values.name,
            status: values.status,
            plan: values.plan,
          },
        });
      } else {
        await createOrganization({
          name: values.name,
          ownerName: values.ownerName,
          ownerEmail: values.ownerEmail,
          plan: values.plan,
          status: values.status,
        });
      }

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
            <BankOutlined className="text-lg" />
          </span>
          <div className="min-w-0">
            <Title level={4} className="mb-0! text-foreground">
              {isEditMode ? "Edit organization" : "Create organization"}
            </Title>
            <Paragraph size="sm" className="mt-1 mb-0! text-muted">
              {isEditMode
                ? "Update workspace details, owner information, or subscription settings."
                : "Set up a new workspace and invite the owner to get started."}
            </Paragraph>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={DEFAULT_FORM_VALUES}
        className="max-h-[min(72vh,38rem)] space-y-4 overflow-y-auto px-6 py-5 [&_.ant-form-item]:mb-0!"
        onFinish={handleFinish}
      >
        <FormSection title="Organization" description="Basic workspace details.">
          <Form.Item name="name" label={<Label>Organization name</Label>} rules={[{ required: true, message: "Please enter the organization name" }]}>
            <Input size="large" placeholder="Acme Corp" autoComplete="organization" className="rounded-xl! border-border! bg-card!" />
          </Form.Item>

          <div>
            <Label className="mb-2 block">Workspace slug</Label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3">
              <span className="min-w-0 flex-1 truncate font-mono text-sm">
                <span className={cn("font-semibold", organizationName.trim() ? "text-primary" : "text-muted")}>
                  {organizationName.trim() ? previewSlug : "your-workspace"}
                </span>
                <span className="text-muted">.flowsync.io</span>
              </span>
              <span className="shrink-0 rounded-full bg-feature-sync px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                Auto
              </span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Owner" description={isEditMode ? "The primary admin for this workspace." : "The primary admin who will receive the invite."}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Form.Item name="ownerName" label={<Label>Owner name</Label>} rules={[{ required: true, message: "Please enter the owner name" }]}>
              <Input size="large" placeholder="John Doe" autoComplete="name" className="rounded-xl! border-border! bg-card!" disabled={isEditMode} />
            </Form.Item>

            <Form.Item
              name="ownerEmail"
              label={<Label>Owner email</Label>}
              rules={[
                { required: true, message: "Please enter the owner email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              extra={isEditMode ? <span className="text-xs text-muted">Owner email cannot be changed from the admin console.</span> : undefined}
            >
              <Input
                size="large"
                placeholder="owner@company.com"
                autoComplete="email"
                className="rounded-xl! border-border! bg-card!"
                disabled={isEditMode}
              />
            </Form.Item>
          </div>
        </FormSection>

        <FormSection title="Subscription" description="Choose the plan and account status.">
          <div>
            <Label className="mb-2 block">Plan</Label>
            <Form.Item name="plan" rules={[{ required: true, message: "Please select a plan" }]}>
              <div className="grid grid-cols-2 gap-2">
                {ORGANIZATION_PLAN_FILTER_OPTIONS.map((option) => {
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
            <Label className="mb-2 block">Status</Label>
            <Form.Item name="status" rules={[{ required: true, message: "Please select a status" }]}>
              <div className="space-y-2">
                {ORGANIZATION_STATUS_FILTER_OPTIONS.map((option) => {
                  const isSelected = selectedStatus === option.value;
                  const statusStyle = STATUS_STYLES[option.value];

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
          </div>
        </FormSection>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-card/80 px-4 py-3">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span className="text-muted">
              Users <span className="font-semibold text-foreground">{usersCount}</span>
            </span>
            <span className="text-muted">
              Projects <span className="font-semibold text-foreground">{projectsCount}</span>
            </span>
            <span className="text-muted">
              Created <span className="font-semibold text-foreground">{createdDateLabel}</span>
            </span>
          </div>
        </div>

        {!isEditMode ? (
          <p className="flex items-center gap-2 px-4 pb-4 text-xs text-muted select-none">
            <MailOutlined className="shrink-0 text-primary" />
            An invite will be sent to the owner after creation.
          </p>
        ) : null}
      </Form>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Button size="large" onClick={onClose} disabled={submitting} className="h-11! rounded-xl! font-medium! sm:min-w-30">
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
          loading={submitting}
          onClick={() => form.submit()}
          className="h-11! rounded-xl! font-semibold! sm:min-w-40"
        >
          {isEditMode ? "Save changes" : "Create organization"}
        </Button>
      </div>
    </Modal>
  );
}

export default React.memo(OrganizationCreateModal);
