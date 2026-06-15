import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type SkeletonProps = ComponentPropsWithoutRef<"div">;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-linear-to-r from-muted/15 via-muted/30 to-muted/15", className)}
      {...props}
    />
  );
}

export default Skeleton;
