export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string;
  rating?: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "sarah-jenkins",
    quote:
      "FlowSync has completely transformed how our product team operates. We've seen a 30% reduction in meeting times since switching.",
    name: "Sarah Jenkins",
    role: "CTO, CloudScale",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    id: "michael-chen",
    quote:
      "The automated workflows are a game changer. We no longer spend hours on manual status updates or notification pings.",
    name: "Michael Chen",
    role: "Head of Product, InnovateAI",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    rating: 5,
  },
  {
    id: "elena-rodriguez",
    quote:
      "Scalability was our biggest concern, but FlowSync handles our 200+ person department without breaking a sweat. It's truly enterprise-grade.",
    name: "Elena Rodriguez",
    role: "VP Engineering, NexusCorp",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    rating: 5,
  },
  {
    id: "david-okonkwo",
    quote:
      "Onboarding new hires used to take weeks. With FlowSync's templates and boards, our teams are productive from day one.",
    name: "David Okonkwo",
    role: "Operations Lead, Vertex Labs",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    rating: 5,
  },
  {
    id: "priya-sharma",
    quote:
      "Cross-functional alignment finally feels effortless. Everyone sees the same source of truth without chasing updates in Slack.",
    name: "Priya Sharma",
    role: "Program Manager, BrightPath",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    rating: 5,
  },
  {
    id: "james-wilson",
    quote:
      "We evaluated several tools, but FlowSync's analytics gave us visibility we never had before. Delivery predictability improved immediately.",
    name: "James Wilson",
    role: "Director of Engineering, StackForge",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    rating: 5,
  },
  {
    id: "ana-martinez",
    quote:
      "Security and compliance were non-negotiable for us. FlowSync checked every box while still being intuitive for the whole org.",
    name: "Ana Martinez",
    role: "CISO, FinEdge",
    avatarUrl: "https://i.pravatar.cc/150?img=23",
    rating: 5,
  },
  {
    id: "tom-harrison",
    quote:
      "Our remote teams across three time zones stay in sync. The Kanban views and automations cut our standups in half.",
    name: "Tom Harrison",
    role: "Agile Coach, OrbitWorks",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    rating: 5,
  },
  {
    id: "lisa-park",
    quote:
      "Customer launches are smoother now. We track dependencies, blockers, and milestones in one place instead of five spreadsheets.",
    name: "Lisa Park",
    role: "Customer Success Lead, PulseHQ",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    id: "marcus-thompson",
    quote:
      "FlowSync scaled with us from 20 to 150 people without a painful migration. Support has been responsive every step of the way.",
    name: "Marcus Thompson",
    role: "CEO, LaunchPad Studio",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
    rating: 5,
  },
];

export default TESTIMONIALS;
