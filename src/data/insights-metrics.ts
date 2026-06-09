export type InsightMetric = {
  value: string;
  label: string;
};

const INSIGHT_METRICS: InsightMetric[] = [
  {
    value: "45%",
    label: "Efficiency Increase",
  },
  {
    value: "12h",
    label: "Weekly Time Saved",
  },
];

export default INSIGHT_METRICS;
