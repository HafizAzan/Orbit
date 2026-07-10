import {
  ClockCircleOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import type { FaqItem } from "./faq-items";

export type ContactInfoItem = {
  id: string;
  label: string;
  value: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
};

export type ContactInfoGroup = {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: ContactInfoItem[];
};

export const CONTACT_HERO = {
  title: "Contact Us",
  description:
    "Have a question about Orbit? Our team is here to help you streamline your workflow and scale your operations.",
};

export const CONTACT_INFO_GROUPS: ContactInfoGroup[] = [
  {
    id: "support",
    title: "Support",
    icon: CustomerServiceOutlined,
    items: [
      { id: "support-email", label: "Email", value: "support@Orbit.io", href: "mailto:support@Orbit.io", icon: MailOutlined },
      { id: "support-phone", label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567", icon: PhoneOutlined },
      { id: "support-chat", label: "Live Chat", value: "Available 24/7", icon: CustomerServiceOutlined },
    ],
  },
  {
    id: "sales",
    title: "Sales",
    icon: ShopOutlined,
    items: [
      { id: "sales-email", label: "Email", value: "sales@Orbit.io", href: "mailto:sales@Orbit.io", icon: MailOutlined },
      { id: "sales-phone", label: "Phone", value: "+1 (555) 987-6543", href: "tel:+15559876543", icon: PhoneOutlined },
    ],
  },
  {
    id: "hours",
    title: "Hours",
    icon: ClockCircleOutlined,
    items: [{ id: "hours-value", label: "Business hours", value: "Mon–Fri, 9:00 AM – 6:00 PM EST", icon: ClockCircleOutlined }],
  },
  {
    id: "location",
    title: "Location",
    icon: EnvironmentOutlined,
    items: [{ id: "location-value", label: "Headquarters", value: "San Francisco, CA", icon: EnvironmentOutlined }],
  },
];

export const CONTACT_SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "sales", label: "Sales & Pricing" },
  { value: "partnership", label: "Partnership" },
  { value: "billing", label: "Billing" },
  { value: "enterprise", label: "Enterprise" },
];

export const CONTACT_FAQ_ITEMS: FaqItem[] = [
  {
    id: "response-time",
    question: "How quickly will I receive a response?",
    answer:
      "Our support team typically responds within 24 hours on business days. Priority and Enterprise customers receive faster response times.",
  },
  {
    id: "demo",
    question: "Can I schedule a product demo?",
    answer:
      "Yes. Select Sales & Pricing as your subject and mention you'd like a demo. Our team will reach out to schedule a walkthrough.",
  },
  {
    id: "enterprise",
    question: "Do you offer enterprise support?",
    answer:
      "Orbit Enterprise includes dedicated account management, SLA-backed support, and custom onboarding. Contact sales for details.",
  },
  {
    id: "security-contact",
    question: "How do I report a security issue?",
    answer:
      "Please email security@Orbit.io with details of the vulnerability. We take responsible disclosure seriously and respond promptly.",
  },
];
