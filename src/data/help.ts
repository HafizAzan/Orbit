import {
  ApiOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  LockOutlined,
  MailOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import type { FaqItem } from "./faq-items";
import { UN_AUTH_ROUTES } from "../router/public-routes";

export type HelpQuickLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export type HelpTopic = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconBackground: "sync" | "security" | "workflow";
  articleCount: number;
};

export type HelpGuide = {
  id: string;
  category: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  ctaLabel: string;
  icon: ComponentType<{ className?: string }>;
  iconBackground: "sync" | "security" | "workflow";
};

export type HelpFaqItem = FaqItem & {
  topicId: HelpTopic["id"];
};

export const HELP_HERO = {
  badge: "Help Center",
  title: "How can we help you?",
  description:
    "Find answers, browse guides, and get support for FlowSync — whether you are setting up your first workspace or managing an enterprise rollout.",
  searchPlaceholder: "Search help articles and FAQs...",
};

export const HELP_QUICK_LINKS: HelpQuickLink[] = [
  {
    id: "contact",
    title: "Contact support",
    description: "Reach our team for product or billing questions.",
    href: UN_AUTH_ROUTES.CONTACT,
    icon: CustomerServiceOutlined,
  },
  {
    id: "email",
    title: "Email us",
    description: "support@flowsync.io — we reply within 24 hours.",
    href: "mailto:support@flowsync.io",
    icon: MailOutlined,
  },
  {
    id: "docs",
    title: "Product guides",
    description: "Step-by-step walkthroughs for common tasks.",
    href: "#help-guides",
    icon: BookOutlined,
  },
  {
    id: "status",
    title: "System status",
    description: "Check platform uptime and incident updates.",
    href: UN_AUTH_ROUTES.CONTACT,
    icon: ThunderboltOutlined,
  },
];

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "getting-started",
    title: "Getting started",
    description: "Workspace setup, invites, and your first project.",
    icon: RocketOutlined,
    iconBackground: "sync",
    articleCount: 6,
  },
  {
    id: "workflows",
    title: "Workflows & boards",
    description: "Kanban, automations, and delivery workflows.",
    icon: ThunderboltOutlined,
    iconBackground: "workflow",
    articleCount: 8,
  },
  {
    id: "team",
    title: "Team & permissions",
    description: "Roles, access control, and organization settings.",
    icon: TeamOutlined,
    iconBackground: "sync",
    articleCount: 5,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect Slack, Jira, GitHub, and more.",
    icon: ApiOutlined,
    iconBackground: "workflow",
    articleCount: 7,
  },
  {
    id: "billing",
    title: "Billing & plans",
    description: "Subscriptions, invoices, and plan upgrades.",
    icon: FileTextOutlined,
    iconBackground: "security",
    articleCount: 4,
  },
  {
    id: "security",
    title: "Security & compliance",
    description: "Data protection, SSO, and audit logs.",
    icon: LockOutlined,
    iconBackground: "security",
    articleCount: 5,
  },
];

export const HELP_GUIDES: HelpGuide[] = [
  {
    id: "workspace-setup",
    category: "Guide",
    title: "Set up your workspace in 15 minutes",
    description: "Create your organization, invite teammates, and configure your first board with our quick-start checklist.",
    meta: "8 min read",
    href: UN_AUTH_ROUTES.REGISTER,
    ctaLabel: "Read guide",
    icon: BookOutlined,
    iconBackground: "sync",
  },
  {
    id: "automation",
    category: "Guide",
    title: "Automate repetitive workflows",
    description: "Build triggers, status rules, and notifications so your team spends less time on manual updates.",
    meta: "12 min read",
    href: UN_AUTH_ROUTES.REGISTER,
    ctaLabel: "Read guide",
    icon: ThunderboltOutlined,
    iconBackground: "workflow",
  },
  {
    id: "enterprise-security",
    category: "Guide",
    title: "Enterprise security checklist",
    description: "SSO, role-based access, audit trails, and data retention — everything admins need for a secure rollout.",
    meta: "10 min read",
    href: UN_AUTH_ROUTES.CONTACT,
    ctaLabel: "Read guide",
    icon: SafetyCertificateOutlined,
    iconBackground: "security",
  },
  {
    id: "onboarding-webinar",
    category: "Webinar",
    title: "Admin onboarding walkthrough",
    description: "Watch how platform admins manage organizations, users, and subscriptions from the FlowSync console.",
    meta: "35 min session",
    href: UN_AUTH_ROUTES.CONTACT,
    ctaLabel: "Watch replay",
    icon: PlayCircleOutlined,
    iconBackground: "sync",
  },
];

export const HELP_FAQ_ITEMS: HelpFaqItem[] = [
  {
    id: "create-workspace",
    topicId: "getting-started",
    question: "How do I create my first workspace?",
    answer:
      "Sign up for FlowSync, choose your organization name, and follow the onboarding wizard. You can invite teammates by email or share an invite link from Settings → Team.",
  },
  {
    id: "invite-team",
    topicId: "getting-started",
    question: "How do I invite teammates?",
    answer:
      "Go to Settings → Team and click Invite members. Enter email addresses and assign roles (Admin, Manager, or Member). Invited users receive an email with a secure join link.",
  },
  {
    id: "import-data",
    topicId: "getting-started",
    question: "Can I import boards from Jira or Trello?",
    answer:
      "Yes. Use Settings → Import to connect Jira or Trello and map fields to FlowSync boards. Most teams complete a basic migration in under an hour.",
  },
  {
    id: "automations",
    topicId: "workflows",
    question: "How do workflow automations work?",
    answer:
      "Automations run when a trigger condition is met — for example, moving a card to Done can notify Slack or assign a reviewer. Build rules from any board's Automations tab.",
  },
  {
    id: "custom-fields",
    topicId: "workflows",
    question: "Can I add custom fields to cards?",
    answer:
      "Pro and Enterprise plans support custom fields including text, numbers, dates, and dropdowns. Configure them per board from Board settings → Fields.",
  },
  {
    id: "roles",
    topicId: "team",
    question: "What is the difference between Admin and Manager roles?",
    answer:
      "Admins manage billing, organization settings, invites, and all workspace members. Managers create projects, add invited members to their project squads, assign tasks, and can remove members from projects they lead. They cannot invite users, change org roles, or access billing and settings.",
  },
  {
    id: "sso",
    topicId: "security",
    question: "Does FlowSync support SSO?",
    answer:
      "Enterprise plans include SAML SSO with providers like Okta, Azure AD, and Google Workspace. Contact sales to enable SSO for your organization.",
  },
  {
    id: "data-backup",
    topicId: "security",
    question: "How is my data backed up?",
    answer:
      "FlowSync performs continuous replication with daily snapshots retained for 30 days on all paid plans. Enterprise customers can request extended retention and export schedules.",
  },
  {
    id: "slack-integration",
    topicId: "integrations",
    question: "How do I connect Slack?",
    answer:
      "Open Settings → Integrations, select Slack, and authorize your workspace. Choose which channels receive notifications for mentions, status changes, and daily digests.",
  },
  {
    id: "upgrade-plan",
    topicId: "billing",
    question: "How do I upgrade or change my plan?",
    answer:
      "Organization admins can upgrade from Settings → Billing. Changes take effect immediately and are prorated. Downgrades apply at the end of the current billing cycle.",
  },
  {
    id: "invoice",
    topicId: "billing",
    question: "Where can I find invoices?",
    answer:
      "All invoices are available under Settings → Billing → Invoices. You can download PDF copies and update billing contacts from the same page.",
  },
  {
    id: "cancel-subscription",
    topicId: "billing",
    question: "What happens if I cancel my subscription?",
    answer:
      "Your workspace remains active until the end of the paid period. After that, you move to view-only access for 30 days before data is archived per our retention policy.",
  },
];

export const HELP_CTA = {
  title: "Still need help?",
  description: "Our support team is ready to assist with setup, billing, and enterprise questions.",
  primaryLabel: "Contact support",
  secondaryLabel: "Talk to sales",
};
