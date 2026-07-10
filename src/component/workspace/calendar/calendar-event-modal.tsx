import { CalendarOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import { useGenerateCalendarDraft } from "../../../hooks/use-ai";
import { useProjectsForSelect } from "../../../hooks/use-workspace-projects";
import { showApiErrorToast, showApiSuccessToast } from "../../../lib/api-error";
import Modal from "../../ui/modal";
import { Label, Paragraph, Title } from "../../ui/typography";
import DatePicker from "../../ui/date-picker";

type CalendarEventModalProps = {
  open: boolean;
  mode?: "create" | "edit";
  defaultDate?: string;
  initialValues?: Partial<CalendarEventFormValues>;
  onClose: () => void;
  onSubmit: (values: CalendarEventFormValues) => Promise<void>;
  submitting?: boolean;
};

export type CalendarEventFormValues = {
  title: string;
  date: string;
  type: "team" | "deadline";
  projectId?: string;
  description?: string;
};

const EVENT_TYPE_OPTIONS = [
  { value: "team", label: "Team Event" },
  { value: "deadline", label: "Deadline" },
];

function CalendarEventModal({
  open,
  mode = "create",
  defaultDate = "",
  initialValues,
  onClose,
  onSubmit,
  submitting = false,
}: CalendarEventModalProps) {
  const [form] = Form.useForm<CalendarEventFormValues>();
  const { data: projects = [] } = useProjectsForSelect();
  const { mutateAsync: generateDraft, isPending: drafting } = useGenerateCalendarDraft();
  const isEdit = mode === "edit";
  const watchedTitle = Form.useWatch("title", form) ?? "";
  const watchedProjectId = Form.useWatch("projectId", form);
  const watchedDescription = Form.useWatch("description", form) ?? "";

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      title: initialValues?.title ?? "",
      date: initialValues?.date ?? defaultDate,
      type: initialValues?.type ?? "team",
      projectId: initialValues?.projectId,
      description: initialValues?.description ?? "",
    });
  }, [defaultDate, form, initialValues, open]);

  const handleFinish = async (values: CalendarEventFormValues) => {
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        projectId: values.projectId || undefined,
      });
      showApiSuccessToast(isEdit ? "Event updated." : "Event created.");
      onClose();
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  const handleAiDraft = async () => {
    const notes =
      watchedDescription.trim() ||
      watchedTitle.trim() ||
      "Draft a useful team meeting agenda for this workspace calendar event.";
    const projectName = projects.find((project) => project.id === watchedProjectId)?.title;

    try {
      const result = await generateDraft({
        notes,
        preferredTitle: watchedTitle.trim() || undefined,
        projectName,
      });
      form.setFieldsValue({
        title: result.draft.title,
        type: result.draft.type,
        description: result.draft.description,
      });
      showApiSuccessToast(result.message);
    } catch (error) {
      showApiErrorToast(error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={!submitting && !drafting}
      maskClosable={!submitting && !drafting}
      width={520}
      classNames={{
        container: "rounded-2xl! overflow-hidden! p-0! shadow-xl!",
        header: "hidden!",
        body: "p-0!",
      }}
    >
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-feature-sync text-primary">
              <CalendarOutlined className="text-lg" />
            </span>
            <div>
              <Title level={4} className="mb-0! text-foreground">
                {isEdit ? "Edit Event" : "New Event"}
              </Title>
              <Paragraph size="sm" className="mt-1 mb-0! text-muted">
                {isEdit
                  ? "Update this scheduled team event or deadline."
                  : "Schedule a team event or deadline on your workspace calendar."}
              </Paragraph>
            </div>
          </div>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            loading={drafting}
            disabled={submitting}
            onClick={() => {
              void handleAiDraft();
            }}
          >
            AI Draft
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-5 space-y-4 [&_.ant-form-item]:mb-0!"
          onFinish={handleFinish}
        >
          <Form.Item
            name="title"
            label={<Label>Title</Label>}
            rules={[{ required: true, message: "Please enter an event title" }]}
          >
            <Input size="large" placeholder="e.g. Sprint planning" className="rounded-xl!" disabled={drafting} />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Form.Item
              name="date"
              label={<Label>Date</Label>}
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker placeholder="mm/dd/yyyy" className="w-full" />
            </Form.Item>

            <Form.Item
              name="type"
              label={<Label>Type</Label>}
              rules={[{ required: true, message: "Please select an event type" }]}
            >
              <Select size="large" options={EVENT_TYPE_OPTIONS} className="w-full" disabled={drafting} />
            </Form.Item>
          </div>

          <Form.Item name="projectId" label={<Label>Project</Label>} extra="Optional — link this event to a project.">
            <Select
              allowClear
              size="large"
              placeholder="Select project"
              options={projects.map((project) => ({
                value: project.id,
                label: project.title,
              }))}
              className="w-full"
              disabled={drafting}
            />
          </Form.Item>

          <Form.Item name="description" label={<Label>Description</Label>}>
            <Input.TextArea
              rows={3}
              maxLength={1000}
              showCount
              placeholder="Add notes for your team..."
              className="rounded-xl!"
              disabled={drafting}
            />
          </Form.Item>
        </Form>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-background/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Button size="large" onClick={onClose} disabled={submitting || drafting} className="rounded-xl!">
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          disabled={drafting}
          onClick={() => form.submit()}
          className="rounded-xl! font-semibold!"
        >
          {isEdit ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </Modal>
  );
}

export default React.memo(CalendarEventModal);
