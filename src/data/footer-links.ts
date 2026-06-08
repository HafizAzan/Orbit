import { InstagramOutlined, LinkedinOutlined, XOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type FooterLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const FOOTER_LINKS: FooterLink[] = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms of Service",
    href: "/terms-of-service",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Twitter", href: "https://twitter.com", icon: XOutlined },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramOutlined },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinOutlined },
];

export default FOOTER_LINKS;
