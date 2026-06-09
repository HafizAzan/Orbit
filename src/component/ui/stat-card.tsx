import { cn } from "../../lib/utils";

type StatCardProps = {
  value: string;
  label: string;
  className?: string;
};

function StatCard({ value, label, className }: StatCardProps) {
  return (
    <article className={cn("rounded-xl border border-border bg-card px-5 py-4 shadow-sm nav:px-6 nav:py-5", className)}>
      <p className="text-3xl font-bold text-primary nav:text-4xl">{value}</p>
      <p className="mt-1 text-sm font-medium text-muted">{label}</p>
    </article>
  );
}

export default StatCard;
