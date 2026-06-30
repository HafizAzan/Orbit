import React from "react";
import { cn } from "../../../lib/utils";
import { Title } from "../../ui/typography";

type MyTasksSectionHeaderProps = {
  title: string;
  count: number;
  accentClass?: string;
};

function MyTasksSectionHeader({ title, count, accentClass = "bg-primary" }: MyTasksSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Title level={5} color="default">{title}</Title>
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
