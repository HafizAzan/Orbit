import {
  AuditOutlined,
  CloudOutlined,
  FileProtectOutlined,
  GlobalOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type LegalSection = {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  paragraphs: string[];
};

export type LegalDocument = {
  hero: {
    title: string;
    description: string;
  };
  sidebar: {
    title: string;
    description: string;
    effectiveDate: string;
    lastUpdated: string;
  };
  content: {
    title: string;
    description: string;
  };
  sections: LegalSection[];
};

export const TERMS_OF_SERVICE: LegalDocument = {
  hero: {
    title: "Terms of Service",
    description:
      "Please read these terms carefully before using FlowSync. By accessing or using our platform, you agree to be bound by these terms.",
  },
  sidebar: {
    title: "Document overview",
    description: "Navigate sections or review key dates for this agreement.",
    effectiveDate: "January 1, 2026",
    lastUpdated: "June 1, 2026",
  },
  content: {
    title: "Terms of Service",
    description: "The following terms govern your access to and use of the FlowSync platform and related services.",
  },
  sections: [
    {
      id: "agreement",
      title: "Agreement to Terms",
      icon: FileProtectOutlined,
      paragraphs: [
        "These Terms of Service constitute a legally binding agreement between you and FlowSync Inc. regarding your use of our website, applications, and services.",
        "If you do not agree to these terms, you may not access or use FlowSync. If you are using FlowSync on behalf of an organization, you represent that you have authority to bind that organization.",
      ],
    },
    {
      id: "use-of-service",
      title: "Use of Service",
      icon: CloudOutlined,
      paragraphs: [
        "FlowSync provides workflow automation and team collaboration tools. You may use the service only for lawful business purposes and in accordance with these terms.",
        "We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will make reasonable efforts to notify you of material changes.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts & Registration",
      icon: UserOutlined,
      paragraphs: [
        "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.",
        "You must notify us immediately of any unauthorized use of your account. FlowSync is not liable for losses arising from unauthorized access where you failed to safeguard your credentials.",
      ],
    },
    {
      id: "billing",
      title: "Subscriptions & Billing",
      icon: AuditOutlined,
      paragraphs: [
        "Paid plans are billed in advance on a recurring basis according to the plan you select. Fees are non-refundable except where required by law or explicitly stated in your order.",
        "You may upgrade, downgrade, or cancel your subscription through your account settings. Changes take effect at the start of the next billing cycle unless otherwise noted.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      icon: SafetyCertificateOutlined,
      paragraphs: [
        "You agree not to misuse FlowSync, including by attempting to gain unauthorized access, interfering with service operation, uploading malicious code, or violating applicable laws.",
        "We may investigate and take appropriate action against violations, including suspension or termination of your account without prior notice in serious cases.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: LockOutlined,
      paragraphs: [
        "FlowSync and its licensors retain all rights to the platform, branding, and underlying technology. These terms do not grant you any ownership rights in our intellectual property.",
        "You retain ownership of content you submit to FlowSync. You grant us a limited license to host, process, and display your content solely to provide the service.",
      ],
    },
    {
      id: "termination",
      title: "Termination",
      icon: TeamOutlined,
      paragraphs: [
        "You may stop using FlowSync at any time by closing your account. We may suspend or terminate access if you breach these terms or if required for legal or security reasons.",
        "Upon termination, your right to use the service ceases. Provisions that by nature should survive termination will remain in effect.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: GlobalOutlined,
      paragraphs: [
        "To the maximum extent permitted by law, FlowSync shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the service.",
        "Our total liability for any claim related to the service is limited to the amount you paid to FlowSync in the twelve months preceding the event giving rise to the claim.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      icon: MailOutlined,
      paragraphs: [
        "Questions about these Terms of Service may be directed to legal@flowsync.io or via our contact page. We aim to respond to legal inquiries within five business days.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  hero: {
    title: "Privacy Policy",
    description:
      "This policy explains how FlowSync collects, uses, and protects your personal information when you use our platform and services.",
  },
  sidebar: {
    title: "Document overview",
    description: "Jump to a section or review when this policy was last updated.",
    effectiveDate: "January 1, 2026",
    lastUpdated: "June 1, 2026",
  },
  content: {
    title: "Privacy Policy",
    description: "We are committed to transparency about how we handle your data and the choices available to you.",
  },
  sections: [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: UserOutlined,
      paragraphs: [
        "We collect information you provide directly, such as your name, email address, company name, billing details, and content you upload to FlowSync.",
        "We also collect usage data automatically, including device information, log data, IP address, browser type, and interactions with our platform to improve performance and security.",
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Information",
      icon: CloudOutlined,
      paragraphs: [
        "We use your information to provide, maintain, and improve FlowSync, process transactions, send service-related communications, and respond to support requests.",
        "We may use aggregated or de-identified data for analytics, product development, and understanding how our services are used.",
      ],
    },
    {
      id: "data-sharing",
      title: "Data Sharing",
      icon: TeamOutlined,
      paragraphs: [
        "We do not sell your personal information. We may share data with trusted service providers who assist in hosting, payment processing, analytics, and customer support under strict confidentiality obligations.",
        "We may disclose information when required by law, to protect rights and safety, or in connection with a merger, acquisition, or sale of assets with appropriate safeguards.",
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: AuditOutlined,
      paragraphs: [
        "We retain personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.",
        "When data is no longer required, we delete or anonymize it in accordance with our retention schedules and applicable law.",
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: LockOutlined,
      paragraphs: [
        "We implement technical and organizational measures designed to protect your information, including encryption in transit, access controls, and regular security assessments.",
        "No method of transmission or storage is completely secure. We encourage you to use strong passwords and enable available security features on your account.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: SafetyCertificateOutlined,
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, delete, or export your personal data, and to object to or restrict certain processing activities.",
        "To exercise these rights, contact privacy@flowsync.io. We will verify your request and respond within the timeframe required by applicable law.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: FileProtectOutlined,
      paragraphs: [
        "We use cookies and similar technologies to remember preferences, authenticate sessions, and analyze site traffic. You can manage cookie preferences through your browser settings.",
        "Disabling certain cookies may affect the functionality of some FlowSync features.",
      ],
    },
    {
      id: "international",
      title: "International Transfers",
      icon: GlobalOutlined,
      paragraphs: [
        "Your information may be processed in countries other than your own. Where required, we use appropriate safeguards such as standard contractual clauses to protect cross-border transfers.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: MailOutlined,
      paragraphs: [
        "For privacy-related questions or requests, email privacy@flowsync.io or visit our contact page. Our Data Protection team will assist you promptly.",
      ],
    },
  ],
};
