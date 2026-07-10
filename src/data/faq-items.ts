export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "trial",
    question: "How does the 14-day trial work?",
    answer:
      "You get full access to all Pro features for 14 days. No credit card is required to start. At the end of the trial, you can choose to upgrade or revert to the free Starter plan.",
  },
  {
    id: "security",
    question: "Is my data secure with Orbit?",
    answer:
      "Yes. Orbit uses enterprise-grade encryption in transit and at rest, role-based access controls, and regular third-party security audits to keep your workspace data protected.",
  },
  {
    id: "import",
    question: "Can we import data from Jira or Trello?",
    answer:
      "Absolutely. You can import boards, tasks, and team members from Jira and Trello using our guided migration tools, so your team can switch without losing momentum.",
  },
  {
    id: "non-profits",
    question: "Do you offer discounts for non-profits?",
    answer:
      "We do. Eligible non-profit and educational organizations receive discounted pricing on Pro and Enterprise plans. Contact our sales team to learn more.",
  },
];

export default FAQ_ITEMS;
