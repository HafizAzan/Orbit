import type { ReactNode } from "react";

type RecordDetailFieldProps = {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
  className?: string;
};

function RecordDetailField({ label, value, children, className }: RecordDetailFieldProps) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <div className="mt-1.5 text-sm font-medium text-foreground">{children ?? value}</div>
    </div>
  );
}

export default RecordDetailField;
