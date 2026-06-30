import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Label, Paragraph } from "../../ui/typography";

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
      {hint ? <Paragraph size="xs" className="mb-0!">{hint}</Paragraph> : null}
    </div>
  );
}

export default SettingsField;
