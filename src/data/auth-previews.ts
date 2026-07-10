export type AuthPreviewKanbanCard = {
  title: string;
  tag: string;
  tagClass: string;
  progress?: number;
};

export type AuthPreviewKanbanColumn = {
  title: string;
  cards: AuthPreviewKanbanCard[];
};

export type LoginPreviewData = {
  teamAvatarIds: number[];
  velocityBars: number[];
  kanbanColumns: AuthPreviewKanbanColumn[];
  testimonial: {
    quote: string;
    author: string;
  };
  velocityLabel: string;
  velocityValue: string;
  teamPerformanceTitle: string;
  teamPerformanceUpdatedAt: string;
  productivityTitle: string;
};

export type RegisterPreviewData = {
  onlineAvatarIds: number[];
  onlineCountLabel: string;
  notification: {
    title: string;
    timeAgo: string;
  };
  kanbanColumns: AuthPreviewKanbanColumn[];
  heading: string;
  description: string;
  trustLabel: string;
};

export const LOGIN_PREVIEW_DATA: LoginPreviewData = {
  teamAvatarIds: [5, 12, 9, 15],
  velocityBars: [40, 55, 45, 70, 60, 85, 75],
  kanbanColumns: [
    {
      title: "To Do",
      cards: [
        { title: "Optimize Login Flow", tag: "DESIGN", tagClass: "bg-feature-sync text-primary" },
        { title: "API Documentation", tag: "DEV", tagClass: "bg-feature-security text-secondary" },
      ],
    },
    {
      title: "In Progress",
      cards: [
        { title: "User Interview Analysis", tag: "RESEARCH", tagClass: "bg-feature-workflow text-primary", progress: 65 },
        { title: "Nav Revision", tag: "UX", tagClass: "bg-feature-sync text-primary" },
      ],
    },
    {
      title: "Done",
      cards: [{ title: "Hero Section", tag: "DESIGN", tagClass: "bg-feature-sync text-primary" }],
    },
  ],
  testimonial: {
    quote:
      "Orbit has completely transformed how our engineering and design teams collaborate on complex projects.",
    author: "Alex Rivera, Head of Product at TechFlow",
  },
  velocityLabel: "Velocity",
  velocityValue: "+14%",
  teamPerformanceTitle: "Team Performance",
  teamPerformanceUpdatedAt: "Updated 2 minutes ago",
  productivityTitle: "Productivity Dashboard",
};

export const REGISTER_PREVIEW_DATA: RegisterPreviewData = {
  onlineAvatarIds: [3, 8, 11],
  onlineCountLabel: "5+ Online",
  notification: {
    title: "Task moved to Done",
    timeAgo: "Just now",
  },
  kanbanColumns: [
    {
      title: "To Do",
      cards: [
        { title: "Sprint Planning", tag: "PLAN", tagClass: "bg-feature-sync text-primary" },
        { title: "Design Review", tag: "DESIGN", tagClass: "bg-feature-workflow text-primary" },
      ],
    },
    {
      title: "In Progress",
      cards: [
        { title: "Auth Flow", tag: "DEV", tagClass: "bg-feature-security text-secondary", progress: 72 },
        { title: "Dashboard UI", tag: "UX", tagClass: "bg-feature-sync text-primary" },
      ],
    },
    {
      title: "Done",
      cards: [{ title: "Landing Page", tag: "SHIP", tagClass: "bg-feature-workflow text-primary" }],
    },
  ],
  heading: "Velocity redefined.",
  description: "Used by the world's most innovative product teams to ship faster and better.",
  trustLabel: "Trusted by 10,000+ teams worldwide",
};
