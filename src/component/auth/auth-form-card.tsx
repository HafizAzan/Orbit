import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/utils";

type AuthFormCardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

function AuthFormCard({ children, className, ...props }: AuthFormCardProps) {
  return (
    <div
      className={cn("w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default AuthFormCard;
