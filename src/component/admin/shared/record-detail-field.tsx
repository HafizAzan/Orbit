import type { ReactNode } from "react";
import { Text } from "../../ui/typography";

type RecordDetailFieldProps = {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
  className?: string;
};

function RecordDetailField({ label, value, children, className }: RecordDetailFieldProps) {
  return (
    <div className={className}>
      <Text size="xs" weight="semibold" color="muted" className="tracking-wide uppercase">{label}</Text>
      <div className="mt-1.5 text-sm font-medium text-foreground">{children ?? value}</div>
    </div>
  );
}

export default RecordDetailField;
