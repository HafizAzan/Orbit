import { BookOutlined, FileTextOutlined, PlayCircleOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";
import { UN_AUTH_ROUTES } from "../router/public-routes";

export type ResourceCategory = "Guide" | "Template" | "Webinar";

export type ResourceItem = {
  id: string;
  category: ResourceCategory;
  title: string;
  description: string;
  meta: string;
  href: string;
  ctaLabel: string;
  icon: ComponentType<{ className?: string }>;
  iconBackground: "sync" | "security" | "workflow";
};

const RESOURCE_ITEMS: ResourceItem[] = [
  {
    id: "getting-started",
    category: "Guide",
    title: "Getting started with FlowSync",
    description: "Set up your workspace, invite your team, and ship your first project in under 15 minutes.",
    meta: "8 min read",
    href: UN_AUTH_ROUTES.REGISTER,
    ctaLabel: "Read guide",
    icon: BookOutlined,
    iconBackground: "sync",
  },
  {
    id: "automation-playbook",
    category: "Template",
    title: "Workflow automation playbook",
    description: "Copy-ready board templates and trigger recipes for product, engineering, and ops teams.",
    meta: "Free download",
    href: UN_AUTH_ROUTES.REGISTER,
    ctaLabel: "Get template",
    icon: FileTextOutlined,
    iconBackground: "workflow",
  },
  {
    id: "enterprise-webinar",
    category: "Webinar",
    title: "Scaling teams without the chaos",
    description: "Learn how enterprise leaders unify delivery, reporting, and cross-team visibility with FlowSync.",
    meta: "45 min session",
    href: UN_AUTH_ROUTES.CONTACT,
    ctaLabel: "Watch replay",
    icon: PlayCircleOutlined,
    iconBackground: "security",
  },
];

export default RESOURCE_ITEMS;
