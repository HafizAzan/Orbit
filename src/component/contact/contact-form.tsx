import { SendOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { CONTACT_SUBJECT_OPTIONS } from "../../data/contact";
import { delay } from "../../lib/helper";
import { toast } from "../../lib/toast";
import { Label } from "../ui/typography";

type ContactFormValues = {
  fullName: string;
  email: string;
  companyName: string;
  subject: string;
  message: string;
};

function ContactForm() {
  const [form] = Form.useForm<ContactFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (_values: ContactFormValues) => {
    setSubmitting(true);

    try {
      await delay(800);
      toast.success("Message sent successfully. We'll get back to you soon.");
      form.resetFields();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Send us a message</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">Share a few details and we&apos;ll route your request to the right team.</p>
      </div>

      <Form form={form} layout="vertical" requiredMark={false} className="mt-8 flex flex-1 flex-col [&_.ant-form-item]:mb-4" onFinish={handleFinish}>
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item name="fullName" label={<Label>Full name</Label>} rules={[{ required: true, message: "Please enter your full name" }]}>
            <Input size="large" placeholder="John Doe" autoComplete="name" className="rounded-xl! border-border! bg-background!" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Label>Email address</Label>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" placeholder="you@company.com" autoComplete="email" className="rounded-xl! border-border! bg-background!" />
          </Form.Item>

          <Form.Item name="companyName" label={<Label>Company name</Label>}>
            <Input size="large" placeholder="Acme Inc." autoComplete="organization" className="rounded-xl! border-border! bg-background!" />
          </Form.Item>

          <Form.Item name="subject" label={<Label>Subject</Label>} rules={[{ required: true, message: "Please select a subject" }]}>
            <Select
              size="large"
              placeholder="Select a subject"
              options={CONTACT_SUBJECT_OPTIONS}
              className="w-full [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-border! [&_.ant-select-selector]:bg-background!"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="message"
          label={<Label>Message</Label>}
          rules={[
            { required: true, message: "Please enter your message" },
            { min: 10, message: "Message must be at least 10 characters" },
          ]}
          className="flex-1"
        >
          <Input.TextArea rows={5} placeholder="Tell us how we can help..." className="rounded-xl! border-border! bg-background! resize-none!" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={submitting}
          icon={<SendOutlined />}
          className="mt-2 h-11! rounded-xl! font-semibold! shadow-sm"
        >
          Send Message
        </Button>
      </Form>
    </div>
  );
}

export default React.memo(ContactForm);
