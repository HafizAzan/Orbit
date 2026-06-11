import { BulbOutlined, HeartOutlined, TeamOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type AboutStat = {
  id: string;
  value: string;
  label: string;
};

export type AboutMilestone = {
  id: string;
  year: string;
  label: string;
};

export type AboutValue = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

export const ABOUT_HERO = {
  badge: "About Us",
  title: "Building the future of synchronized teamwork",
  description:
    "FlowSync helps enterprise teams move faster together — unifying workflows, communication, and delivery in one seamless platform built for scale.",
};

export const ABOUT_STATS: AboutStat[] = [
  { id: "companies", value: "10K+", label: "Companies" },
  { id: "users", value: "1M+", label: "Users worldwide" },
  { id: "uptime", value: "99.9%", label: "Uptime guarantee" },
];

export const ABOUT_STORY = {
  title: "How it all started",
  paragraphs: [
    "FlowSync began when our founders noticed a painful gap: teams were drowning in disconnected tools, endless status meetings, and manual handoffs that slowed every project down.",
    "We set out to build a platform where planning, execution, and collaboration live in one flow — so teams can focus on outcomes, not overhead. Today, FlowSync powers organizations across the globe.",
  ],
  milestones: [
    { id: "founded", year: "2018", label: "Founded" },
    { id: "series-a", year: "2021", label: "Series A" },
    { id: "global", year: "2024", label: "Global Expansion" },
  ] satisfies AboutMilestone[],
};

export const ABOUT_VALUES: AboutValue[] = [
  {
    id: "passion",
    title: "Passion",
    description: "We care deeply about solving real workflow problems and delivering experiences teams love to use every day.",
    icon: HeartOutlined,
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description: "Great products are built together. We listen, iterate, and ship with our customers at the center of every decision.",
    icon: TeamOutlined,
  },
  {
    id: "innovation",
    title: "Innovation",
    description: "We push boundaries with thoughtful automation and design so teams can work smarter, not harder.",
    icon: BulbOutlined,
  },
];

export const ABOUT_QUOTE = {
  text: "Our vision is to empower every enterprise team to move at the speed of thought, where execution is as seamless as a heartbeat.",
  author: "Sarah Chen",
  role: "Founder & CEO, FlowSync",
};

export const ABOUT_CTA = {
  title: "Ready to sync your workflow?",
  description: "Join thousands of teams already building with FlowSync. Start free or talk to our sales team.",
};
