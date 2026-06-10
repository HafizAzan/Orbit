import { InboxOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Paragraph, Title } from "./typography";

type TableEmptyProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function TableEmpty({
  title = "No data found",
  description = "There are no records to display yet.",
  action,
  className,
}: TableEmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-feature-sync text-primary">
        <InboxOutlined className="text-3xl" />
      </div>

      <Title level={5} className="mb-2 text-foreground">
        {title}
      </Title>

      <Paragraph size="sm" color="muted" className="mb-0! max-w-sm">
        {description}
      </Paragraph>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default TableEmpty;
export type { TableEmptyProps };
