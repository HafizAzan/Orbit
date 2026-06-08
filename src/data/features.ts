import { SafetyOutlined, SyncOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type FeatureItem = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconBackground: "sync" | "security" | "workflow";
};

const FEATURE_ITEMS: FeatureItem[] = [
  {
    title: "Real-time Sync",
    description: "Changes propagate instantly across all devices and team members with zero latency.",
    icon: SyncOutlined,
    iconBackground: "sync",
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption, SSO, and advanced permission controls to keep your data safe.",
    icon: SafetyOutlined,
    iconBackground: "security",
  },
  {
    title: "Automated Workflows",
    description: "Reduce manual work with powerful trigger-based automation and custom integrations.",
    icon: ThunderboltOutlined,
    iconBackground: "workflow",
  },
];

export default FEATURE_ITEMS;
