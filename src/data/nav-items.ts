import { BookOutlined, BulbOutlined, DollarOutlined, StarOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  sectionId: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Features",
    sectionId: "feature",
    icon: StarOutlined,
  },
  {
    label: "Solutions",
    sectionId: "solutions",
    icon: BulbOutlined,
  },
  {
    label: "Pricing",
    sectionId: "pricing",
    icon: DollarOutlined,
  },
  {
    label: "Resources",
    sectionId: "resources",
    icon: BookOutlined,
  },
];

export default NAV_ITEMS;
