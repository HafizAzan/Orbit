export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  highlighted?: boolean;
  badge?: string;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams getting started.",
    price: "$0",
    priceSuffix: "/month",
    features: ["Up to 5 users", "Basic Kanban boards", "2GB Storage"],
    ctaLabel: "Start for free",
    ctaHref: "/register",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For scaling organizations.",
    price: "$29",
    priceSuffix: "/user/mo",
    features: ["Unlimited users", "Advanced Analytics", "100GB Storage", "24/7 Priority support"],
    ctaLabel: "Get Started Now",
    ctaHref: "/register",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large-scale infrastructure.",
    price: "Custom",
    features: [
      "Unlimited everything",
      "Custom API integrations",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
  },
];

export default PRICING_PLANS;
