import { cn } from "../../lib/utils";
import { Text } from "./typography";

type StatCardProps = {
  value: string;
  label: string;
  className?: string;
};

function StatCard({ value, label, className }: StatCardProps) {
  return (
    <article className={cn("rounded-xl border border-border bg-card px-5 py-4 shadow-sm nav:px-6 nav:py-5", className)}>
      <Text as="p" className="text-3xl font-bold text-primary nav:text-4xl">{value}</Text>
      <Text as="p" size="sm" color="muted" weight="medium" className="mt-1">{label}</Text>
    </article>
  );
}

export default StatCard;
