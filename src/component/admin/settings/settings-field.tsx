import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../../ui/typography";

type SettingsFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

function SettingsField({ label, hint, children, className }: SettingsFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export default SettingsField;
