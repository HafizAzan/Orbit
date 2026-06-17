import React from "react";
import { cn } from "../../../lib/utils";

type MyTasksSectionHeaderProps = {
  title: string;
  count: number;
  accentClass?: string;
};

function MyTasksSectionHeader({ title, count, accentClass = "bg-primary" }: MyTasksSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <span
        className={cn(
          "inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold text-white",
          accentClass,
        )}
      >
        {count}
      </span>
    </div>
  );
}

export default React.memo(MyTasksSectionHeader);
